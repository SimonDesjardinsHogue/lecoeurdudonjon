# 🔧 Guide de Dépannage Multijoueur - Connexion Réseau Local

## 📌 Question Principale : Est-ce que chaque ordinateur doit lancer npm?

### ✅ Réponse Simple : NON !

**Un seul ordinateur doit lancer le serveur npm.** Les autres appareils (iPad, téléphones, autres ordinateurs) se connectent simplement à cet ordinateur serveur via leur navigateur web.

### 📊 Architecture du Réseau

```
┌─────────────────────────────────────────────────────────────┐
│                    Réseau Local (LAN)                       │
│                  192.168.68.0/22                            │
│                                                             │
│  ┌──────────────────┐         ┌──────────────────┐        │
│  │  PC SERVEUR      │         │  iPad/iPhone     │        │
│  │  192.168.68.61   │◄────────│  192.168.68.X    │        │
│  │                  │         │                  │        │
│  │  npm start       │         │  Safari/Chrome   │        │
│  │  Port 3000       │         │  192.168.68.61:  │        │
│  │  ✓ Serveur actif │         │  3000            │        │
│  └──────────────────┘         └──────────────────┘        │
│         ▲                              ▲                    │
│         │                              │                    │
│         │      ┌──────────────────┐   │                    │
│         │      │  Autre PC/Laptop │   │                    │
│         └──────│  192.168.68.Y    │───┘                    │
│                │                  │                        │
│                │  Navigateur Web  │                        │
│                │  192.168.68.61:  │                        │
│                │  3000            │                        │
│                └──────────────────┘                        │
│                                                             │
│  Routeur: 192.168.68.1                                     │
└─────────────────────────────────────────────────────────────┘
```

### 🎯 Concept Clé : Serveur vs Client

#### PC Serveur (UN SEUL)
- **Rôle** : Héberge le jeu et la base de données des scores
- **Logiciels nécessaires** : Node.js et npm
- **Commandes** : `cd server && npm install && npm start`
- **Doit rester allumé** : Oui, tant que les autres veulent jouer
- **Adresse IP** : Fixe ou connue (ex: 192.168.68.61)

#### Appareils Clients (TOUS LES AUTRES)
- **Rôle** : Jouent au jeu via le navigateur
- **Logiciels nécessaires** : Seulement un navigateur web (Safari, Chrome, Firefox, etc.)
- **Commandes** : Aucune ! Juste ouvrir le navigateur
- **Installation** : Aucune installation nécessaire
- **Accès** : Ouvrent `http://192.168.68.61:3000` dans le navigateur

---

## 🚨 Problème : "Je ne peux pas me connecter depuis mon iPad"

### Étape 1 : Vérifier que le serveur est démarré

Sur le PC serveur (192.168.68.61), vérifiez que le serveur tourne :

**Windows :**
```cmd
cd server
npm start
```

**Ubuntu/Linux :**
```bash
cd server
npm start
```

Vous devriez voir :
```
╔═══════════════════════════════════════════════════════╗
║  ⚔️  Le Coeur du Dragon - Serveur Multijoueur LAN  ⚔️  ║
╚═══════════════════════════════════════════════════════╝

✓ Serveur HTTP démarré sur le port 3000
✓ WebSocket (Socket.IO) actif
✓ Adresses réseau disponibles:
  - http://192.168.68.61:3000
  - http://localhost:3000
```

