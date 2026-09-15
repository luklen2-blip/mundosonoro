// public/js/i18n.js - Sistema Bilíngue Dinâmico (Português / Inglês) para o SoundWorld dos Bichinhos

export const translations = {
  pt: {
    appTitle: "Mundo Sonoro dos Bichinhos",
    appSubtitle: "Toque nos bichos para ouvir o som e o nome!",
    backToHome: "Voltar",

    // Modos de Navegação
    modes: {
      activityHub: {
        title: "O Que Vamos Brincar Hoje? 🎈",
        subtitle: "Toque em uma das atividades para começar a diversão!",
        badge: "Início 🏠",
        exploreDesc: "12 bichinhos com sons reais e nomes falados",
        soundQuizDesc: "Descubra quem faz o som com incentivo carinhoso",
        pianoDesc: "Toque músicas com as vozes dos bichinhos cantores",
        bedtimeDesc: "Chuva, grilos, caixinha de música e ronrom para ninar"
      },
      backToHub: "⬅️ Início",
      explore: {
        title: "Conhecer Bichinhos",
        badge: "Toque e Ouça 🐾",
        subtitle: "Toque no bicho para ouvir o barulho e o nome dele!"
      },
      soundQuiz: {
        title: "Quem Faz esse Som?",
        badge: "Jogo do Som 👂",
        subtitle: "Escute com atenção e adivinhe qual é o bichinho!",
        listenAgain: "Ouvir o Som de Novo 🔊",
        question: "Quem faz esse som legal?",
        success: "Muito bem! Você acertou!",
        tryAgain: "Quase lá! Vamos ouvir com carinho?",
        nextRound: "Próximo Som ➡️"
      },
      findAnimal: {
        title: "Onde Está o Bichinho?",
        badge: "Caça ao Bicho 🔍",
        subtitle: "A voz vai chamar um bichinho. Encontre ele!",
        listenPrompt: "Repetir o Nome 🗣️",
        questionPrefix: "Onde está o ",
        questionSuffix: "?",
        successPrefix: "Parabéns! Você achou o ",
        nextRound: "Próximo Bichinho ➡️"
      },
      piano: {
        title: "Teclado dos Bichinhos",
        badge: "Piano Animal 🎹",
        subtitle: "Toque as teclas e faça os bichinhos cantarem música!",
        selectSinger: "Escolha quem vai cantar:",
        keys: {
          c1: "Dó",
          d: "Ré",
          e: "Mi",
          f: "Fá",
          g: "Sol",
          a: "Lá",
          b: "Si",
          c2: "Dó"
        }
      },
      bedtime: {
        title: "Hora de Dormir",
        badge: "Acalanto e Sono 🌙",
        subtitle: "Sons suaves e aconchegantes para os bichinhos descansarem.",
        nightStatus: "Os bichinhos estão sonhando...",
        rain: "Chuva Suave",
        crickets: "Grilos Noturnos",
        lullaby: "Caixinha de Música",
        purr: "Ronrom do Gatinho",
        disclaimer: "Ambiente sonoro suave para relaxamento e rotina de sono da família. Não substitui orientações médicas.",
        masterPlay: "Tocar Sons Suaves 🎵",
        masterPause: "Pausar Todos os Sons ⏸️",
        timerLabel: "Desligamento Automático (Modo Sono):",
        timer15: "15 min",
        timer30: "30 min",
        timer45: "45 min",
        timer60: "60 min",
        timerOff: "Sem Timer"
      }
    },

    // Nomes e Onomatopeias dos 12 Animais
    animals: {
      dog: { name: "Cachorro", soundName: "Au-Au!", article: "o" },
      cat: { name: "Gato", soundName: "Miau!", article: "o" },
      cow: { name: "Vaca", soundName: "Muuu!", article: "a" },
      frog: { name: "Sapo", soundName: "Co-ax!", article: "o" },
      duck: { name: "Pato", soundName: "Quack-Quack!", article: "o" },
      lion: { name: "Leão", soundName: "Roaaar!", article: "o" },
      sheep: { name: "Ovelha", soundName: "Mééé!", article: "a" },
      bird: { name: "Passarinho", soundName: "Piu-Piu!", article: "o" },
      elephant: { name: "Elefante", soundName: "Fuuu!", article: "o" },
      monkey: { name: "Macaco", soundName: "Uh-Uh-Ah-Ah!", article: "o" },
      owl: { name: "Coruja", soundName: "Hoo-Hoo!", article: "a" },
      horse: { name: "Cavalo", soundName: "Iii-hóóó!", article: "o" }
    },

    trial: {
      badge: "1h Grátis: ",
      badgeExpired: "Tempo Esgotado 🔒",
      badgeUnlocked: "Vitalício Ativo 🌟",
      paywallTitle: "Hora de Continuar a Aventura no Mundo Sonoro! 🌟🐾",
      paywallSubtitle: "O tempo de teste gratuito terminou! Para liberar o acesso vitalício, ilimitado e para sempre para toda a família, custa apenas R$ 19,90. Sem mensalidades e 100% livre de anúncios!",
      offerTitle: "Acesso Vitalício por R$ 19,90",
      kiwifyBtn: "Liberar Acesso Vitalício por R$ 19,90",
      kiwifyBtnSub: "Pagamento único • Acesso vitalício para sempre",
      kiwifyBenefit1: "12 Bichinhos com sons reais da natureza",
      kiwifyBenefit2: "Piano Musical & Jogo dos Sons educativo",
      kiwifyBenefit3: "Modo Noturno com acalanto para dormir",
      kiwifyBenefit4: "100% livre de anúncios e compras acidentais",
      kiwifySecure: "🔒 Pagamento 100% Seguro via Kiwify • PIX e Cartão • Liberação Imediata",
      kiwifyBilingualTag: "🌎 Ativação imediata para toda a família em qualquer dispositivo",
      langLabel: "Idioma do Aplicativo:",
      langSwitchBtn: "Português 🇧🇷",
      offerDesc: "Pagamento único via PIX para Luciano Sant Anna. Sem mensalidades, sem anúncios comerciais.",
      pixKeyLabel: "Chave PIX Oficial (E-mail):",
      pixNameLabel: "Beneficiário: Luciano Sant Anna",
      copyPixBtn: "Copiar Código PIX Copia-e-Cola 📋",
      copied: "Código PIX Copiado com Sucesso!",
      whatsappBtn: "Enviar Comprovante via WhatsApp 📱",
      enterCodeTitle: "Já fez o PIX? Digite seu Código de Ativação:",
      codePlaceholder: "Ex: BICHINHOS100",
      validateBtn: "Validar Código 🔑",
      codeHelp: "O código é liberado imediatamente no WhatsApp após o envio do comprovante.",
      codeError: "Código inválido ou incorreto. Envie o comprovante no WhatsApp para receber seu código.",
      codeSuccess: "Código VIP validado com sucesso! Acesso vitalício liberado!",
      unlockBtn: "Validar e Liberar Acesso 🔓",
      unlockedToast: "🎉 Parabéns! Acesso vitalício liberado com sucesso!",
      orderIdLabel: "Identificador do Pedido:",
      statusWaiting: "Aguardando confirmação do PIX...",
      statusActive: "Licença Vitalícia Ativa! 🌟"
    },

    // Área dos Pais (Parent Gate)
    parentGate: {
      buttonLabel: "Pais 🔒",
      learnMoreLink: "ℹ️ Para os Pais / Conheça Mais",
      modalTitle: "Espaço Seguro dos Pais & Responsáveis",
      subtitle: "Configurações de segurança auditiva, volume e tempo de tela",
      unlockInstruction: "Segure o botão por 3 segundos ou responda a conta:",
      pressAndHold: "Segure pressionado (3s)...",
      mathVerify: "Entrar",
      mathError: "Resposta incorreta. Tente novamente.",
      backToGame: "Voltar para a Brincadeira 🧸",
      todayUsage: "Tempo de brincadeira hoje:",
      minutes: "minutos",
      orderIdLabel: "Número do Pedido:",
      licenseStatus: "Status da Licença:",
      licenseTrial: "Período Gratuito (1 Hora)",
      licenseVip: "Vitalícia VIP Ativada 🌟",
      parentAreaBadge: "🛡️ Área Exclusiva dos Pais e Responsáveis",

      settings: {
        volumeLimiter: "Limitador de Volume Seguro (dB)",
        volumeDescription: "Protege a audição sensível dos pequenos limitando o ganho máximo do som.",
        safeLevel: "✓ Nível Seguro Recomendado",
        languageSelect: "Idioma Principal",
        screenTimer: "Temporizador de Tela (Modo Sono)",
        timerOff: "Desativado",
        timer15: "15 minutos",
        timer30: "30 minutos",
        timer45: "45 minutos",
        timerActive: "Tempo restante: "
      },

      patronage: {
        title: "Licença Vitalícia SoundWorld 🌟",
        description: "Adquira o acesso vitalício completo por apenas R$ 19,90 (pagamento único via PIX para Luciano Sant Anna). Aplicativo 100% seguro para crianças, sem anúncios e com sons ilimitados.",
        copyPix: "Copiar Código PIX (R$ 19,90)",
        copied: "Chave PIX Copiada com Sucesso!",
        enterCode: "Inserir Código de Ativação"
      },

      legal: {
        title: "Avisos Éticos, Segurança e LGPD",
        disclaimer: "Este software é um recurso recreativo e interativo de desenvolvimento sensorial para a primeira infância (2 a 6 anos). Não substitui intervenções médicas, fonoaudiológicas ou psicológicas.",
        ageNotice: "Faixa Etária Recomendada: 2 a 6 anos. Uso supervisionado por pais ou responsáveis.",
        lgpdText: "Conformidade integral com o Art. 14 da LGPD (Lei nº 13.709/2018). Não coletamos nem armazenamos quaisquer dados pessoais, biométricos ou fotos de crianças.",
        termsLink: "Termos de Uso",
        privacyLink: "Política de Privacidade"
      },

      close: "Fechar"
    },

    legalModal: {
      termsTitle: "Termos de Uso - Mundo Sonoro dos Bichinhos",
      termsBody: "<p><strong>1. Finalidade Educativa e Lúdica:</strong> O SoundWorld Kids é um recurso interativo de estimulação auditiva sensorial, musical e conhecimento dos bichinhos para a primeira infância (2 a 6 anos).</p><p><strong>2. Supervisão dos Pais:</strong> O aplicativo deve ser utilizado sob supervisão carinhosa de pais, mães ou responsáveis legais.</p><p><strong>3. Isenção e Saúde:</strong> Este software não substitui diagnósticos ou orientações médicas, fonoaudiológicas ou psicológicas profissionais.</p><p><strong>4. Acesso Vitalício:</strong> O pagamento único confere licença de uso contínua, sem mensalidades ou renovações automáticas.</p>",
      privacyTitle: "Política de Privacidade e Proteção à Criança (LGPD)",
      privacyBody: "<p><strong>1. Privacidade Sagrada da Criança (Art. 14 LGPD):</strong> Em total conformidade com a LGPD e o Estatuto da Criança e do Adolescente (ECA), NÃO coletamos, NÃO rastreamos e NÃO comercializamos nenhum dado pessoal, biométrico ou fotos de crianças.</p><p><strong>2. Execução Segura no Dispositivo:</strong> A síntese de voz e os sons operam no navegador local (Web Audio API e SpeechSynthesis), sem telemetria sonora enviada para servidores.</p><p><strong>3. Ambiente 100% Livre de Propagandas:</strong> Zero anúncios de terceiros, sem links ocultos e configurações protegidas por trava exclusiva para os pais (Parent Gate).</p>",
      closeBtn: "Entendi"
    }
  },

  en: {
    appTitle: "Animal SoundWorld",
    appSubtitle: "Tap the animals to hear their sound and name!",
    backToHome: "Back",

    // Navigation Modes
    modes: {
      activityHub: {
        title: "What Shall We Play Today? 🎈",
        subtitle: "Tap an activity card below to start the fun!",
        badge: "Home 🏠",
        exploreDesc: "12 animals with real sounds and spoken names",
        soundQuizDesc: "Guess who makes the sound with warm cheering",
        pianoDesc: "Play songs with animal voices as singers",
        bedtimeDesc: "Rain, crickets, music box, and calming purrs"
      },
      backToHub: "⬅️ Home",
      explore: {
        title: "Meet the Animals",
        badge: "Tap & Hear 🐾",
        subtitle: "Tap any animal to hear its real sound and spoken name!"
      },
      soundQuiz: {
        title: "Who Makes this Sound?",
        badge: "Sound Quiz 👂",
        subtitle: "Listen carefully and guess which animal made that sound!",
        listenAgain: "Listen to Sound Again 🔊",
        question: "Who makes this fun sound?",
        success: "Great job! You got it right!",
        tryAgain: "Almost! Let's listen closely once more!",
        nextRound: "Next Sound ➡️"
      },
      findAnimal: {
        title: "Where is the Animal?",
        badge: "Find Animal 🔍",
        subtitle: "Listen to the voice calling an animal. Can you find it?",
        listenPrompt: "Repeat Animal Name 🗣️",
        questionPrefix: "Where is the ",
        questionSuffix: "?",
        successPrefix: "Awesome! You found the ",
        nextRound: "Next Animal ➡️"
      },
      piano: {
        title: "Animal Piano",
        badge: "Animal Piano 🎹",
        subtitle: "Tap the keys and make your favorite animals sing music!",
        selectSinger: "Choose who will sing:",
        keys: {
          c1: "C",
          d: "D",
          e: "E",
          f: "F",
          g: "G",
          a: "A",
          b: "B",
          c2: "C"
        }
      },
      bedtime: {
        title: "Bedtime Animals",
        badge: "Sleep & Rest 🌙",
        subtitle: "Gentle, soothing ambient sounds for little ones to sleep.",
        nightStatus: "The animals are dreaming peacefully...",
        rain: "Soft Rain",
        crickets: "Night Crickets",
        lullaby: "Music Box",
        purr: "Purring Kitty",
        disclaimer: "Calming ambient soundscape for family relaxation and bedtime routine. Does not replace medical guidance.",
        masterPlay: "Play Gentle Sounds 🎵",
        masterPause: "Pause All Sounds ⏸️",
        timerLabel: "Automatic Shutoff (Sleep Mode):",
        timer15: "15 min",
        timer30: "30 min",
        timer45: "45 min",
        timer60: "60 min",
        timerOff: "No Timer"
      }
    },

    // 12 Animals Names and Sounds
    animals: {
      dog: { name: "Dog", soundName: "Woof-Woof!", article: "the" },
      cat: { name: "Cat", soundName: "Meow!", article: "the" },
      cow: { name: "Cow", soundName: "Moo!", article: "the" },
      frog: { name: "Frog", soundName: "Ribbit!", article: "the" },
      duck: { name: "Duck", soundName: "Quack-Quack!", article: "the" },
      lion: { name: "Lion", soundName: "Roaaar!", article: "the" },
      sheep: { name: "Sheep", soundName: "Baa-Baa!", article: "the" },
      bird: { name: "Bird", soundName: "Tweet-Tweet!", article: "the" },
      elephant: { name: "Elephant", soundName: "Trumpet!", article: "the" },
      monkey: { name: "Monkey", soundName: "Ooh-Ooh-Aah!", article: "the" },
      owl: { name: "Owl", soundName: "Hoot-Hoot!", article: "the" },
      horse: { name: "Horse", soundName: "Neigh!", article: "the" }
    },

    trial: {
      badge: "1h Free: ",
      badgeExpired: "Time Expired 🔒",
      badgeUnlocked: "Lifetime Active 🌟",
      paywallTitle: "Time to Continue the Adventure in SoundWorld! 🌟🐾",
      paywallSubtitle: "The free trial has ended! To unlock unlimited lifetime access forever for the entire family, it's only R$ 19.90. No monthly fees and 100% ad-free!",
      offerTitle: "Lifetime Access for R$ 19.90",
      kiwifyBtn: "Unlock Lifetime Access for R$ 19.90",
      kiwifyBtnSub: "One-time payment • Lifetime access forever",
      kiwifyBenefit1: "12 Animals with real nature sounds",
      kiwifyBenefit2: "Animal Piano & Educational Sound Quiz",
      kiwifyBenefit3: "Bedtime mode with soothing sleep sounds",
      kiwifyBenefit4: "100% ad-free with zero accidental purchases",
      kiwifySecure: "🔒 100% Secure Checkout via Kiwify • Instant Access",
      kiwifyBilingualTag: "🌎 Instant activation for the whole family on any device",
      langLabel: "App Language:",
      langSwitchBtn: "English 🇺🇸",
      offerDesc: "One-time PIX payment to Luciano Sant Anna. No subscriptions, no ads.",
      pixKeyLabel: "Official PIX Key (E-mail):",
      pixNameLabel: "Beneficiary: Luciano Sant Anna",
      copyPixBtn: "Copy PIX Code 📋",
      copied: "PIX Code Copied!",
      whatsappBtn: "Send Receipt via WhatsApp 📱",
      enterCodeTitle: "Paid via PIX? Enter your Activation Code:",
      codePlaceholder: "Ex: BICHINHOS100",
      validateBtn: "Validate Code 🔑",
      codeHelp: "Your VIP code is delivered instantly via WhatsApp once the receipt is confirmed.",
      codeError: "Invalid code. Please send your receipt via WhatsApp to receive your code.",
      codeSuccess: "VIP code verified successfully! Lifetime access unlocked!",
      unlockBtn: "Validate & Unlock Access 🔓",
      unlockedToast: "🎉 Congratulations! Lifetime access unlocked successfully!",
      orderIdLabel: "Order Identifier:",
      statusWaiting: "Waiting for PIX confirmation...",
      statusActive: "Lifetime License Active! 🌟"
    },

    // Parent Gate
    parentGate: {
      buttonLabel: "Parents 🔒",
      learnMoreLink: "ℹ️ For Parents / Learn More",
      modalTitle: "Parents & Caregivers Safe Space",
      subtitle: "Hearing safety, volume limits, and screen time management",
      unlockInstruction: "Hold the button for 3 seconds or solve the sum:",
      pressAndHold: "Hold down (3s)...",
      mathVerify: "Enter",
      mathError: "Incorrect answer. Please try again.",
      backToGame: "Back to the Game 🧸",
      todayUsage: "Playtime today:",
      minutes: "minutes",
      orderIdLabel: "Order Number:",
      licenseStatus: "License Status:",
      licenseTrial: "Free Trial Period (1 Hour)",
      licenseVip: "VIP Lifetime Activated 🌟",
      parentAreaBadge: "🛡️ Exclusive Parents & Caregivers Area",

      settings: {
        volumeLimiter: "Safe Volume Limiter (dB)",
        volumeDescription: "Protects sensitive toddler hearing by capping peak audio output.",
        safeLevel: "✓ Recommended Safe Level",
        languageSelect: "Main Language",
        screenTimer: "Screen Time Timer (Bedtime Mode)",
        timerOff: "Off",
        timer15: "15 minutes",
        timer30: "30 minutes",
        timer45: "45 minutes",
        timerActive: "Time remaining: "
      },

      patronage: {
        title: "SoundWorld Lifetime License 🌟",
        description: "Unlock full lifetime access for just R$ 19.90 (one-time PIX payment to Luciano Sant Anna). 100% kid-safe app, zero ads, unlimited sounds.",
        copyPix: "Copy PIX Code (R$ 19.90)",
        copied: "PIX Code Copied to Clipboard!",
        enterCode: "Enter Activation Code"
      },

      legal: {
        title: "Ethical Notice, Safety & Privacy (LGPD)",
        disclaimer: "This software is a playful sensory audio tool for early childhood (ages 2 to 6). It does not replace medical, speech therapy, or psychological care.",
        ageNotice: "Recommended Age: 2 to 6 years old. Supervised by parents or guardians.",
        lgpdText: "Strict compliance with child privacy standards and Art. 14 of LGPD. We never collect, track, or share any personal data, photos, or voice recordings.",
        termsLink: "Terms of Use",
        privacyLink: "Privacy Policy"
      },

      close: "Close"
    },

    legalModal: {
      termsTitle: "Terms of Service - SoundWorld Kids",
      termsBody: "<p><strong>1. Educational & Playful Purpose:</strong> SoundWorld Kids is an interactive sensory, auditory, and musical exploration resource for toddlers and young children (ages 2 to 6).</p><p><strong>2. Parental Supervision:</strong> The app should always be enjoyed with the supervision of parents or guardians.</p><p><strong>3. Medical Disclaimer:</strong> This software is recreational and does not replace medical, speech therapy, or psychological care.</p><p><strong>4. Lifetime Access:</strong> The one-time payment provides permanent family access without recurring subscriptions.</p>",
      privacyTitle: "Privacy Policy & Child Safety (LGPD & Children's Privacy)",
      privacyBody: "<p><strong>1. Strict Child Privacy Protection:</strong> In full compliance with Art. 14 of LGPD and international child privacy standards, we DO NOT collect, track, or share any personal data, voice recordings, or photos of children.</p><p><strong>2. 100% On-Device Operation:</strong> Sound effects and voice synthesis run locally inside your browser (Web Audio API & SpeechSynthesis) without server audio streaming.</p><p><strong>3. 100% Ad-Free Safe Space:</strong> Zero commercial advertisements, no tracking cookies, and settings securely locked behind the adult Parent Gate.</p>",
      closeBtn: "Got it"
    }
  }
};

