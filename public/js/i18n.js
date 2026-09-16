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
        exploreDesc: "16 bichinhos reais com sons autênticos e nomes falados",
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
        ocean: "Oceano Tranquilo",
        forest: "Floresta Serena",
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

    // Mundos Temáticos dos Bichinhos
    worlds: {
      all: "Todos",
      home: "Casa",
      farm: "Fazenda",
      jungle: "Selva",
      africa: "África",
      ocean: "Oceano",
      forest: "Floresta",
      bugs: "Pequenos Bichos"
    },

    // Nova Home & Posicionamento
    home: {
      badge: "SOUNDWORLD KIDS",
      title: "Mundo Sonoro dos Bichinhos",
      welcome: "Brinque, escute e descubra um mundo cheio de sons.",
      slogan: "Brinque. Escute. Descubra.",
      startPlayBtn: "COMEÇAR A BRINCAR",
      parentsAreaBtn: "ÁREA DOS PAIS"
    },

    // Níveis do Quiz Progressivo
    quizLevels: {
      level1: "Nível 1 (3 Bichinhos)",
      level2: "Nível 2 (4 Bichinhos)",
      level3: "Nível 3 (Desafio Auditivo)",
      starsLabel: "Estrelinhas:",
      correctPrompt: "Acertou! 🎉",
      tryAgainPrompt: "Quase! Tente novamente. 🌟"
    },

    // Mini Sequenciador Musical do Teclado
    sequencer: {
      title: "Fita de Músicas:",
      playBtn: "▶️ Ouvir Sequência",
      clearBtn: "🗑️ Limpar",
      emptyMsg: "Toque as teclas para criar uma música!"
    },

    // Seção Como Funciona (5 Passos)
    howItWorks: {
      title: "Como funciona?",
      subtitle: "Uma experiência simples, segura e divertida para as crianças",
      step1Title: "Escolha uma atividade",
      step1Desc: "A criança pode conhecer os bichinhos, descobrir sons ou tocar no teclado.",
      step2Title: "Explore os sons",
      step2Desc: "Toque nos bichinhos e descubra o som e o nome de cada um.",
      step3Title: "Brinque e aprenda",
      step3Desc: "Participe dos jogos de adivinhar o som e encontrar os bichinhos.",
      step4Title: "Relaxe quando quiser",
      step4Desc: "Ative o modo noturno com sons suaves para momentos de calma.",
      step5Title: "Acompanhe pela Área dos Pais",
      step5Desc: "Os responsáveis podem verificar o tempo de uso e ajustar opções disponíveis."
    },

    // Seção Espaço de Vídeo
    videoSection: {
      title: "Veja como funciona",
      subtitle: "Demonstração de 20 a 30 segundos dos recursos reais do SoundWorld Kids",
      placeholderBadge: "Vídeo de Demonstração em Breve",
      placeholderDesc: "Conhecer Bichinhos • Jogo do Som • Piano • Hora de Dormir • Área dos Pais • R$ 19,90"
    },

    // Seção Feito pensando na família (4 Cards)
    familySection: {
      title: "Feito pensando na família",
      subtitle: "Uma experiência simples, segura e divertida para as crianças, com recursos que ajudam os responsáveis a acompanhar o uso.",
      card1Title: "Sem anúncios",
      card1Desc: "Uma experiência livre de propagandas e sem interrupções durante a brincadeira.",
      card2Title: "Controle de tempo",
      card2Desc: "Os responsáveis podem acompanhar e limitar o tempo de uso.",
      card3Title: "Controle de volume",
      card3Desc: "Opção de limitar a intensidade do som para maior conforto.",
      card4Title: "Pagamento único",
      card4Desc: "Uma única compra para liberar o acesso vitalício, sem mensalidades.",
      ethicalNotice: "O SoundWorld Kids é uma experiência sensorial e lúdica para toda a família. Não substitui orientações médicas ou diagnósticos profissionais."
    },

    // Seção Por que famílias escolhem o SoundWorld?
    whyFamiliesChoose: {
      title: "Por que famílias escolhem o SoundWorld?",
      subtitle: "Recursos reais pensados com carinho para o dia a dia",
      item1: "100% sem anúncios e livre de compras acidentais",
      item2: "Controle de volume seguro com limite de 85 dB",
      item3: "Temporizador para organizar a rotina do sono",
      item4: "Vários modos de brincadeira e 16 bichinhos reais",
      item5: "Acesso ilimitado a todos os sons disponíveis",
      item6: "Pagamento único e vitalício de apenas R$ 19,90"
    },

    // Nomes e Onomatopeias dos 16 Animais (7 Mundos)
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
      horse: { name: "Cavalo", soundName: "Iii-hóóó!", article: "o" },
      dolphin: { name: "Golfinho", soundName: "Iii-kik-kik!", article: "o" },
      whale: { name: "Baleia", soundName: "Huuuummm!", article: "a" },
      cricket: { name: "Grilo", soundName: "Cri-cri!", article: "o" },
      bee: { name: "Abelha", soundName: "Bzzzz!", article: "a" }
    },

    trial: {
      badge: "1h Grátis: ",
      badgeExpired: "Tempo Esgotado 🔒",
      badgeUnlocked: "Acesso Liberado 🌟",
      timerTrialInitial: "⏱️ Teste gratuito: 60 min",
      timerTrialRemainingMins: "⏱️ Restam {m} min",
      timerTrialRemainingSecs: "⏱️ Restam {s}s",
      timerTrialExpired: "⏱️ Teste gratuito encerrado",
      paywallTitle: "Hora de continuar a aventura!",
      paywallSubtitle: "O seu período gratuito terminou. Desbloqueie o acesso completo para continuar explorando os sons, brincadeiras e momentos de diversão do SoundWorld Kids.",
      offerTitle: "Acesso Vitalício por R$ 19,90",
      unlockNowBtn: "DESBLOQUEAR AGORA",
      wantToUnlockBtn: "QUERO DESBLOQUEAR",
      kiwifyBtn: "DESBLOQUEAR AGORA",
      kiwifyBtnSub: "Pagamento único • Acesso vitalício para toda a família",
      kiwifyBenefit1: "Acesso ilimitado a todos os sons disponíveis",
      kiwifyBenefit2: "12 bichinhos para explorar",
      kiwifyBenefit3: "Jogos de descoberta sonora",
      kiwifyBenefit4: "Teclado dos Bichinhos",
      kiwifyBenefit5: "Modo noturno para relaxar",
      kiwifyBenefit6: "Experiência sem anúncios",
      kiwifyBenefit7: "Pagamento único",
      kiwifyBenefit8: "Acesso vitalício após a ativação",
      kiwifySecure: "🔒 Pagamento 100% Seguro via Kiwify • PIX e Cartão • Liberação Imediata",
      kiwifyBilingualTag: "🌎 Ativação imediata para toda a família em qualquer dispositivo",
      offerDetails: "Desbloqueie o acesso vitalício a todos os recursos e conteúdos disponíveis. Pagamento único de R$ 19,90 sem mensalidade.",
      langLabel: "Idioma do Aplicativo:",
      langSwitchBtn: "Português 🇧🇷",
      offerDesc: "Pagamento único de R$ 19,90. Acesso vitalício para toda a família sem mensalidades.",
      pixKeyLabel: "Chave PIX Oficial (E-mail):",
      pixNameLabel: "Beneficiário: Luciano Sant Anna",
      copyPixBtn: "Copiar Código PIX Copia-e-Cola 📋",
      copied: "Código PIX Copiado com Sucesso!",
      unlockCtaBtn: "QUERO DESBLOQUEAR",
      unlockedToast: "🎉 Parabéns! Seu acesso vitalício foi ativado com sucesso!",
      codeError: "Código de ativação inválido. Tente novamente ou fale conosco no WhatsApp."
    },

    // Área dos Pais (Parent Gate)
    parentGate: {
      badge: "Área dos Pais 🔒",
      title: "Controle dos Pais & Responsáveis",
      subtitle: "Para sua segurança, confirme que você é um adulto:",
      holdInstruction: "Pressione e segure o botão por 3 segundos:",
      holdBtn: "Segure para Abrir 🔒",
      mathInstruction: "Ou resolva a conta abaixo:",
      mathSubmit: "Entrar",
      mathError: "Resposta incorreta. Tente novamente!",
      backToGameBtn: "Voltar para a Brincadeira 🧸",
      dailyUsage: "Tempo de brincadeira hoje:",
      playtimeToday: "Tempo de brincadeira hoje",
      minutes: "minutos",
      orderLabel: "Código do Pedido:",
      licenseStatus: "Status do Acesso:",
      licenseTrial: "Período Gratuito Ativo (1h)",
      licenseVip: "Vitalício Ativado 🌟",
      activitySummaryTitle: "Resumo das Atividades de Hoje",
      activityExplore: "Conhecer Bichinhos",
      activityQuiz: "Quem Faz Esse Som?",
      activityPiano: "Teclado Musical",
      activityBedtime: "Hora de Dormir",
      timesUsed: "vezes",

      settings: {
        volumeLimiter: "Limitador de Volume Seguro (dB)",
        volumeDescription: "Protege a audição sensível dos pequenos limitando o ganho máximo do som.",
        safeLevel: "✓ Nível Seguro Recomendado (OMS ≤ 85 dB)",
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
        description: "Adquira o acesso vitalício completo por apenas R$ 19,90 (pagamento único via Kiwify ou PIX). Aplicativo 100% seguro para crianças, sem anúncios e com acesso ilimitado a todos os sons disponíveis.",
        copyPix: "Copiar Código PIX (R$ 19,90)",
        copied: "Chave PIX Copiada com Sucesso!",
        enterCode: "Inserir Código de Ativação"
      },

      legal: {
        title: "Privacidade e Segurança Familiar",
        disclaimer: "Este software é um recurso recreativo e interativo de desenvolvimento sensorial para a primeira infância (2 a 6 anos). Não substitui intervenções médicas, fonoaudiológicas ou psicológicas.",
        ageNotice: "Faixa Etária Recomendada: 2 a 6 anos. Uso supervisionado por pais ou responsáveis.",
        lgpdText: "Privacidade em primeiro lugar. O SoundWorld Kids foi desenvolvido para minimizar a coleta de dados pessoais e oferecer uma experiência infantil mais segura. Consulte nossa Política de Privacidade para conhecer os detalhes.",
        termsLink: "Termos de Uso",
        privacyLink: "Política de Privacidade"
      },

      close: "Fechar"
    },

    legalModal: {
      termsTitle: "Termos de Uso - Mundo Sonoro dos Bichinhos",
      termsBody: "<p><strong>1. Finalidade Educativa e Lúdica:</strong> O SoundWorld Kids é um recurso interativo de estimulação auditiva sensorial, musical e conhecimento dos bichinhos para a primeira infância (2 a 6 anos).</p><p><strong>2. Supervisão dos Pais:</strong> O aplicativo deve ser utilizado sob supervisão carinhosa de pais, mães ou responsáveis legais.</p><p><strong>3. Isenção e Saúde:</strong> Este software não substitui diagnósticos ou orientações médicas, fonoaudiológicas ou psicológicas profissionais.</p><p><strong>4. Acesso Vitalício:</strong> O pagamento único de R$ 19,90 confere licença de uso contínua para toda a família, sem mensalidades ou renovações automáticas.</p>",
      privacyTitle: "Privacidade em Primeiro Lugar",
      privacyBody: "<p><strong>1. Privacidade em Primeiro Lugar:</strong> O SoundWorld Kids foi projetado para minimizar a coleta de dados pessoais. Não coletamos nomes de crianças, fotos, voz gravada, dados biométricos ou localização geográfica.</p><p><strong>2. O que é armazenado:</strong> Apenas preferências de uso salvas localmente no seu próprio navegador (tempo de uso diário, idioma escolhido e ativação da licença).</p><p><strong>3. Execução Segura no Dispositivo:</strong> Os sons e as falas funcionam diretamente no seu aparelho (Web Audio API e SpeechSynthesis), sem telemetria de áudio enviada a servidores.</p><p><strong>4. Zero Propagandas:</strong> Sem anúncios de terceiros, sem cookies de publicidade comportamental e sem compras acidentais dentro da área infantil.</p><p><strong>5. Contato:</strong> Para dúvidas de privacidade ou suporte: <strong>luklen2@gmail.com</strong> (Luciano Sant Anna).</p>",
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
        exploreDesc: "16 real animals with authentic sounds and spoken names",
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
        rain: "Gentle Rain",
        ocean: "Calm Ocean",
        forest: "Serene Forest",
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

    // Thematic Animal Worlds
    worlds: {
      all: "All",
      home: "Home",
      farm: "Farm",
      jungle: "Jungle",
      africa: "Africa",
      ocean: "Ocean",
      forest: "Forest",
      bugs: "Little Bugs"
    },

    // New Home & Positioning
    home: {
      badge: "SOUNDWORLD KIDS",
      title: "Animal SoundWorld",
      welcome: "Play, listen, and discover a world full of sounds.",
      slogan: "Play. Listen. Discover.",
      startPlayBtn: "START PLAYING",
      parentsAreaBtn: "PARENTS AREA"
    },

    // Progressive Quiz Levels
    quizLevels: {
      level1: "Level 1 (3 Animals)",
      level2: "Level 2 (4 Animals)",
      level3: "Level 3 (Listening Challenge)",
      starsLabel: "Stars:",
      correctPrompt: "You got it! 🎉",
      tryAgainPrompt: "Almost! Try again. 🌟"
    },

    // Mini Animal Keyboard Sequencer
    sequencer: {
      title: "Music Tape:",
      playBtn: "▶️ Play Sequence",
      clearBtn: "🗑️ Clear",
      emptyMsg: "Tap keys to record your tune!"
    },

    // How It Works (5 Steps)
    howItWorks: {
      title: "How does it work?",
      subtitle: "A simple, safe, and fun experience for children",
      step1Title: "Choose an activity",
      step1Desc: "The child can meet the animals, discover sounds, or play on the keyboard.",
      step2Title: "Explore the sounds",
      step2Desc: "Tap the animals and discover the sound and name of each one.",
      step3Title: "Play and learn",
      step3Desc: "Play games to guess the sound and find the animals.",
      step4Title: "Relax whenever you want",
      step4Desc: "Turn on night mode with gentle sounds for quiet moments.",
      step5Title: "Follow along in the Parents Area",
      step5Desc: "Caregivers can check playtime and adjust available options."
    },

    // Video Section
    videoSection: {
      title: "See how it works",
      subtitle: "20 to 30 second preview of real SoundWorld Kids features",
      placeholderBadge: "Demo Video Coming Soon",
      placeholderDesc: "Meet Animals • Sound Game • Piano • Bedtime • Parents Area • R$ 19.90"
    },

    // Made with Families in Mind (4 Cards)
    familySection: {
      title: "Made with families in mind",
      subtitle: "A simple, safe, and fun experience for children, with features that help caregivers follow along.",
      card1Title: "No ads",
      card1Desc: "An ad-free experience without interruptions during playtime.",
      card2Title: "Time control",
      card2Desc: "Caregivers can track and limit usage time.",
      card3Title: "Volume control",
      card3Desc: "Option to limit sound intensity for greater comfort.",
      card4Title: "One-time payment",
      card4Desc: "A single purchase to unlock lifetime access, with no monthly fees.",
      ethicalNotice: "SoundWorld Kids is a sensory and playful family experience. It does not replace medical advice or professional diagnosis."
    },

    // Why Families Choose SoundWorld
    whyFamiliesChoose: {
      title: "Why families choose SoundWorld?",
      subtitle: "Real features thoughtfully designed for everyday life",
      item1: "100% ad-free and safe from accidental purchases",
      item2: "Safe volume limit with 85 dB ceiling",
      item3: "Screen timer to ease bedtime routines",
      item4: "Multiple play modes and 16 real animals",
      item5: "Unlimited access to all available sounds",
      item6: "Single lifetime payment of only R$ 19.90"
    },

    // 16 Animals Names and Sounds (7 Worlds)
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
      horse: { name: "Horse", soundName: "Neigh!", article: "the" },
      dolphin: { name: "Dolphin", soundName: "Click-whistle!", article: "the" },
      whale: { name: "Whale", soundName: "Whoooosh-hum!", article: "the" },
      cricket: { name: "Cricket", soundName: "Chirp-chirp!", article: "the" },
      bee: { name: "Bee", soundName: "Bzzzz!", article: "the" }
    },

    trial: {
      badge: "1h Free: ",
      badgeExpired: "Time Expired 🔒",
      badgeUnlocked: "Access Unlocked 🌟",
      timerTrialInitial: "⏱️ Free trial: 60 min",
      timerTrialRemainingMins: "⏱️ {m} min left",
      timerTrialRemainingSecs: "⏱️ {s}s left",
      timerTrialExpired: "⏱️ Free trial ended",
      paywallTitle: "Time to continue the adventure!",
      paywallSubtitle: "Your free trial has ended. Unlock full access to keep exploring the sounds, games, and fun moments of SoundWorld Kids.",
      offerTitle: "Lifetime Access for R$ 19.90",
      unlockNowBtn: "UNLOCK NOW",
      wantToUnlockBtn: "I WANT TO UNLOCK",
      kiwifyBtn: "UNLOCK NOW",
      kiwifyBtnSub: "One-time payment • Lifetime access for the whole family",
      kiwifyBenefit1: "Unlimited access to all available sounds",
      kiwifyBenefit2: "12 animals to explore",
      kiwifyBenefit3: "Sound discovery games",
      kiwifyBenefit4: "Animal Keyboard",
      kiwifyBenefit5: "Night mode for relaxation",
      kiwifyBenefit6: "Ad-free experience",
      kiwifyBenefit7: "One-time payment",
      kiwifyBenefit8: "Lifetime access after activation",
      kiwifySecure: "🔒 100% Secure Checkout via Kiwify • Instant Access",
      kiwifyBilingualTag: "🌎 Instant activation for the whole family on any device",
      offerDetails: "Unlock lifetime access to all available features and contents. One-time payment of R$ 19.90 with no monthly fees.",
      langLabel: "App Language:",
      langSwitchBtn: "English 🇺🇸",
      offerDesc: "One-time payment of R$ 19.90. Lifetime family access with no monthly fees.",
      pixKeyLabel: "Official PIX Key (E-mail):",
      pixNameLabel: "Beneficiary: Luciano Sant Anna",
      copyPixBtn: "Copy PIX Code 📋",
      copied: "PIX Code Copied!",
      unlockCtaBtn: "I WANT TO UNLOCK",
      unlockedToast: "🎉 Congratulations! Lifetime access unlocked successfully!",
      codeError: "Invalid activation code. Please try again or reach out to us on WhatsApp."
    },

    // Parent Gate
    parentGate: {
      badge: "Parents Area 🔒",
      title: "Parents & Caregivers Controls",
      subtitle: "For safety, please confirm that you are an adult:",
      holdInstruction: "Press and hold the button for 3 seconds:",
      holdBtn: "Hold to Open 🔒",
      mathInstruction: "Or solve the sum below:",
      mathSubmit: "Enter",
      mathError: "Incorrect answer. Please try again!",
      backToGameBtn: "Back to the Game 🧸",
      dailyUsage: "Playtime today:",
      playtimeToday: "Playtime today",
      minutes: "minutes",
      orderLabel: "Order Code:",
      licenseStatus: "Access Status:",
      licenseTrial: "Free Trial Active (1h)",
      licenseVip: "Lifetime Activated 🌟",
      activitySummaryTitle: "Today's Activities Summary",
      activityExplore: "Meet Animals",
      activityQuiz: "Sound Quiz",
      activityPiano: "Animal Piano",
      activityBedtime: "Bedtime",
      timesUsed: "times",

      settings: {
        volumeLimiter: "Safe Volume Limiter (dB)",
        volumeDescription: "Protects sensitive toddler hearing by capping peak audio output.",
        safeLevel: "✓ Recommended Safe Level (WHO ≤ 85 dB)",
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
        description: "Unlock full lifetime access for just R$ 19.90 (one-time payment via Kiwify or PIX). 100% kid-safe app, zero ads, and unlimited access to all available sounds.",
        copyPix: "Copy PIX Code (R$ 19.90)",
        copied: "PIX Code Copied to Clipboard!",
        enterCode: "Enter Activation Code"
      },

      legal: {
        title: "Family Privacy and Safety",
        disclaimer: "This software is a playful sensory audio tool for early childhood (ages 2 to 6). It does not replace medical, speech therapy, or psychological care.",
        ageNotice: "Recommended Age: 2 to 6 years old. Supervised by parents or guardians.",
        lgpdText: "Privacy first. SoundWorld Kids was developed to minimize personal data collection and provide a safer experience for children. Check our Privacy Policy to learn more.",
        termsLink: "Terms of Use",
        privacyLink: "Privacy Policy"
      },

      close: "Close"
    },

    legalModal: {
      termsTitle: "Terms of Service - SoundWorld Kids",
      termsBody: "<p><strong>1. Educational & Playful Purpose:</strong> SoundWorld Kids is an interactive sensory, auditory, and musical exploration resource for toddlers and young children (ages 2 to 6).</p><p><strong>2. Parental Supervision:</strong> The app should always be enjoyed with the supervision of parents or guardians.</p><p><strong>3. Medical Disclaimer:</strong> This software is recreational and does not replace medical, speech therapy, or psychological care.</p><p><strong>4. Lifetime Access:</strong> The one-time payment of R$ 19.90 provides permanent family access without recurring subscriptions.</p>",
      privacyTitle: "Privacy First",
      privacyBody: "<p><strong>1. Privacy First:</strong> SoundWorld Kids is designed to minimize the collection of personal data. We do not collect children's names, photos, voice recordings, biometric data, or geographic location.</p><p><strong>2. What is stored:</strong> Only app preferences saved locally inside your browser (daily playtime, chosen language, and license activation).</p><p><strong>3. Safe On-Device Operation:</strong> Sounds and voices operate directly on your device (Web Audio API and SpeechSynthesis) without server audio telemetry.</p><p><strong>4. Zero Ads:</strong> No third-party advertisements, no behavioral tracking cookies, and no accidental purchases in the child area.</p><p><strong>5. Contact:</strong> For privacy inquiries or support: <strong>luklen2@gmail.com</strong> (Luciano Sant Anna).</p>",
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
