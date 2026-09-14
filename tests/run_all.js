// tests/run_all.js - Suíte de Testes Automatizados de Integridade do SoundWorld dos Bichinhos

import assert from 'assert';
import http from 'http';
import { generatePixPayload, calculateCRC16 } from '../public/js/pix.js';
import { translations } from '../public/js/i18n.js';

console.log('🧪 [SoundWorld dos Bichinhos] Iniciando testes automatizados...');

let passed = 0;

async function runTests() {
  // Teste 1: Validação do Algoritmo PIX EMV e CRC-16
  console.log('  → Testando PIX EMV oficial Bacen (luklen2@gmail.com - Luciano Sant Anna)...');
  const samplePayload = generatePixPayload({
    pixKey: 'luklen2@gmail.com',
    name: 'Luciano Sant Anna',
    city: 'Sao Paulo',
    amount: '19.90',
    txId: 'TEST01'
  });
  assert.ok(samplePayload.startsWith('000201'), 'PIX deve começar com formato 000201');
  assert.ok(samplePayload.includes('luklen2@gmail.com'), 'Deve conter a chave luklen2@gmail.com');
  assert.ok(samplePayload.includes('Luciano Sant Anna') || samplePayload.includes('LUCIANO SANT ANNA'), 'Deve conter o nome do titular');
  const dataWithoutCrc = samplePayload.slice(0, -4);
  const expectedCrc = samplePayload.slice(-4);
  const calculatedCrc = calculateCRC16(dataWithoutCrc);
  assert.strictEqual(calculatedCrc, expectedCrc, 'CRC-16 deve bater com exatidão');
  passed++;
  console.log('    ✓ PIX EMV e redundância cíclica CRC-16/CCITT-FALSE validados.');

  // Teste 2: Validação dos 12 Bichinhos no Dicionário Bilíngue
  console.log('  → Testando dicionário dos 12 animais e paridade PT x EN...');
  const expectedAnimals = [
    'dog', 'cat', 'cow', 'frog', 'duck', 'lion',
    'sheep', 'bird', 'elephant', 'monkey', 'owl', 'horse'
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
  console.log('    ✓ Todos os 12 animais cadastrados com nome, som e paridade bilíngue.');

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

  // 4b. API PIX
  const pixRes = await fetchHttp('/api/pix?amount=20.00');
  assert.strictEqual(pixRes.status, 200);
  const pixJson = JSON.parse(pixRes.body);
  assert.strictEqual(pixJson.status, 'success');
  assert.ok(pixJson.copiaECola.includes('6304'));
  passed++;
  console.log('    ✓ Endpoint /api/pix respondendo com payload e QR Code.');

  // 4c. Arquivos Estáticos e SPA Fallback
  const homeRes = await fetchHttp('/');
  assert.strictEqual(homeRes.status, 200);
  assert.ok(homeRes.body.includes('SoundWorld dos Bichinhos'));

  const cssRes = await fetchHttp('/css/styles.css');
  assert.strictEqual(cssRes.status, 200);
  assert.ok(cssRes.body.includes('animal-card'));

  const jsRes = await fetchHttp('/js/app.js');
  assert.strictEqual(jsRes.status, 200);

  const spaRes = await fetchHttp('/termos');
  assert.strictEqual(spaRes.status, 200);
  assert.ok(spaRes.body.includes('SoundWorld dos Bichinhos'));
  passed++;
  console.log('    ✓ Servidor estático e SPA fallback operacionais.');

  // 4d. Cabeçalhos de Segurança
  assert.strictEqual(healthRes.headers['x-content-type-options'], 'nosniff');
  assert.strictEqual(healthRes.headers['x-frame-options'], 'SAMEORIGIN');
  passed++;
  console.log('    ✓ Cabeçalhos de segurança (nosniff, sameorigin) confirmados.');

  await new Promise(resolve => server.close(resolve));

  console.log(`\n🎉 Todos os ${passed} testes de integridade passaram com 100% de sucesso!`);
  process.exit(0);
}

runTests().catch(err => {
  console.error('\n❌ Falha nos testes de integridade:', err);
  process.exit(1);
});
