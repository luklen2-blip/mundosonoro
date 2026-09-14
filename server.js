import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const APP_NAME = 'SoundWorld / Mundo Sonoro';
const APP_VERSION = '2.0.0';

// Cálculo oficial do CRC-16 / CCITT-FALSE para PIX
function calculateCRC16(payload) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= (payload.charCodeAt(i) << 8);
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export function generatePixPayload({ pixKey = 'luklen2@gmail.com', name = 'Luciano Sant Anna', city = 'Sao Paulo', amount = '19.90', txId = 'SWL001' } = {}) {
  const formatField = (id, value) => {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const merchantAccountInfo = [
    formatField('00', 'br.gov.bcb.pix'),
    formatField('01', pixKey)
  ].join('');

  const additionalDataField = formatField('05', txId);

  const cleanName = (name || 'SoundWorld Kids').normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25);
  const cleanCity = (city || 'Sao Paulo').normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);

  let payload = [
    formatField('00', '01'),
    formatField('26', merchantAccountInfo),
    formatField('52', '0000'),
    formatField('53', '986'),
    amount ? formatField('54', Number(amount).toFixed(2)) : '',
    formatField('58', 'BR'),
    formatField('59', cleanName),
    formatField('60', cleanCity),
    formatField('62', additionalDataField),
    '6304'
  ].join('');

  return payload + calculateCRC16(payload);
}

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
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
}

const server = http.createServer((req, res) => {
  applySecurityHeaders(res);

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // 1. Health check padrão Luciano
  if (pathname === '/api/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      app: APP_NAME,
      version: APP_VERSION,
      uptime_seconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // 2. Geração de PIX para apoio/patronesse de pais
  if (pathname === '/api/pix' && req.method === 'GET') {
    const amount = parsedUrl.searchParams.get('amount') || '19.90';
    const pixKey = parsedUrl.searchParams.get('key') || 'luklen2@gmail.com';
    const payload = generatePixPayload({ amount, pixKey, name: 'Luciano Sant Anna' });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      amount: Number(amount).toFixed(2),
      pixKey,
      copiaECola: payload,
      qrCodeUrl
    }));
    return;
  }

  // 3. Resolução Universal e Resiliente de Arquivos Estáticos (public + raiz)
  let targetFile = pathname;
  if (targetFile === '/' || targetFile === '') {
    targetFile = 'index.html';
  } else if (targetFile.startsWith('/')) {
    targetFile = targetFile.slice(1);
  }

  const candidatePaths = [
    path.join(__dirname, 'public', targetFile),
    path.join(__dirname, targetFile),
    path.join(process.cwd(), 'public', targetFile),
    path.join(process.cwd(), targetFile)
  ];

  let filePath = candidatePaths.find(p => {
    try {
      return fs.existsSync(p) && fs.statSync(p).isFile();
    } catch {
      return false;
    }
  });

  // Fallback SPA para index.html em rotas navegáveis como /termos ou /privacidade
  if (!filePath) {
    const indexCandidates = [
      path.join(__dirname, 'public', 'index.html'),
      path.join(__dirname, 'index.html'),
      path.join(process.cwd(), 'public', 'index.html'),
      path.join(process.cwd(), 'index.html')
    ];
    filePath = indexCandidates.find(p => {
      try {
        return fs.existsSync(p) && fs.statSync(p).isFile();
      } catch {
        return false;
      }
    });
  }

  if (filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Erro interno do servidor');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Recurso não encontrado');
  }
});

// Apenas escuta diretamente se for executado como script principal
if (process.env.NODE_ENV !== 'test' && !process.env.NO_LISTEN) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🎵 [SoundWorld] Servidor ativo e pronto na porta ${PORT}`);
    console.log(`🌐 Health check: http://localhost:${PORT}/api/health`);
  });
}

export default server;
