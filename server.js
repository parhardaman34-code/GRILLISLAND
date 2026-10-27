const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = fs.existsSync(path.join(__dirname, 'dist')) 
  ? path.join(__dirname, 'dist') 
  : __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

function serveFile(req, res) {
  let reqUrl = req.url.split('?')[0];
  let filePath = path.join(PUBLIC_DIR, reqUrl === '/' ? 'index.html' : reqUrl);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Fallback to index.html for single page app feel or 404
        const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
        if (fs.existsSync(fallbackPath) && !path.extname(reqUrl)) {
          filePath = fallbackPath;
        } else {
          res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end('<h1>404 Not Found</h1><p>The requested URL was not found on this server.</p>');
          return;
        }
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Server Error: ${err.code}`);
        return;
      }
    } else if (stats.isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`500 Error loading file: ${readErr.message}`);
      } else {
        res.writeHead(200, {
          'Content-Type': contentType,
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'no-cache'
        });
        res.end(content);
      }
    });
  });
}

const server = http.createServer((req, res) => {
  // Simple health check endpoint
  if (req.url === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    return;
  }
  serveFile(req, res);
});

let currentPort = Number(PORT);

server.listen(currentPort, '0.0.0.0');

server.on('listening', () => {
  const actualPort = server.address().port;
  console.log(`===============================================`);
  console.log(`🔥 Grill Website Local Server is running!`);
  console.log(`👉 Local:   http://localhost:${actualPort}`);
  console.log(`👉 Network: http://127.0.0.1:${actualPort}`);
  console.log(`===============================================`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    currentPort += 1;
    console.log(`Port in use, trying ${currentPort}...`);
    server.listen(currentPort, '0.0.0.0');
  } else {
    console.error('Server error:', e);
  }
});
