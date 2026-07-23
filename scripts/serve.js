/**
 * Servidor estático mínimo para desarrollo local (sin dependencias).
 * Uso: npm run dev  ->  http://localhost:3000
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const PUERTO = process.env.PORT || 3000;
const RAIZ = process.cwd();

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
};

const servidor = createServer(async (req, res) => {
  const urlPath = decodeURIComponent(new URL(req.url, `http://localhost`).pathname);
  const relativo = urlPath === '/' ? '/index.html' : urlPath;
  const rutaArchivo = normalize(join(RAIZ, relativo));

  if (!rutaArchivo.startsWith(RAIZ)) {
    res.writeHead(403).end('Prohibido');
    return;
  }

  try {
    const contenido = await readFile(rutaArchivo);
    res.writeHead(200, { 'Content-Type': TIPOS[extname(rutaArchivo)] || 'application/octet-stream' });
    res.end(contenido);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('No encontrado');
  }
});

servidor.listen(PUERTO, () => {
  console.log(`Servidor en http://localhost:${PUERTO}`);
});
