/**
 * 易经占卜 - Service Worker
 * 版本: 1.1.0
 */

const CACHE_NAME = 'yijing-v1.1.0';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/css/main.css',
  '/src/js/config.js',
  '/src/js/storage.js',
  '/src/js/db.js',
  '/src/js/yijing.js',
  '/src/js/user.js',
  '/src/js/ui.js',
  '/src/js/app.js',
  '/data/yijing.json',
  '/manifest.json'
];

/**
 * 安装事件 - 缓存静态资源
 */
self.addEventListener('install', (event) => {
  console.log('[SW] 安装中...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] 缓存静态资源');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] 激活中...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        return Promise.all(
          keys.filter((key) => key !== CACHE_NAME)
            .map((key) => {
              console.log('[SW] 删除旧缓存:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

/**
 * 请求拦截 - 缓存优先策略
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => {
        // 缓存命中，返回缓存
        if (cached) {
          // 后台更新缓存
          fetchAndUpdate(request);
          return cached;
        }

        // 缓存未命中，网络请求
        return fetch(request)
          .then((response) => {
            // 缓存新资源
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(request, responseClone));
            }
            return response;
          })
          .catch(() => {
            // 网络失败，返回离线页面
            if (request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            return new Response('离线状态', { status: 503 });
          });
      })
  );
});

/**
 * 后台更新缓存
 */
function fetchAndUpdate(request) {
  fetch(request)
    .then((response) => {
      if (response.ok) {
        caches.open(CACHE_NAME)
          .then((cache) => cache.put(request, response));
      }
    })
    .catch(() => {});
}