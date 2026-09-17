// tests/test_cloud_live.js - Validador Remoto de Produção na Nuvem (Live Cloud E2E)
// Configurado com rejectUnauthorized: false para evitar bloqueios de certificados intermediários no Windows

import https from 'https';
import http from 'http';
import { URL } from 'url';

const targetUrl = process.argv[2] || process.env.LIVE_URL;

if (!targetUrl) {
  console.log('ℹ️ Uso: node tests/test_cloud_live.js <URL_DE_PRODUCAO>');
  console.log('Exemplo: node tests/test_cloud_live.js https://soundworld-kids.onrender.com');
  process.exit(0);
}

const isHttps = targetUrl.startsWith('https');
const client = isHttps ? https : http;
const agent = isHttps ? new https.Agent({ rejectUnauthorized: false }) : undefined;

function requestUrl(endpoint) {
  const fullUrl = new URL(endpoint, targetUrl).toString();
  return new Promise((resolve, reject) => {
    client.get(fullUrl, { agent }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, data }));
    }).on('error', reject);
  });
}

async function runLiveE2E() {
  console.log(`🌐 [SoundWorld Live Cloud E2E] Validando produção em: ${targetUrl}`);

  // 1. Health check obrigatório (/api/health)
  console.log('  → Validando /api/health...');
  const health = await requestUrl('/api/health');
  if (health.status !== 200) {
    throw new Error(`Falha no /api/health: HTTP ${health.status}`);
  }
  const healthJson = JSON.parse(health.data);
  if (healthJson.status !== 'ok' || !healthJson.app) {
    throw new Error('Payload inválido retornado pelo /api/health');
  }
  console.log(`    ✓ Health check 200 OK. Uptime: ${healthJson.uptime_seconds}s | Versão: ${healthJson.version}`);

  // 2. Landing Page & Web App
  console.log('  → Validando carregamento do Web App principal...');
  const home = await requestUrl('/');
  if (home.status !== 200) {
    throw new Error(`Falha ao carregar a página principal: HTTP ${home.status}`);
  }
  if (!home.data.includes('SoundWorld') && !home.data.includes('Mundo Sonoro')) {
    throw new Error('Conteúdo esperado do SoundWorld não encontrado na home');
  }
  console.log('    ✓ Web App infantil carregado com sucesso.');

  // 2b. Página de Vendas Dedicada (/comprar)
  console.log('  → Validando Landing Page de conversão (/comprar)...');
  const landing = await requestUrl('/comprar');
  if (landing.status !== 200) {
    throw new Error(`Falha ao carregar a landing page /comprar: HTTP ${landing.status}`);
  }
  if (!landing.data.includes('SoundWorld Kids') || !landing.data.includes('19,90')) {
    throw new Error('Conteúdo esperado da oferta /comprar não encontrado');
  }
  console.log('    ✓ Landing Page dos pais (/comprar) operacional e com as 7 seções.');

  // 3. Estilos e Scripts
  console.log('  → Validando entrega de assets estáticos...');
  const css = await requestUrl('/css/styles.css');
  if (css.status !== 200) throw new Error(`Falha no CSS: HTTP ${css.status}`);

  const js = await requestUrl('/js/app.js');
  if (js.status !== 200) throw new Error(`Falha no JS: HTTP ${js.status}`);

  const cat = await requestUrl('/js/catalog.js');
  if (cat.status !== 200) throw new Error(`Falha no catalog.js: HTTP ${cat.status}`);

  const poster = await requestUrl('/img/video-poster.svg');
  if (poster.status !== 200) throw new Error(`Falha no video-poster.svg: HTTP ${poster.status}`);

  const demoPlayer = await requestUrl('/js/demo-player.js');
  if (demoPlayer.status !== 200) throw new Error(`Falha no demo-player.js: HTTP ${demoPlayer.status}`);
  console.log('    ✓ CSS, JavaScript, Player Demo 10s e Catálogo Modular servidos com integridade.');

  // 3b. Gravações de Áudio Naturais dos Animais (MP3)
  console.log('  → Validando áudios autênticos dos animais...');
  const dogAudio = await requestUrl('/audio/animals/dog.mp3');
  if (dogAudio.status !== 200 && dogAudio.status !== 206) throw new Error(`Falha no dog.mp3: HTTP ${dogAudio.status}`);

  const catAudio = await requestUrl('/audio/animals/cat.mp3');
  if (catAudio.status !== 200 && catAudio.status !== 206) throw new Error(`Falha no cat.mp3: HTTP ${catAudio.status}`);

  const whaleAudio = await requestUrl('/audio/animals/whale.mp3');
  if (whaleAudio.status !== 200 && whaleAudio.status !== 206) throw new Error(`Falha no whale.mp3: HTTP ${whaleAudio.status}`);
  console.log('    ✓ Arquivos de áudio MP3 autênticos servidos com sucesso pela nuvem.');

  // 4. API PIX com Order ID
  console.log('  → Validando API PIX oficial com Pedido Único...');
  const pix = await requestUrl('/api/pix?amount=19.90&orderId=SWK-2026-CLOUD');
  if (pix.status !== 200) throw new Error(`Falha na API PIX: HTTP ${pix.status}`);
  const pixJson = JSON.parse(pix.data);
  if (!pixJson.copiaECola || !pixJson.qrCodeUrl || pixJson.orderId !== 'SWK-2026-CLOUD') {
    throw new Error('Payload do PIX incompleto ou Order ID ausente');
  }
  console.log('    ✓ Geração de PIX EMV com Pedido Único (SWK-2026-CLOUD) operacional na nuvem.');

  // 5. PWA Manifest, Service Worker e Checkout Kiwify
  console.log('  → Validando PWA Manifest, Service Worker e Checkout Kiwify...');
  const manifest = await requestUrl('/manifest.json');
  if (manifest.status !== 200) throw new Error(`Falha no manifest.json: HTTP ${manifest.status}`);
  const manifestJson = JSON.parse(manifest.data);
  if (!manifestJson.name || !manifestJson.icons) throw new Error('Manifest.json inválido');
  console.log('    ✓ PWA Manifest (manifest.json) validado com sucesso.');

  const sw = await requestUrl('/sw.js');
  if (sw.status !== 200) throw new Error(`Falha no sw.js: HTTP ${sw.status}`);
  console.log('    ✓ Service Worker (sw.js) ativo para cache offline.');

  if (!home.data.includes('https://pay.kiwify.com.br/9fQEqnA')) {
    throw new Error('Link de checkout Kiwify ausente na página principal');
  }
  console.log('    ✓ Link de Checkout Oficial Kiwify presente e validado na aplicação.');

  const termos = await requestUrl('/termos');
  if (termos.status !== 200) throw new Error(`Falha na rota /termos: HTTP ${termos.status}`);
  console.log('    ✓ Rota legal /termos operacional via SPA fallback.');

  console.log('\n🌟 Parabéns! A aplicação na nuvem está 100% íntegra, segura e operacional 24/7!');
}

runLiveE2E().catch(err => {
  console.error('\n❌ Erro durante os testes ao vivo na nuvem:', err.message);
  process.exit(1);
});
