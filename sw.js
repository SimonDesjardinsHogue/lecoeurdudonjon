// Service Worker for Le Coeur du Dragon
// Enables offline play and caching of game assets

const CACHE_NAME = 'lecoeurdudragon-v1.1.2-enchanteur-fix';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/manifest.json',
  // Core JavaScript files
  '/js/main.js',
  '/js/game-state.js',
  '/js/game-logic.js',
  '/js/combat.js',
  '/js/ui.js',
  '/js/save-load.js',
  '/js/character-classes.js',
  '/js/character-races.js',
  '/js/character-sexes.js',
  '/js/audio.js',
  '/js/particles.js',
  '/js/keyboard-handler.js',
  '/js/daily-quests.js',
  '/js/daily-rewards.js',
  '/js/achievements.js',
  '/js/skills.js',
  '/js/network.js',
  '/js/multiplayer-ui.js',
  '/js/popup-queue.js',
  '/js/scheduled-events.js',
  '/js/mobile-help.js',
  '/js/touch-gestures.js',
  '/js/balance-tester.js',
  // Combat system
  '/js/combat/boss.js',
  '/js/combat/events.js',
  '/js/combat/initiative.js',
  // Core systems
  '/js/core/game-state.js',
  // Data files
  '/js/data/enemies.js',
  '/js/data/events.js',
  '/js/data/game-constants.js',
  '/js/data/metals.js',
  '/js/data/npcs.js',
  '/js/data/shop-items.js',
  // Game systems
  '/js/systems/inventory.js',
  '/js/systems/leaderboard.js',
  '/js/systems/npc.js',
  '/js/systems/player.js',
  '/js/systems/shop.js',
  // Balance analysis
  '/js/balance/analysis.js',
  '/js/balance/report-formatter.js',
  '/js/balance/simulation.js',
  // Icons - essential sizes for offline install
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/icon-192x192-maskable.png',
  '/assets/icons/icon-512x512-maskable.png',
  // Apple Touch Icons
  '/assets/icons/apple-touch-icon-120x120.png',
  '/assets/icons/apple-touch-icon-167x167.png',
  '/assets/icons/apple-touch-icon-180x180.png',
  '/assets/icons/apple-touch-icon-1024x1024.png',
  '/favicon.ico'
];

// Install event - cache all assets
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('[Service Worker] Install complete');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[Service Worker] Cache failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('[Service Worker] Activation complete');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(err => {
          console.log('[Service Worker] Fetch failed, serving offline page');
          // Could return a custom offline page here if needed
          return new Response('Offline - please check your connection', {
            status: 503,
            statusText: 'Service Unavailable',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        });
      })
  );
});

// Message event - allow updates from the page
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
