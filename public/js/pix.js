// public/js/pix.js - Gerador Oficial de PIX EMV (Banco Central) e QR Code

export function calculateCRC16(payload) {
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

export function generatePixPayload({
  pixKey = 'luklen2@gmail.com',
  name = 'Luciano Sant Anna',
  city = 'Sao Paulo',
  amount = '19.90',
  txId = 'SWL001'
} = {}) {
  const formatField = (id, value) => {
    const len = String(value.length).padStart(2, '0');
    return `${id}${len}${value}`;
  };

  const merchantAccountInfo = [
    formatField('00', 'br.gov.bcb.pix'),
    formatField('01', pixKey)
  ].join('');

  const additionalDataField = formatField('05', txId);

  const cleanName = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 25);
  const cleanCity = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').slice(0, 15);

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

export function getPixQrCodeUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(payload)}`;
}

export function getWhatsAppConfirmUrl({ phone = '5511999999999', name = 'Luciano Sant Anna', amount = '19.90' } = {}) {
  const text = `Olá Luciano! Acabei de realizar o pagamento PIX de R$ ${amount} referente à licença vitalícia do SoundWorld dos Bichinhos (titular: ${name}, chave: luklen2@gmail.com). Segue meu comprovante em anexo para liberação do meu Código de Ativação VIP! 🐾🎶`;
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

// Lista oficial de Códigos de Ativação VIP fornecidos por Luciano aos compradores
const OFFICIAL_ACTIVATION_CODES = new Set([
  'BICHINHOS100',
  'MUNDOSONORO',
  'LUCIANO19',
  'VIP2026',
  'KIDS2026',
  'FLORESTA19',
  'SOM2026',
  'PRO2026'
]);

/**
 * Validador de Licença / Código de Ativação VIP
 * Aceita códigos oficiais ou chaves de licença no formato SW-XXXX
 */
export function validateActivationCode(rawCode) {
  if (!rawCode || typeof rawCode !== 'string') return false;
  const cleanCode = rawCode.trim().toUpperCase().replace(/[\s-]/g, '');
  if (!cleanCode) return false;

  // 1. Checagem direta na lista oficial de códigos
  if (OFFICIAL_ACTIVATION_CODES.has(cleanCode)) {
    return true;
  }

  // 2. Validação algorítmica de chave prefixada (ex: SW19A, SW2026, SWVIP...)
  if (cleanCode.startsWith('SW') && cleanCode.length >= 5) {
    let sum = 0;
    for (let i = 0; i < cleanCode.length; i++) {
      sum += cleanCode.charCodeAt(i);
    }
    // Chaves cujo checksum possui terminação esperada
    return sum % 7 === 0 || cleanCode.includes('19') || cleanCode.includes('26');
  }

  return false;
}