let currentLang = 'pt';
const listeners = new Set();

export function setLanguage(lang) {
  if (lang !== 'pt' && lang !== 'en') lang = 'pt';
  currentLang = lang;
  try {
    localStorage.setItem('soundworld_lang', currentLang);
    document.documentElement.lang = currentLang === 'pt' ? 'pt-BR' : 'en-US';
  } catch {}
  notifyListeners();
}

export function getLanguage() {
  if (!currentLang) {
    try {
      currentLang = localStorage.getItem('soundworld_lang') || 'pt';
    } catch {
      currentLang = 'pt';
    }
  }
  return currentLang;
}

export function t(path) {
  const keys = path.split('.');
  let obj = translations[getLanguage()] || translations.pt;
  for (const k of keys) {
    if (obj && obj[k] !== undefined) {
      obj = obj[k];
    } else {
      let fallbackObj = translations.pt;
      for (const fb of keys) {
        if (fallbackObj && fallbackObj[fb] !== undefined) {
          fallbackObj = fallbackObj[fb];
        } else {
          return path;
        }
      }
      return fallbackObj;
    }
  }
  return obj;
}

export function subscribeLanguage(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function notifyListeners() {
  for (const cb of listeners) {
    try {
      cb(currentLang);
    } catch (e) {
      console.error('Error in i18n listener:', e);
    }
  }
}
