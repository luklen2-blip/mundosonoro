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

export function generatePixPayload({ pixKey = 'luklen2@gmail.com', name = 'Luciano Sant Anna', city = 'Rio de Janeiro', amount = '19.90', txId = 'SWL001' } = {}) {
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
  const cleanCity = (city || 'Rio de Janeiro').normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);

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
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8'
};

function applySecurityHeaders(res) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://api.qrserver.com; media-src 'self' blob: data:; connect-src 'self' https://api.qrserver.com; frame-ancestors 'none';");
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
}

// Rate Limiter nativo em memória por IP (zero dependências)
const ipRequestHistory = new Map();
function isRateLimited(key, maxRequests = 180, windowMs = 60000) {
  const now = Date.now();
  let record = ipRequestHistory.get(key);
  if (!record || now - record.startTime > windowMs) {
    record = { startTime: now, count: 1 };
    ipRequestHistory.set(key, record);
    return false;
  }
  record.count++;
  return record.count > maxRequests;
}

// Limpeza de histórico inativo para evitar vazamento de memória
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of ipRequestHistory.entries()) {
    if (now - record.startTime > 120000) {
      ipRequestHistory.delete(key);
    }
  }
}, 600000);

const server = http.createServer((req, res) => {
  applySecurityHeaders(res);

  const clientIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || '127.0.0.1';

  // Rate Limiting global por IP
  if (isRateLimited(`global_${clientIp}`, 300, 60000)) {
    res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'error', message: 'Muitas requisições. Aguarde um instante.' }));
    return;
  }

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

  // 2. Geração de PIX para apoio/patronesse de pais (Blindado e com Rate Limit)
  if (pathname === '/api/pix' && req.method === 'GET') {
    if (isRateLimited(`pix_${clientIp}`, 30, 60000)) {
      res.writeHead(429, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'error', message: 'Limite de consultas do PIX atingido. Aguarde 1 minuto.' }));
      return;
    }

    let amount = parsedUrl.searchParams.get('amount') || '19.90';
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < 1 || numAmount > 500) {
      amount = '19.90';
    } else {
      amount = numAmount.toFixed(2);
    }

    const orderId = parsedUrl.searchParams.get('orderId') || `SWK${Date.now().toString().slice(-6)}`;
    const pixKey = 'luklen2@gmail.com';
    const payload = generatePixPayload({ amount, pixKey, name: 'Luciano Sant Anna', txId: orderId.slice(0, 20) });
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(payload)}`;

    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'success',
      amount,
      orderId,
      pixKey,
      name: 'Luciano Sant Anna',
      copiaECola: payload,
      qrCodeUrl
    }));
    return;
  }

  // 3. Resolução Universal e Resiliente de Arquivos Estáticos com Sanitização
  let targetFile = pathname;
  if (targetFile === '/' || targetFile === '') {
    targetFile = 'index.html';
  } else if (targetFile === '/comprar' || targetFile === '/landing' || targetFile === '/sobre' || targetFile === '/planos') {
    targetFile = 'landing.html';
  } else if (targetFile.startsWith('/')) {
    targetFile = targetFile.slice(1);
  }

  // Sanitização estrita contra Path Traversal
  const safeTargetFile = path.normalize(targetFile).replace(/^(\.\.[\/\\])+/, '');
  const rootAllowedDirs = [
    path.resolve(__dirname),
    path.resolve(__dirname, 'public'),
    path.resolve(process.cwd()),
    path.resolve(process.cwd(), 'public')
  ];

  const candidatePaths = [
    path.join(__dirname, 'public', safeTargetFile),
    path.join(__dirname, safeTargetFile),
    path.join(process.cwd(), 'public', safeTargetFile),
    path.join(process.cwd(), safeTargetFile)
  ];

  let filePath = candidatePaths.find(p => {
    try {
      const resolved = path.resolve(p);
      const isInside = rootAllowedDirs.some(dir => resolved.startsWith(dir));
      return isInside && fs.existsSync(resolved) && fs.statSync(resolved).isFile();
    } catch {
      return false;
    }
  });

  // Fallback SPA apenas para rotas sem extensão (ex: /termos, /privacidade, /comprar)
  const hasFileExtension = path.extname(safeTargetFile) !== '';
  if (!filePath && !hasFileExtension) {
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
      const stat = fs.statSync(filePath);
      const isDynamicOrHtml = ext === '.html' || safeTargetFile === 'sw.js' || safeTargetFile.endsWith('sw.js') || safeTargetFile === 'manifest.json';
      
      // Suporte a HTTP Range para streaming de vídeo/áudio
      const range = req.headers.range;
      if (range && (ext === '.mp4' || ext === '.webm' || ext === '.mp3')) {
        const parts = range.replace(/bytes=/, '').split('-');
        const start = parseInt(parts[0], 10);
        const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
        const chunksize = (end - start) + 1;
        const fileStream = fs.createReadStream(filePath, { start, end });
        res.writeHead(206, {
          'Content-Range': `bytes ${start}-${end}/${stat.size}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunksize,
          'Content-Type': contentType
        });
        fileStream.pipe(res);
        return;
      }

      const data = fs.readFileSync(filePath);
      const headers = {
        'Content-Type': contentType,
        'Content-Length': stat.size,
        'Accept-Ranges': 'bytes',
        'Cache-Control': isDynamicOrHtml ? 'no-cache, no-store, must-revalidate' : 'public, max-age=0, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      };
      res.writeHead(200, headers);
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