Si le serveur ne démarre pas, consultez la section [Problèmes de démarrage du serveur](#problèmes-de-démarrage-du-serveur).

### Étape 2 : Tester la connexion DEPUIS le PC serveur

Sur le PC serveur lui-même, ouvrez un navigateur et allez à :
```
http://localhost:3000
```

**✅ Si ça fonctionne** : Le serveur est OK, le problème vient du réseau/firewall
**❌ Si ça ne fonctionne pas** : Le serveur a un problème, consultez [Problèmes de démarrage du serveur](#problèmes-de-démarrage-du-serveur)

### Étape 3 : Vérifier que l'iPad est sur le même réseau

#### Sur l'iPad :
1. Ouvrez **Réglages** → **Wi-Fi**
2. Vérifiez que vous êtes connecté au **même réseau Wi-Fi** que le PC serveur
3. Touchez le **ⓘ** à côté du nom du réseau
4. Notez l'**adresse IP** de l'iPad (ex: 192.168.68.152)

#### Les adresses IP doivent commencer par les mêmes chiffres :
- ✅ PC serveur : `192.168.68.61` et iPad : `192.168.68.152` → **MÊME réseau**
- ❌ PC serveur : `192.168.68.61` et iPad : `10.0.0.5` → **Réseaux différents**

**Solution si réseaux différents :**
- Connectez l'iPad au même réseau Wi-Fi que le PC serveur
- OU connectez le PC au même réseau que l'iPad

### Étape 4 : Tester la connexion réseau de base

Sur l'iPad, testez si le PC serveur est accessible :

#### Option 1 : Ping (via une app iOS)
Installez une app comme "Network Ping Lite" et pingez `192.168.68.61`

#### Option 2 : Navigateur
Dans Safari sur l'iPad, essayez d'ouvrir :
```
http://192.168.68.61:3000/api/health
```

**✅ Vous voyez** `{"success":true,"status":"ok",...}` → Le réseau fonctionne, passez à l'étape 5
**❌ Erreur de connexion** → Problème de firewall ou de réseau, passez à l'étape 5

### Étape 5 : Configurer le Firewall (TRÈS IMPORTANT)

C'est **LA cause la plus fréquente** des problèmes de connexion !

#### A. Firewall Windows (sur le PC serveur)

##### Méthode 1 : Interface graphique (Recommandée)

1. **Ouvrir le Pare-feu Windows** :
   - Appuyez sur `Windows + R`
   - Tapez `wf.msc` et appuyez sur Entrée
   - OU : Recherchez "Pare-feu Windows Defender avec fonctions avancées de sécurité"

2. **Créer une règle d'entrée pour le port 3000** :
   - Cliquez sur "**Règles de trafic entrant**" dans le panneau gauche
   - Cliquez sur "**Nouvelle règle...**" dans le panneau droit
   
3. **Assistant de création de règle** :
   - Type de règle : Sélectionnez "**Port**" → Suivant
   - Protocole et ports : 
     - Sélectionnez "**TCP**"
     - "Ports locaux spécifiques" : tapez `3000`
     - → Suivant
   - Action : Sélectionnez "**Autoriser la connexion**" → Suivant
   - Profil : Cochez **Domaine**, **Privé** ET **Public** → Suivant
   - Nom : Tapez `Le Coeur du Dragon - Port 3000` → Terminer

4. **Créer une règle pour Node.js (Alternative)** :
   - Nouvelle règle → Type : "**Programme**"
   - Chemin du programme : `C:\Program Files\nodejs\node.exe`
   - Action : Autoriser
   - Profil : Tous
   - Nom : `Node.js Server`

##### Méthode 2 : Ligne de commande (PowerShell en Administrateur)

```powershell
# Autoriser le port 3000 en entrée
netsh advfirewall firewall add rule name="Le Coeur du Dragon - Port 3000" dir=in action=allow protocol=TCP localport=3000

# Vérifier que la règle est créée
netsh advfirewall firewall show rule name="Le Coeur du Dragon - Port 3000"
```

##### Vérification Windows

Après avoir créé la règle :
```powershell
# Vérifier que le port 3000 est en écoute
netstat -an | findstr :3000
```

Vous devriez voir :
```
TCP    0.0.0.0:3000           0.0.0.0:0              LISTENING
```

#### B. Firewall Ubuntu/Linux (sur le PC serveur)

##### Avec UFW (Ubuntu Firewall)

```bash
# Vérifier le statut du firewall
sudo ufw status

# Si le firewall est actif, autoriser le port 3000
sudo ufw allow 3000/tcp

# Vérifier que la règle est ajoutée
sudo ufw status numbered
```

##### Avec iptables

```bash
# Autoriser le port 3000
sudo iptables -A INPUT -p tcp --dport 3000 -j ACCEPT

# Sauvegarder les règles (Ubuntu/Debian)
sudo netfilter-persistent save

# OU (CentOS/RHEL)
sudo service iptables save
```

##### Vérification Linux

```bash
# Vérifier que le port 3000 est en écoute
sudo netstat -tlnp | grep :3000
# OU
sudo ss -tlnp | grep :3000
```

Vous devriez voir :
```
tcp    0    0 0.0.0.0:3000    0.0.0.0:*    LISTEN    12345/node
```

#### C. Firewall du Routeur

Normalement, les connexions LAN (même réseau local) ne sont PAS bloquées par le routeur. Mais dans certains cas :

##### Isolation du Client Wi-Fi (AP Isolation)

Certains routeurs ont une fonction "**Isolation des clients Wi-Fi**" (ou "AP Isolation") qui empêche les appareils Wi-Fi de communiquer entre eux.

**Pour vérifier/désactiver** :
1. Connectez-vous à l'interface de votre routeur (généralement `http://192.168.68.1`)
2. Cherchez dans les paramètres Wi-Fi :
   - "Isolation des clients Wi-Fi" (Client Isolation)
   - "AP Isolation" 
   - "Prevent communication between devices"
3. **Désactivez** cette option si elle est activée
4. Redémarrez le routeur si nécessaire

##### Pare-feu du Routeur (OPNsense dans votre cas)

Selon votre configuration, le port 3000 est déjà **débloqué dans OPNsense**. Mais pour vérifier :

1. Connectez-vous à OPNsense (`https://192.168.68.1`)
2. Allez dans **Firewall** → **Rules** → **LAN**
3. Vérifiez qu'il existe une règle autorisant le trafic vers le port 3000
4. Si absente, créez une nouvelle règle :
   - Action : Pass
   - Interface : LAN
   - Protocol : TCP
   - Source : LAN net
   - Destination : Single host (`192.168.68.61`)
   - Destination port : 3000
   - Description : "Le Coeur du Dragon Multiplayer"

### Étape 6 : Tester depuis l'iPad

Sur l'iPad, ouvrez Safari (ou Chrome) et allez à :
```
http://192.168.68.61:3000
```

**✅ Succès** : Vous voyez la page d'accueil du jeu → **Vous pouvez jouer !**

**❌ Toujours un problème** : Consultez [Diagnostics avancés](#diagnostics-avancés)

---

## 🔍 Diagnostics Avancés

### Test de ping depuis un autre PC

Sur un autre PC Windows du réseau local :
```cmd
ping 192.168.68.61
```

**✅ Réponses reçues** : Le PC serveur est accessible sur le réseau
**❌ Expiration de la demande** : Problème réseau ou firewall bloque ICMP

### Test de connexion au port spécifique

**Windows** (PowerShell) :
```powershell
Test-NetConnection -ComputerName 192.168.68.61 -Port 3000
```

Résultat attendu :
```
TcpTestSucceeded : True
```

**Linux/Mac** :
```bash
telnet 192.168.68.61 3000
```

OU avec `nc` (netcat) :
```bash
nc -zv 192.168.68.61 3000
```

Résultat attendu :
```
Connection to 192.168.68.61 3000 port [tcp/*] succeeded!
```

### Vérifier les logs du serveur

Sur le PC serveur, regardez la console où tourne `npm start`. Vous devriez voir des connexions entrantes :

```
Nouvelle connexion WebSocket
GET /api/health 200
GET /api/leaderboard 200
```

Si vous ne voyez rien quand vous essayez de vous connecter depuis l'iPad, c'est que la requête n'arrive pas au serveur (firewall bloque).

### Utiliser l'IP réelle au lieu de l'IP du config.txt

Vérifiez l'adresse IP réelle actuelle du PC serveur (elle peut avoir changé) :

**Windows** :
```cmd
ipconfig
```

Cherchez "Adresse IPv4" dans la section de votre connexion active.

**Linux** :
```bash
ip addr show
```

Si l'IP a changé (ex: maintenant `192.168.68.75` au lieu de `192.168.68.61`), utilisez la nouvelle IP :
```
http://192.168.68.75:3000
```

---

## 🍎 Spécificités iOS/iPad

### Navigateurs supportés

- ✅ **Safari** : Recommandé, fonctionne très bien
- ✅ **Chrome** : Fonctionne bien
- ✅ **Firefox** : Fonctionne
- ⚠️ **Navigateurs alternatifs** : Peuvent avoir des restrictions

### Certificat SSL / HTTPS

Pour l'accès en HTTP local (`http://192.168.68.61:3000`), il n'y a **normalement pas de problème** sur iOS.

Cependant, si vous avez des problèmes :

1. **Assurez-vous d'utiliser `http://` et NON `https://`**
   - ✅ Correct : `http://192.168.68.61:3000`
   - ❌ Incorrect : `https://192.168.68.61:3000`

2. **iOS peut afficher un avertissement pour les connexions HTTP**
   - Cliquez sur "Accepter" ou "Continuer" si demandé

### Mode "Économie de données" ou VPN

- Désactivez le **Mode Économie de Données** si activé
- Désactivez tout **VPN** actif
- Désactivez le **Relais privé iCloud** (iOS 15+) :
  - Réglages → [Votre nom] → iCloud → Relais privé → Désactiver

### 🔧 Correctifs Safari/iPad (Nouvelle Version)

**Important** : Une nouvelle version du jeu a été déployée avec des corrections spécifiques pour Safari/iPad :

✅ **WebSocket amélioré** : Safari utilise maintenant "polling" en premier, puis passe à WebSocket
✅ **Timeouts augmentés** : 10 secondes pour les requêtes réseau (au lieu de 5s)
✅ **Reconnexion automatique** : Jusqu'à 5 tentatives de reconnexion
✅ **Mode CORS optimisé** : Meilleure compatibilité cross-origin

**Si vous rencontrez toujours des problèmes** :

1. **Videz le cache Safari** :
   - Réglages → Safari → Effacer historique et données de sites
   - Confirmez "Effacer"
   - Fermez et rouvrez Safari
   - Retournez sur `http://192.168.68.61:3000`

2. **Redémarrez le serveur** (pour activer les nouveaux paramètres) :
   - Sur le PC serveur, arrêtez le serveur (Ctrl+C)
   - Relancez : `npm start`

3. **Vérifiez la console Safari** (mode développeur) :
   - Activez le mode développeur : Réglages → Safari → Avancé → Inspecteur web
   - Ouvrez le jeu dans Safari
   - Allez sur Mac : Safari → Développement → [Votre iPad] → [Onglet du jeu]
   - Regardez les erreurs dans la console

### Ajouter à l'écran d'accueil

Pour une meilleure expérience, ajoutez le jeu à l'écran d'accueil :

1. Ouvrez `http://192.168.68.61:3000` dans Safari
2. Touchez l'icône **Partager** (carré avec flèche)
3. Sélectionnez "**Sur l'écran d'accueil**"
4. Touchez "**Ajouter**"

Le jeu aura maintenant une icône sur votre écran d'accueil et s'ouvrira en plein écran !

---

## ❌ Problèmes de démarrage du serveur

### Erreur : "node: command not found"

**Cause** : Node.js n'est pas installé ou pas dans le PATH

**Solution** :
1. Télécharger et installer Node.js depuis https://nodejs.org/
2. Choisir la version LTS (Long Term Support)
3. Redémarrer l'ordinateur après l'installation
4. Ouvrir une **nouvelle** invite de commandes
5. Vérifier : `node --version`

### Erreur : "npm: command not found"

**Cause** : npm n'est pas installé (normalement installé avec Node.js)

**Solution** :
- Réinstaller Node.js (la version complète inclut npm)
- Vérifier : `npm --version`

### Erreur : "EADDRINUSE" (port déjà utilisé)

**Cause** : Un autre programme utilise le port 3000

**Solution 1** : Arrêter l'autre programme qui utilise le port 3000

**Windows** :
```powershell
# Trouver quel programme utilise le port 3000
netstat -ano | findstr :3000

# Exemple de sortie :
# TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345

# Tuer le processus (remplacer 12345 par le PID trouvé)
taskkill /PID 12345 /F
```

**Linux** :
```bash
# Trouver le processus
sudo lsof -i :3000

# Tuer le processus (remplacer 12345 par le PID)
kill -9 12345
```

**Solution 2** : Utiliser un autre port

**Windows** :
```cmd
set PORT=8080
npm start
```

**Linux** :
```bash
PORT=8080 npm start
```

Puis accéder au jeu via : `http://192.168.68.61:8080`

### Erreur : "Cannot find module 'express'"

**Cause** : Les dépendances npm ne sont pas installées

**Solution** :
```bash
cd server
npm install
```

---

## ✅ Checklist Complète de Dépannage

Utilisez cette checklist pour diagnostiquer votre problème :

### Sur le PC Serveur

- [ ] Node.js est installé : `node --version` affiche une version
- [ ] npm est installé : `npm --version` affiche une version
- [ ] Les dépendances sont installées : le dossier `server/node_modules` existe
- [ ] Le serveur démarre sans erreur : `npm start` affiche le message de démarrage
- [ ] Le serveur est accessible localement : `http://localhost:3000` fonctionne dans le navigateur
- [ ] Le firewall Windows/Linux autorise le port 3000 (voir [Étape 5](#étape-5--configurer-le-firewall-très-important))
- [ ] L'adresse IP du PC est correcte : vérifier avec `ipconfig` ou `ip addr`

### Sur l'iPad (ou autre client)

- [ ] Connecté au même réseau Wi-Fi que le PC serveur
- [ ] L'adresse IP commence par les mêmes chiffres (ex: `192.168.68.X`)
- [ ] L'URL utilisée est `http://` et NON `https://`
- [ ] L'adresse est correcte : `http://192.168.68.61:3000`
- [ ] Mode Économie de Données désactivé
- [ ] VPN désactivé
- [ ] Relais privé iCloud désactivé (iOS 15+)
- [ ] Safari ou Chrome utilisé (navigateur compatible)

### Sur le Routeur

- [ ] L'isolation des clients Wi-Fi (AP Isolation) est désactivée
- [ ] Le pare-feu du routeur autorise le trafic local sur le port 3000 (si applicable)

---

## 🎯 Solution Rapide Résumée

1. **Sur le PC serveur** : 
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Autoriser le firewall Windows** :
   - Win+R → `wf.msc`
   - Règles de trafic entrant → Nouvelle règle
   - Type : Port → TCP → 3000
   - Autoriser → Tous les profils
   - Nom : "Le Coeur du Dragon"

3. **Sur l'iPad** :
   - Même réseau Wi-Fi
   - Safari → `http://192.168.68.61:3000`
   - Profitez ! 🎮

---

## 📞 Besoin d'Aide Supplémentaire ?

Si vous rencontrez toujours des problèmes après avoir suivi ce guide :

1. **Vérifiez les logs** : Regardez la console du serveur pour les messages d'erreur
2. **Testez depuis un autre PC** : Si ça fonctionne d'un PC mais pas de l'iPad, c'est un problème iOS spécifique
3. **Redémarrez tout** : 
   - Arrêtez le serveur
   - Redémarrez le routeur
   - Redémarrez le PC serveur
   - Redémarrez l'iPad
   - Relancez le serveur

4. **Créez une issue GitHub** avec :
   - Le système d'exploitation du serveur (Windows / Ubuntu / etc.)
   - Les messages d'erreur exacts
   - Les résultats des tests de ping et de connexion au port
   - Les logs du serveur

Bon jeu ! ⚔️
