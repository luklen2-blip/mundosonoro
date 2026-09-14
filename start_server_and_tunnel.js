/**
 * SoundWorld / Mundo Sonoro - Gerenciador Unificado 24/7
 * Executa o servidor HTTP nativo e o túnel seguro Cloudflare com auto-restart e --no-prechecks.
 */

import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const cloudflaredPath = path.join(__dirname, 'cloudflared.exe');
const urlFile = path.join(__dirname, 'tunnel_url.txt');
const publicUrlFile = path.join(__dirname, 'public_tunnel_url.txt');
const logFile = path.join(__dirname, 'tunnel_live.log');

function checkHealth() {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PORT}/api/health`, { timeout: 1500 }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.status === 'ok') return resolve(true);
        } catch (e) {}
        resolve(false);
      });
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
  });
}

function generateQrCode(tunnelUrl) {
  try {
    const agent = new https.Agent({ rejectUnauthorized: false });
    const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=350x350&data=' + encodeURIComponent(tunnelUrl);
    https.get(qrUrl, { agent }, (res) => {
      const p1 = path.join(__dirname, 'public', 'qrcode_mobile.png');
      const f1 = fs.createWriteStream(p1);
      res.pipe(f1);
    }).on('error', () => {});
  } catch (e) {}
}

let serverChild = null;
let tunnelChild = null;

async function startServer() {
  const healthy = await checkHealth();
  if (healthy) {
    console.log(`[Servidor] Servidor já ativo e saudável na porta ${PORT}.`);
    return;
  }

  console.log(`[Servidor] Iniciando node server.js na porta ${PORT}...`);
  serverChild = spawn('node', ['server.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, PORT: String(PORT) }
  });

  serverChild.on('exit', (code) => {
    console.log(`[Servidor] Processo encerrou com código ${code}. Reiniciando em 2s...`);
    setTimeout(startServer, 2000);
  });
}

function startTunnel() {
  if (!fs.existsSync(cloudflaredPath)) {
    console.error('❌ cloudflared.exe não encontrado em:', cloudflaredPath);
    return;
  }

  console.log('🛡️  Iniciando Cloudflare Quick Tunnel com flag mandatória --no-prechecks...');
  const args = [
    'tunnel',
    '--url', `http://127.0.0.1:${PORT}`,
    '--no-prechecks',
    '--edge-ip-version', '4',
    '--protocol', 'quic',
    '--logfile', logFile
  ];

  tunnelChild = spawn(cloudflaredPath, args, { cwd: __dirname });
  let detectedUrl = false;

  const handleData = (chunk) => {
    const text = chunk.toString();
    process.stdout.write(text);
    const match = text.match(/https:\/\/[a-zA-Z0-9-]+\.trycloudflare\.com/);
    if (match && !detectedUrl) {
      detectedUrl = true;
      const url = match[0];
      fs.writeFileSync(urlFile, url, 'utf-8');
      fs.writeFileSync(publicUrlFile, url, 'utf-8');
      console.log(`\n======================================================`);
      console.log(`🌟 SOUNDWORLD / MUNDO SONORO DISPONÍVEL 24/7 NA NUVEM!`);
      console.log(`🌐 URL Pública HTTPS:   ${url}`);
      console.log(`🩺 Health Check Nuvem:  ${url}/api/health`);
      console.log(`📱 Acesso Mobile Global: Qualquer smartphone/tablet/PC`);
      console.log(`======================================================\n`);
      generateQrCode(url);
    }
  };

  tunnelChild.stdout.on('data', handleData);
  tunnelChild.stderr.on('data', handleData);

  tunnelChild.on('exit', (code) => {
    console.log(`[Túnel] Túnel encerrou (código ${code}). Reiniciando em 3s...`);
    detectedUrl = false;
    setTimeout(startTunnel, 3000);
  });
}

async function main() {
  await startServer();
  setTimeout(startTunnel, 1500);
}

process.on('SIGINT', () => {
  if (serverChild) serverChild.kill();
  if (tunnelChild) tunnelChild.kill();
  process.exit();
});

process.on('SIGTERM', () => {
  if (serverChild) serverChild.kill();
  if (tunnelChild) tunnelChild.kill();
  process.exit();
});

main();
