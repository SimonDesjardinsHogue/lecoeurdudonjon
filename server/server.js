import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { networkInterfaces } from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Configuration
const PORT = process.env.PORT || 3000;
const SCORES_FILE = join(__dirname, 'scores.json');
const GAME_DIR = join(__dirname, '..'); // Parent directory contains the game files

// Middleware
app.use(cors());
app.use(express.json());

// Serve static game files from the parent directory
app.use(express.static(GAME_DIR));

// Initialize scores file if it doesn't exist
function initScoresFile() {
  if (!existsSync(SCORES_FILE)) {
    writeFileSync(SCORES_FILE, JSON.stringify({ scores: [] }, null, 2));
    console.log('✓ Fichier de scores initialisé');
  }
}

// Read scores from file
function readScores() {
  try {
    const data = readFileSync(SCORES_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erreur lecture scores:', error);
    return { scores: [] };
  }
}

// Write scores to file
function writeScores(data) {
  try {
    writeFileSync(SCORES_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Erreur écriture scores:', error);
    return false;
  }
}

// Get top scores
function getTopScores(limit = 10) {
  const data = readScores();
  return data.scores
    .sort((a, b) => {
      // Sort by level (descending), then by kills (descending), then by gold (descending)
      if (b.level !== a.level) return b.level - a.level;
      if (b.kills !== a.kills) return b.kills - a.kills;
      return b.gold - a.gold;
    })
    .slice(0, limit);
}

// Get network IP addresses
function getNetworkAddresses() {
  const interfaces = networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          name: name,
          address: iface.address
        });
      }
    }
  }
  
  return addresses;
}

// ========== API Routes ==========

// Get leaderboard
app.get('/api/leaderboard', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topScores = getTopScores(limit);
  res.json({ 
    success: true, 
    scores: topScores,
    count: topScores.length
  });
});

// Submit score
app.post('/api/score', (req, res) => {
  const { playerId, playerName, level, kills, gold, xp, className, race, gender, strength, defense } = req.body;
  
  // Validation
  if (!playerId || !playerName) {
    return res.status(400).json({ 
      success: false, 
      error: 'playerId et playerName sont requis' 
    });
  }
  
  if (typeof level !== 'number' || typeof kills !== 'number' || typeof gold !== 'number') {
    return res.status(400).json({ 
      success: false, 
      error: 'level, kills et gold doivent être des nombres' 
    });
  }
  
  // Calculate score for ranking
  const calculatedScore = (level * 100) + (kills * 50) + ((strength || 10) * 10) + ((defense || 5) * 5);
  
  // Create score entry
  const scoreEntry = {
    playerId,
    playerName,
    level,
    kills,
    gold,
    xp: xp || 0,
    className: className || 'Guerrier',
    race: race || 'Humain',
    gender: gender || 'male',
    strength: strength || 10,
    defense: defense || 5,
    score: calculatedScore,
    timestamp: new Date().toISOString(),
    date: new Date().toLocaleDateString('fr-CA')
  };
  
  // Read current scores
  const data = readScores();
  
  // Add new score
  data.scores.push(scoreEntry);
  
  // Keep only last 1000 scores to prevent file from growing too large
  if (data.scores.length > 1000) {
    data.scores = data.scores.slice(-1000);
  }
  
  // Save scores
  if (writeScores(data)) {
    // Broadcast updated leaderboard to all connected clients
    const topScores = getTopScores(10);
    io.emit('leaderboard-update', { scores: topScores });
    
    res.json({ 
      success: true, 
      message: 'Score enregistré avec succès',
      score: scoreEntry
    });
  } else {
    res.status(500).json({ 
      success: false, 
      error: 'Erreur lors de la sauvegarde du score' 
    });
  }
});

// Get player's personal best scores
app.get('/api/player/:playerId', (req, res) => {
  const { playerId } = req.params;
  const data = readScores();
  
  const playerScores = data.scores
    .filter(score => score.playerId === playerId)
    .sort((a, b) => {
      if (b.level !== a.level) return b.level - a.level;
      if (b.kills !== a.kills) return b.kills - a.kills;
      return b.gold - a.gold;
    })
    .slice(0, 10);
  
  res.json({ 
    success: true, 
    scores: playerScores,
    count: playerScores.length
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// ========== WebSocket Events ==========

io.on('connection', (socket) => {
  console.log(`✓ Joueur connecté: ${socket.id}`);
  
  // Send current leaderboard to newly connected client
  const topScores = getTopScores(10);
  socket.emit('leaderboard-update', { scores: topScores });
  
  // Handle client requesting leaderboard update
  socket.on('request-leaderboard', () => {
    const topScores = getTopScores(10);
    socket.emit('leaderboard-update', { scores: topScores });
  });
  
  socket.on('disconnect', () => {
    console.log(`✗ Joueur déconnecté: ${socket.id}`);
  });
});

// ========== Server Startup ==========

initScoresFile();

httpServer.listen(PORT, '0.0.0.0', () => {
  const networkAddrs = getNetworkAddresses();
  
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║  ⚔️  Le Coeur du Dragon - Serveur Multijoueur LAN  ⚔️  ║');
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`✓ Serveur HTTP démarré sur le port ${PORT}`);
  console.log(`✓ WebSocket (Socket.IO) actif`);
  console.log('');
  console.log('Accès depuis le réseau local:');
  console.log(`  - http://localhost:${PORT}`);
  
  if (networkAddrs.length > 0) {
    networkAddrs.forEach(addr => {
      console.log(`  - http://${addr.address}:${PORT} (${addr.name})`);
    });
  } else {
    console.log(`  - http://[ADRESSE-IP-LAN]:${PORT}`);
    console.log('');
    console.log('⚠️  Aucune interface réseau détectée.');
    console.log('   Pour trouver votre IP, utilisez:');
    console.log('   - Windows: ipconfig');
    console.log('   - Linux/Mac: ip addr ou ifconfig');
  }
  
  console.log('');
  console.log('Endpoints API disponibles:');
  console.log(`  GET  /api/health          - Vérification du serveur`);
  console.log(`  GET  /api/leaderboard     - Classement des meilleurs joueurs`);
  console.log(`  GET  /api/player/:id      - Scores personnels d'un joueur`);
  console.log(`  POST /api/score           - Soumettre un nouveau score`);
  console.log('');
  console.log('Pour arrêter le serveur: Ctrl+C');
  console.log('');
});
