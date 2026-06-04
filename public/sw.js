const CACHE_NAME = 'convomag-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/home',
  '/hub',
  '/publish',
  '/reader',
  '/remix',
  '/advertiser',
  '/analytics',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'
];

// --- IndexedDB Configuration for Offline AI Chat History ---
const DB_NAME = 'ConvoMagDB';
const DB_VERSION = 1;

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('chat-cache')) {
        db.createObjectStore('chat-cache', { keyPath: 'key' });
      }
      if (!db.objectStoreNames.contains('library-meta')) {
        db.createObjectStore('library-meta', { keyPath: 'id' });
      }
    };
    request.onsuccess = (event) => {
      resolve(event.target.result);
    };
    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

function saveChatToIndexedDB(pubId, query, responseData) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chat-cache', 'readwrite');
      const store = transaction.objectStore('chat-cache');
      const key = `${pubId}_${query.toLowerCase().trim()}`;
      
      const record = {
        key: key,
        pubId: pubId,
        query: query.toLowerCase().trim(),
        answer: responseData.answer,
        pageSuggestions: responseData.pageSuggestions || responseData.pages || [],
        timestamp: new Date().toISOString()
      };
      
      const request = store.put(record);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });
  }).catch((err) => {
    console.error('[Service Worker] IndexedDB save error:', err);
  });
}

function getChatFromIndexedDB(pubId, query) {
  return openDB().then((db) => {
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('chat-cache', 'readonly');
      const store = transaction.objectStore('chat-cache');
      const key = `${pubId}_${query.toLowerCase().trim()}`;
      
      const request = store.get(key);
      request.onsuccess = (event) => {
        const record = event.target.result;
        if (record) {
          resolve({
            answer: record.answer,
            pageSuggestions: record.pageSuggestions || []
          });
        } else {
          // Fallback context: Fuzzy lookup in case they write a slightly different query
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = (e) => {
            const allRecords = e.target.result;
            const queryWords = query.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2);
            let bestRecord = null;
            let maxMatches = 0;
            
            for (const rec of allRecords) {
              if (rec.pubId !== pubId) continue;
              let matchCount = 0;
              for (const word of queryWords) {
                if (rec.query.includes(word)) {
                  matchCount++;
                }
              }
              if (matchCount > maxMatches) {
                maxMatches = matchCount;
                bestRecord = rec;
              }
            }
            
            if (bestRecord && maxMatches > 0) {
              resolve({
                answer: bestRecord.answer + "\n\n*(Note: Recovered matching result from offline AI Chat indexing library.)*",
                pageSuggestions: bestRecord.pageSuggestions || []
              });
            } else {
              resolve(null);
            }
          };
          getAllRequest.onerror = () => resolve(null);
        }
      };
      request.onerror = (e) => reject(e.target.error);
    });
  }).catch((err) => {
    console.error('[Service Worker] IndexedDB retrieve error:', err);
    return null;
  });
}

// Install Event - Pre-cache core UI pages and shells
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Pre-caching Core Shell Assets...');
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => console.warn(`Failed to pre-cache asset: ${url}`, err))
        )
      );
    })
  );
});

// Activate Event - Standard stale cache cleanups
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Purging stale cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

