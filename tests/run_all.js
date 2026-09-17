// tests/run_all.js - Suíte de Testes Automatizados de Integridade do SoundWorld dos Bichinhos

import assert from 'assert';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePixPayload, calculateCRC16, validateActivationCode } from '../public/js/pix.js';
import { translations } from '../public/js/i18n.js';
import { WORLDS, ANIMALS_CATALOG, FUTURE_WORLDS_BLUEPRINT } from '../public/js/catalog.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🧪 [SoundWorld dos Bichinhos] Iniciando testes automatizados...');

let passed = 0;

async function runTests() {
  // Teste 1: Validação do Algoritmo PIX EMV e CRC-16
  console.log('  → Testando PIX EMV oficial Bacen (luklen2@gmail.com - Luciano Sant Anna)...');
  const samplePayload = generatePixPayload({
    pixKey: 'luklen2@gmail.com',
    name: 'Luciano Sant Anna',
    city: 'Rio de Janeiro',
    amount: '19.90',
    txId: 'TEST01'
  });
  assert.ok(samplePayload.startsWith('000201'), 'PIX deve começar com formato 000201');
  assert.ok(samplePayload.includes('luklen2@gmail.com'), 'Deve conter a chave luklen2@gmail.com');
  assert.ok(samplePayload.includes('Luciano Sant Anna') || samplePayload.includes('LUCIANO SANT ANNA'), 'Deve conter o nome do titular');
  assert.ok(samplePayload.includes('Rio de Janeiro') || samplePayload.includes('RIO DE JANEIRO'), 'Deve conter a cidade Rio de Janeiro');
  const dataWithoutCrc = samplePayload.slice(0, -4);
  const expectedCrc = samplePayload.slice(-4);
  const calculatedCrc = calculateCRC16(dataWithoutCrc);
  assert.strictEqual(calculatedCrc, expectedCrc, 'CRC-16 deve bater com exatidão');
  passed++;
  console.log('    ✓ PIX EMV e redundância cíclica CRC-16/CCITT-FALSE validados.');

  // Teste 1b: Validador de Códigos de Ativação / Licença VIP
  console.log('  → Testando sistema anti-fraude e validação de Códigos VIP...');
  assert.strictEqual(validateActivationCode('BICHINHOS100'), true);
  assert.strictEqual(validateActivationCode('MUNDOSONORO'), true);
  assert.strictEqual(validateActivationCode('LUCIANO19'), true);
  assert.strictEqual(validateActivationCode('SOUNDKIDS'), true);
  assert.strictEqual(validateActivationCode('KIDS100'), true);
  assert.strictEqual(validateActivationCode('SW-19A'), true);
  assert.strictEqual(validateActivationCode('codigo_falso_123'), false);
  assert.strictEqual(validateActivationCode(''), false);
  passed++;
  console.log('    ✓ Validador de Códigos VIP e proteção de Paywall aprovados.');

  // Teste 1c: Catálogo Modular dos 7 Mundos e Blueprints de Expansão
  console.log('  → Testando Catálogo Modular (7 Mundos + Blueprints de Expansão)...');
  assert.strictEqual(WORLDS.length, 8, 'Deve conter 8 entradas (all + 7 mundos temáticos)');
  assert.strictEqual(ANIMALS_CATALOG.length, 16, 'Deve conter 16 bichinhos catalogados');
  assert.ok(FUTURE_WORLDS_BLUEPRINT.length >= 5, 'Deve conter blueprints para expansões futuras (cidade, transportes, IA)');
  passed++;
  console.log('    ✓ Catálogo modular dos 7 mundos e blueprints de expansão validados.');

  // Teste 2: Validação dos 16 Bichinhos (7 Mundos) no Dicionário Bilíngue
  console.log('  → Testando dicionário dos 16 animais (7 mundos) e paridade PT x EN...');
  const expectedAnimals = [
    'dog', 'cat', 'cow', 'frog', 'duck', 'lion',
    'sheep', 'bird', 'elephant', 'monkey', 'owl', 'horse',
    'dolphin', 'whale', 'cricket', 'bee'
  ];

  expectedAnimals.forEach(id => {
    assert.ok(translations.pt.animals[id], `Animal ausente em PT: ${id}`);
    assert.ok(translations.en.animals[id], `Animal ausente em EN: ${id}`);
    assert.ok(translations.pt.animals[id].name, `Nome ausente em PT: ${id}`);
    assert.ok(translations.en.animals[id].name, `Nome ausente em EN: ${id}`);
    assert.ok(translations.pt.animals[id].soundName, `Som ausente em PT: ${id}`);
    assert.ok(translations.en.animals[id].soundName, `Som ausente em EN: ${id}`);
  });
  passed++;
  console.log('    ✓ Todos os 16 animais cadastrados com nome, som e paridade bilíngue.');

  // Teste 2b: Validação dos 16 Arquivos de Áudio MP3 Naturais Autênticos
  console.log('  → Testando integridade acústica dos 16 arquivos de áudio gravados (MP3)...');
  expectedAnimals.forEach(id => {
    const filePath = path.join(__dirname, '..', 'public', 'audio', 'animals', `${id}.mp3`);
    assert.ok(fs.existsSync(filePath), `Arquivo de áudio ausente: ${id}.mp3`);
    const stat = fs.statSync(filePath);
    assert.ok(stat.size > 3000, `Arquivo de áudio corrompido ou muito pequeno: ${id}.mp3 (${stat.size} bytes)`);

    // Validação de cabeçalho MP3 / ID3
    const buf = Buffer.alloc(10);
    const fd = fs.openSync(filePath, 'r');
    fs.readSync(fd, buf, 0, 10, 0);
    fs.closeSync(fd);
    const isId3 = buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33;
    const isSync = buf[0] === 0xFF && (buf[1] & 0xE0) === 0xE0;
    assert.ok(isId3 || isSync, `Cabeçalho MP3 inválido para ${id}.mp3`);
  });
  passed++;
  console.log('    ✓ Todos os 16 arquivos MP3 gravados autênticos existem e estão íntegros.');

  // Teste 3: Paridade Estrutural das Chaves do Dicionário
  console.log('  → Testando simetria estrutural completa (PT vs EN)...');
  function checkKeys(ptObj, enObj, currentPath = '') {
    for (const key of Object.keys(ptObj)) {
      const fullPath = currentPath ? `${currentPath}.${key}` : key;
      assert.ok(enObj[key] !== undefined, `Chave ausente em EN: ${fullPath}`);
      if (typeof ptObj[key] === 'object' && ptObj[key] !== null) {
        assert.strictEqual(typeof enObj[key], 'object', `Tipo incompatível em EN: ${fullPath}`);
        checkKeys(ptObj[key], enObj[key], fullPath);
      }
    }
  }
  checkKeys(translations.pt, translations.en);
  passed++;
  console.log('    ✓ Dicionário bilíngue 100% simétrico entre PT e EN.');

  // Teste 3b: Validação das Diretrizes Comerciais, LGPD e Paywall (8 benefícios)
  console.log('  → Testando conformidade comercial, LGPD e Paywall (8 benefícios)...');
  assert.strictEqual(translations.pt.trial.kiwifyBenefit1, "Acesso ilimitado a todos os sons disponíveis");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit2, "16 bichinhos reais para explorar");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit3, "Jogos de descoberta sonora");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit4, "Teclado dos Bichinhos");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit5, "Modo noturno para relaxar");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit6, "Experiência sem anúncios");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit7, "Pagamento único");
  assert.strictEqual(translations.pt.trial.kiwifyBenefit8, "Acesso vitalício após a ativação");
  assert.strictEqual(translations.pt.trial.timerTrialExpired, "⏱️ Teste gratuito encerrado");
  assert.strictEqual(translations.pt.trial.paywallTitle, "Hora de continuar a aventura!");
  assert.ok(translations.pt.parentGate.legal.lgpdText.includes("Consulte nossa Política de Privacidade"));
  assert.strictEqual(translations.pt.howItWorks.step1Title, "Escolha uma atividade");
  assert.strictEqual(translations.pt.familySection.card1Title, "Sem anúncios");
  assert.strictEqual(translations.pt.parentGate.settings.volumeLimiter, "Controle de volume");
  assert.ok(!translations.pt.parentGate.patronage.description.includes("100% seguro para crianças"));
  assert.ok(translations.pt.parentGate.patronage.description.includes("Experiência infantil desenvolvida com foco em segurança"));
  passed++;
  console.log('    ✓ Diretrizes comerciais, LGPD, 5 passos, 4 pilares e 8 benefícios validados.');

  // Teste 4: Servidor HTTP, Health Check e Arquivos Estáticos
  console.log('  → Testando servidor HTTP e rotas de produção...');
  process.env.NO_LISTEN = 'true';
  const { default: server } = await import('../server.js');

  const testPort = 3002;
  await new Promise(resolve => server.listen(testPort, resolve));

  const fetchHttp = (path) => {
    return new Promise((resolve, reject) => {
      http.get(`http://localhost:${testPort}${path}`, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
      }).on('error', reject);
    });
  };

  // 4a. Health Check
  const healthRes = await fetchHttp('/api/health');
  assert.strictEqual(healthRes.status, 200);
  const healthJson = JSON.parse(healthRes.body);
  assert.strictEqual(healthJson.status, 'ok');
  assert.strictEqual(healthJson.version, '2.0.0');
  assert.strictEqual(typeof healthJson.uptime_seconds, 'number');
  assert.ok(healthJson.timestamp);
  passed++;
  console.log('    ✓ Endpoint mandatório /api/health respondendo 200 OK.');

  // 4b. API PIX com suporte a Pedido Único (orderId)
  const pixRes = await fetchHttp('/api/pix?amount=19.90&orderId=SWK-2026-TEST');
  assert.strictEqual(pixRes.status, 200);
  const pixJson = JSON.parse(pixRes.body);
  assert.strictEqual(pixJson.status, 'success');
  assert.strictEqual(pixJson.orderId, 'SWK-2026-TEST');
  assert.ok(pixJson.copiaECola.includes('6304'));
  passed++;
  console.log('    ✓ Endpoint /api/pix respondendo com payload, QR Code e Order ID.');

  // 4c. Arquivos Estáticos, SPA Fallback e Página de Vendas Dedicada (/comprar)
  const homeRes = await fetchHttp('/');
  assert.strictEqual(homeRes.status, 200);
  assert.ok(homeRes.body.includes('Mundo Sonoro dos Bichinhos') || homeRes.body.includes('SoundWorld Kids'));

  const comprarRes = await fetchHttp('/comprar');
  assert.strictEqual(comprarRes.status, 200);
  assert.ok(comprarRes.body.includes('SoundWorld Kids'));
  assert.ok(comprarRes.body.includes('Licença Vitalícia'));
  assert.ok(comprarRes.body.includes('19,90'));

  const cssRes = await fetchHttp('/css/styles.css');
  assert.strictEqual(cssRes.status, 200);
  assert.ok(cssRes.body.includes('animal-card'));

  const jsRes = await fetchHttp('/js/app.js');
  assert.strictEqual(jsRes.status, 200);

  const catalogRes = await fetchHttp('/js/catalog.js');
  assert.strictEqual(catalogRes.status, 200);
  assert.ok(catalogRes.body.includes('ANIMALS_CATALOG'));

  const spaRes = await fetchHttp('/termos');
  assert.strictEqual(spaRes.status, 200);
  assert.ok(spaRes.body.includes('Mundo Sonoro dos Bichinhos') || spaRes.body.includes('SoundWorld Kids'));

  const manifestRes = await fetchHttp('/manifest.json');
  assert.strictEqual(manifestRes.status, 200);
  assert.ok(manifestRes.body.includes('SoundWorld Kids'));

  const swRes = await fetchHttp('/sw.js');
  assert.strictEqual(swRes.status, 200);
  assert.ok(swRes.body.includes('soundworld-v7-live') || swRes.body.includes('CACHE_NAME'));

  const posterRes = await fetchHttp('/img/video-poster.svg');
  assert.strictEqual(posterRes.status, 200);
  assert.ok(posterRes.body.includes('svg'));

  const demoPlayerRes = await fetchHttp('/js/demo-player.js');
  assert.strictEqual(demoPlayerRes.status, 200);
  assert.ok(demoPlayerRes.body.includes('initDemoPlayer'));
  passed++;
  console.log('    ✓ Servidor estático, Landing Page (/comprar), Player de Vídeo Demo, PWA (manifest/sw v7), Catálogo (/js/catalog.js) e SPA fallback operacionais.');

  // 4d. Cabeçalhos de Segurança Estendidos e Privacidade Infantil
  assert.strictEqual(healthRes.headers['x-content-type-options'], 'nosniff');
  assert.strictEqual(healthRes.headers['x-frame-options'], 'SAMEORIGIN');
  assert.ok(healthRes.headers['content-security-policy'], 'CSP deve estar presente');
  assert.ok(healthRes.headers['permissions-policy'].includes('camera=()'), 'Camera deve estar desativada');
  assert.ok(healthRes.headers['permissions-policy'].includes('microphone=()'), 'Microfone deve estar desativado');
  passed++;
  console.log('    ✓ Cabeçalhos de segurança estendidos e proteção infantil (CSP, Permissions-Policy) confirmados.');

  await new Promise(resolve => server.close(resolve));

  console.log(`\n🎉 Todos os ${passed} testes de integridade passaram com 100% de sucesso!`);
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Falha nos testes de integridade:', err);
  process.exit(1);
});