async function handleChatPostRequest(request, reqUrl) {
  const match = reqUrl.pathname.match(/\/api\/magazines\/([^/]+)\/chat/);
  const pubId = match ? match[1] : 'default';

  try {
    const reqClone = request.clone();
    const networkResponse = await fetch(request);

    if (networkResponse && networkResponse.status === 200) {
      const resClone = networkResponse.clone();
      try {
        const reqData = await reqClone.json();
        const resData = await resClone.json();
        if (reqData && reqData.query && resData && resData.answer) {
          await saveChatToIndexedDB(pubId, reqData.query, resData);
          console.log(`[Service Worker] Cached AI chat reply in IndexedDB for "${pubId}": "${reqData.query}"`);
        }
      } catch (err) {
        console.warn('[Service Worker] Failed to persist chat entry in IndexedDB:', err);
      }
    }
    return networkResponse;
  } catch (err) {
    console.log('[Service Worker] Device is offline or chat endpoint failed. Checking local IndexedDB cache...');
    try {
      const reqClone = request.clone();
      const reqData = await reqClone.json();
      
      const cachedResponse = await getChatFromIndexedDB(pubId, reqData.query);
      if (cachedResponse) {
        console.log('[Service Worker] Serving cached AI chat reply from IndexedDB:', cachedResponse);
        return new Response(JSON.stringify(cachedResponse), {
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } catch (dbErr) {
      console.warn('[Service Worker] DB lookup failure:', dbErr);
    }

    return new Response(JSON.stringify({
      answer: `I am currently in offline mode, but scanning our cached publication copy. I found no matching queries in your past dialogue indexes.\n\n*(Note: Reconnecting to the internet restores live Gemini AI companion chats)*`,
      pageSuggestions: []
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Robust Fetch Interceptor
self.addEventListener('fetch', (event) => {
  const reqUrl = new URL(event.request.url);

  // 1. Intercept AI Dialog POST calls to utilize the IndexedDB smart matching engine
  if (event.request.method === 'POST' && reqUrl.pathname.includes('/chat')) {
    event.respondWith(handleChatPostRequest(event.request, reqUrl));
    return;
  }

  // Skip all other non-GET requests instantly
  if (event.request.method !== 'GET') {
    return;
  }

  // 2. Handling Magazine PDFs & Heavy unpkg plugins (e.g., pdf.worker.min.mjs) -> Cache-First
  if (
    reqUrl.pathname.includes('/api/proxy-pdf') || 
    reqUrl.pathname.startsWith('/uploads/') || 
    reqUrl.pathname.includes('pdf.worker') ||
    reqUrl.hostname.includes('unpkg.com')
  ) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[Service Worker] Serving cached resource:', reqUrl.pathname);
            return cachedResponse;
          }
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch((err) => {
            console.warn('[Service Worker] Fetch failed for remote PDF/script:', err);
            return cachedResponse;
          });
        });
      })
    );
    return;
  }

  // 3. Handling Magazine Configuration details -> Network-First (with offline Cache Fallback)
  if (reqUrl.pathname.startsWith('/api/magazines')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          })
          .catch(() => {
            console.log('[Service Worker] Device is offline. Fetching cached magazine configs...');
            return cache.match(event.request).then((cachedResponse) => {
              if (cachedResponse) return cachedResponse;
              return new Response(JSON.stringify({ 
                error: "Offline", 
                message: "You are currently offline. This magazine config was not cached." 
              }), {
                headers: { 'Content-Type': 'application/json' }
              });
            });
          });
      })
    );
    return;
  }

  // 4. Regular static styling and javascript code chunks -> Cache-First falling back to Network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse && 
          networkResponse.status === 200 && 
          (reqUrl.pathname.endsWith('.js') || reqUrl.pathname.endsWith('.css') || reqUrl.pathname.match(/\.(png|jpg|jpeg|gif|svg|woff2|woff|ttf)$/))
        ) {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch((fetchErr) => {
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html') || caches.match('/');
        }
        throw fetchErr;
      });
    })
  );
});

// --- Message Listener for active pre-fetching of Offline Library content ---
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_LIBRARY_OFFLINE') {
    const { publications } = event.data;
    if (Array.isArray(publications)) {
      console.log('[Service Worker] Synchronizing offline library bookshelf. Magazines:', publications.map(p => p.title));
      
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          return Promise.allSettled(
            publications.map(async (pub) => {
              if (pub.pdfUrl) {
                const pdfTarget = `/api/proxy-pdf?url=${encodeURIComponent(pub.pdfUrl)}`;
                const detailsTarget = `/api/magazines/${pub.id}`;
                const coverTarget = pub.coverUrl;

                // Cache metadata config details
                try {
                  const hasDetails = await cache.match(detailsTarget);
                  if (!hasDetails) {
                    console.log(`[Service Worker] Background Pre-fetching details for: ${pub.title}`);
                    await cache.add(detailsTarget);
                  }
                } catch (err) {
                  console.warn(`[Service Worker] Background Details cache query fail for ${pub.title}:`, err);
                }

                // Cache Cover icon
                if (coverTarget) {
                  try {
                    const hasCover = await cache.match(coverTarget);
                    if (!hasCover) {
                      console.log(`[Service Worker] Background Pre-fetching cover for: ${pub.title}`);
                      await cache.add(coverTarget);
                    }
                  } catch (err) {
                    console.warn(`[Service Worker] Background Cover cache query fail for ${pub.title}:`, err);
                  }
                }

                // Cache Core high-fidelity PDF Document pages
                try {
                  const hasPdf = await cache.match(pdfTarget);
                  if (!hasPdf) {
                    console.log(`[Service Worker] High-Fidelity Pre-fetching PDF document pages for offline mode: ${pub.title}`);
                    await cache.add(pdfTarget);
                    console.log(`[Service Worker] PDF successfully indexed in Cache API: ${pub.title}`);
                  } else {
                    console.log(`[Service Worker] PDF document pages already indexed offline for: ${pub.title}`);
                  }
                } catch (err) {
                  console.warn(`[Service Worker] High-Fidelity PDF pre-fetch crash for ${pub.title}:`, err);
                }
              }
            })
          );
        })
      );
    }
  }
});
