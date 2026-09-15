// public/js/app.js - Controlador Interativo dos 12 Bichinhos e Modos Educativos

import { t, getLanguage, setLanguage, subscribeLanguage } from './i18n.js';
import { animalAudio } from './audio-engine.js';
import { animalSpeech } from './speech-engine.js';
import { fx } from './particles.js';
import { generatePixPayload, getPixQrCodeUrl, validateActivationCode, getWhatsAppConfirmUrl, getOrCreateOrderId } from './pix.js';

class AnimalSoundApp {
  constructor() {
    this.currentMode = 'hub'; // hub, explore, soundQuiz, findAnimal, piano, bedtime
    this.selectedSinger = 'cat'; // animal cantor no piano

    // Roster completo dos 12 bichinhos
    this.animals = [
      { id: 'dog', icon: '🐶', colorClass: 'card-border-pink' },
      { id: 'cat', icon: '🐱', colorClass: 'card-border-purple' },
      { id: 'cow', icon: '🐮', colorClass: 'card-border-green' },
      { id: 'frog', icon: '🐸', colorClass: 'card-border-green' },
      { id: 'duck', icon: '🦆', colorClass: 'card-border-yellow' },
      { id: 'lion', icon: '🦁', colorClass: 'card-border-yellow' },
      { id: 'sheep', icon: '🐑', colorClass: 'card-border-blue' },
      { id: 'bird', icon: '🐦', colorClass: 'card-border-blue' },
      { id: 'elephant', icon: '🐘', colorClass: 'card-border-purple' },
      { id: 'monkey', icon: '🐵', colorClass: 'card-border-yellow' },
      { id: 'owl', icon: '🦉', colorClass: 'card-border-blue' },
      { id: 'horse', icon: '🐴', colorClass: 'card-border-pink' }
    ];

    // Frequências das 8 notas do piano (Escala de Dó Maior C4 a C5)
    this.pianoNotes = [
      { keyId: 'c1', freq: 261.63, notePt: 'Dó', noteEn: 'C', colorClass: 'key-c' },
      { keyId: 'd', freq: 293.66, notePt: 'Ré', noteEn: 'D', colorClass: 'key-d' },
      { keyId: 'e', freq: 329.63, notePt: 'Mi', noteEn: 'E', colorClass: 'key-e' },
      { keyId: 'f', freq: 349.23, notePt: 'Fá', noteEn: 'F', colorClass: 'key-f' },
      { keyId: 'g', freq: 392.00, notePt: 'Sol', noteEn: 'G', colorClass: 'key-g' },
      { keyId: 'a', freq: 440.00, notePt: 'Lá', noteEn: 'A', colorClass: 'key-a' },
      { keyId: 'b', freq: 493.88, notePt: 'Si', noteEn: 'B', colorClass: 'key-b' },
      { keyId: 'c2', freq: 523.25, notePt: 'Dó', noteEn: 'C', colorClass: 'key-c2' }
    ];

    // Estados dos Jogos
    this.quizTarget = null;
    this.findTarget = null;

    // Parent Gate
    this.parentUnlocked = false;
    this.holdTimer = null;
    this.holdStartTime = 0;
    this.holdDuration = 3000;
    this.mathExpected = 0;

    // Rastreamento de tempo de uso diário (para os pais)
    this.dailyUsageSeconds = 0;

    // Temporizador de Sono do Bedtime
    this.bedtimeMasterPlaying = false;
    this.bedtimeTimerInterval = null;
    this.bedtimeTimerMinutes = 0;
    this.bedtimeSecondsLeft = 0;

    // Temporizador de Sono do Parent Gate
    this.sleepTimerInterval = null;
    this.sleepSecondsLeft = 0;

    // Período de Uso Gratuito de 1 Hora e Licença Vitalícia
    this.isLicensed = false;
    this.trialSecondsLeft = 3600; // 60 minutos
    this.trialTimerInterval = null;
    this.orderId = getOrCreateOrderId();
  }

  init() {
    this.bindEvents();
    this.setupLanguage();
    this.renderExploreAnimals();
    this.renderPianoKeys();
    this.initPixArea();
    this.initTrialTimer();
    this.initPaywallEvents();
    this.initDailyUsageTracker();
    this.initOrderAndLicenseDisplay();

    // Inicia no Hub de Atividades
    this.switchMode('hub');

    // Rota direta (SPA) para termos e privacidade & PWA Service Worker
    this.checkInitialRoute();
    this.registerServiceWorker();

    // Desperta o contexto de áudio no primeiro toque
    const unlockAudio = () => {
      animalAudio.init();
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });
  }

  initDailyUsageTracker() {
    const todayKey = `soundworld_usage_${new Date().toISOString().slice(0, 10)}`;
    const saved = localStorage.getItem(todayKey);
    this.dailyUsageSeconds = saved ? parseInt(saved, 10) : 0;

    setInterval(() => {
      this.dailyUsageSeconds++;
      localStorage.setItem(todayKey, this.dailyUsageSeconds.toString());
      this.updateParentUsageDisplay();
    }, 1000);
    this.updateParentUsageDisplay();
  }

  updateParentUsageDisplay() {
    const el = document.getElementById('parent-usage-display');
    if (el) {
      const mins = Math.floor(this.dailyUsageSeconds / 60);
      const minText = t('parentGate.minutes') || 'minutos';
      el.textContent = `${mins} ${minText}`;
    }
  }

  initOrderAndLicenseDisplay() {
    const orderId = this.orderId || getOrCreateOrderId();

    const parentOrderEl = document.getElementById('parent-order-display');
    if (parentOrderEl) parentOrderEl.textContent = orderId;

    const paywallOrderEl = document.getElementById('paywall-order-id-text');
    if (paywallOrderEl) paywallOrderEl.textContent = orderId;

    this.updateParentLicenseBadge();
  }

  updateParentLicenseBadge() {
    const licenseBadge = document.getElementById('parent-license-display');
    if (licenseBadge) {
      if (this.isLicensed) {
        licenseBadge.textContent = t('parentGate.licenseVip');
        licenseBadge.style.color = '#15803d';
      } else {
        licenseBadge.textContent = t('parentGate.licenseTrial');
        licenseBadge.style.color = '#1d4ed8';
      }
    }
  }

  setupLanguage() {
    subscribeLanguage(() => {
      this.updateLanguageUI();
      this.renderExploreAnimals();
      this.renderPianoKeys();
      this.updateParentUsageDisplay();
      this.updateParentLicenseBadge();
      if (this.currentMode === 'soundQuiz' && this.quizTarget) {
        animalSpeech.speakSoundQuizQuestion();
      } else if (this.currentMode === 'findAnimal' && this.findTarget) {
        animalSpeech.speakFindAnimalQuestion(this.findTarget.id);
      }
    });
    this.updateLanguageUI();
  }

  updateLanguageUI() {
    const lang = getLanguage();

    const langFlagEl = document.getElementById('lang-flag');
    const langCodeEl = document.getElementById('lang-code');
    if (langFlagEl && langCodeEl) {
      if (lang === 'pt') {
        langFlagEl.textContent = '🇧🇷';
        langCodeEl.textContent = 'PT';
      } else {
        langFlagEl.textContent = '🇺🇸';
        langCodeEl.textContent = 'EN';
      }
    }

    // Atualiza elementos com atributo data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const val = t(key);
      if (val && typeof val === 'string') {
        el.textContent = val;
      }
    });

    const langSelect = document.getElementById('parent-lang-select');
    if (langSelect) langSelect.value = lang;

    const pillPt = document.getElementById('paywall-lang-pt');
    const pillEn = document.getElementById('paywall-lang-en');
    if (pillPt && pillEn) {
      if (lang === 'pt') {
        pillPt.classList.add('active');
        pillEn.classList.remove('active');
      } else {
        pillPt.classList.remove('active');
        pillEn.classList.add('active');
      }
    }
  }

  bindEvents() {
    // Alternador Bilíngue Instantâneo
    const langBtn = document.getElementById('lang-toggle-btn');
    if (langBtn) {
      langBtn.addEventListener('click', (e) => {
        fx.createRipple(e.clientX, e.clientY, '#118AB2');
        fx.spawnFloatingElements(e.clientX, e.clientY, 3);
        const nextLang = getLanguage() === 'pt' ? 'en' : 'pt';
        setLanguage(nextLang);
      });
    }

    // Abas de Modos
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetMode = btn.getAttribute('data-mode');
        fx.createRipple(e.clientX, e.clientY);
        this.switchMode(targetMode);
      });
    });

    // Cards do Activity Hub
    document.querySelectorAll('.hub-activity-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const targetMode = card.getAttribute('data-target-mode');
        fx.createRipple(e.clientX, e.clientY);
        fx.spawnFloatingElements(e.clientX, e.clientY, 4);
        animalAudio.playSunSparkle();
        this.switchMode(targetMode);
      });
    });

    // Botões Universais de Voltar ao Hub (Início)
    document.querySelectorAll('.btn-back-hub').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        fx.createRipple(e.clientX, e.clientY);
        animalAudio.playVictoryChime();
        this.switchMode('hub');
      });
    });

    // Botão Voltar para a Brincadeira dentro do Parent Gate
    const parentBackBtn = document.getElementById('btn-parent-back-to-game');
    if (parentBackBtn) {
      parentBackBtn.addEventListener('click', () => {
        const modal = document.getElementById('parent-gate-modal');
        if (modal) {
          modal.setAttribute('hidden', '');
          modal.style.setProperty('display', 'none', 'important');
          modal.classList.remove('active');
        }
      });
    }

    // Modo Tela Cheia
    const fsBtn = document.getElementById('fullscreen-btn');
    if (fsBtn) {
      fsBtn.addEventListener('click', (e) => {
        fx.createRipple(e.clientX, e.clientY);
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }

    // Cenário Interativo da Floresta: Sol com Easter Egg de Arco-Íris
    const sunEl = document.getElementById('forest-sun');
    let sunTapCount = 0;
    let sunResetTimer = null;
    if (sunEl) {
      sunEl.addEventListener('click', (e) => {
        fx.createRipple(e.clientX, e.clientY, '#FFD166');
        fx.spawnFloatingElements(e.clientX, e.clientY, 4);
        animalAudio.playSunSparkle();
        sunEl.style.transform = 'scale(1.25) rotate(90deg)';
        setTimeout(() => sunEl.style.transform = '', 400);

        sunTapCount++;
        clearTimeout(sunResetTimer);
        if (sunTapCount >= 3) {
          sunTapCount = 0;
          animalAudio.playVictoryChime();
          fx.triggerConfetti();
        } else {
          sunResetTimer = setTimeout(() => sunTapCount = 0, 1500);
        }
      });
    }

    const treeLeft = document.getElementById('tree-left');
    const treeRight = document.getElementById('tree-right');
    [treeLeft, treeRight].forEach(tree => {
      if (tree) {
        tree.addEventListener('click', (e) => {
          fx.createRipple(e.clientX, e.clientY, '#38B000');
          fx.spawnFloatingElements(e.clientX, e.clientY, 4);
          animalAudio.playTreeRustle();
        });
      }
    });

    // Toque global para partículas lúdicas
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.modal-content') || e.target.closest('input')) return;
      fx.createRipple(e.clientX, e.clientY);
      fx.spawnFloatingElements(e.clientX, e.clientY, 2);
    });

    // Botões dos Jogos
    const quizRepeatBtn = document.getElementById('quiz-repeat-sound');
    if (quizRepeatBtn) {
      quizRepeatBtn.addEventListener('click', () => {
        if (this.quizTarget) {
          animalAudio.playAnimal(this.quizTarget.id);
          setTimeout(() => animalSpeech.speakSoundQuizQuestion(), 700);
        }
      });
    }

    const findRepeatBtn = document.getElementById('find-repeat-sound');
    if (findRepeatBtn) {
      findRepeatBtn.addEventListener('click', () => {
        if (this.findTarget) {
          animalSpeech.speakFindAnimalQuestion(this.findTarget.id);
        }
      });
    }

    // Seletores de Bichinhos Cantores no Piano
    document.querySelectorAll('.singer-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.singer-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedSinger = btn.getAttribute('data-singer');
        animalAudio.playAnimal(this.selectedSinger);
      });
    });

    // Controles do Modo Hora de Dormir
    this.bindBedtimeEvents();

    // Área dos Pais
    this.bindParentGateEvents();
  }

  // ==========================================
  // NAVEGAÇÃO ENTRE OS 5 MODOS
  // ==========================================
  switchMode(mode) {
    this.currentMode = mode;

    // Atualiza estado das abas
    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    // Controla modo noturno
    if (mode === 'bedtime') {
      document.body.classList.add('theme-night');
    } else {
      document.body.classList.remove('theme-night');
      animalAudio.stopAllBedtime();
    }

    // Oculta todas as seções e exibe a ativa
    document.querySelectorAll('.mode-section').forEach(sec => {
      sec.style.display = 'none';
    });
    const activeSec = document.getElementById(`mode-${mode}`);
    if (activeSec) activeSec.style.display = 'block';

    // Inicia jogos específicos
    if (mode === 'soundQuiz') {
      this.startNewQuizRound();
    } else if (mode === 'findAnimal') {
      this.startNewFindRound();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ==========================================
  // MODO 1: CONHECER BICHINHOS (TOQUE E OUÇA)
  // ==========================================
  renderExploreAnimals() {
    const grid = document.getElementById('explore-animals-grid');
    if (!grid) return;
    grid.innerHTML = '';

    this.animals.forEach(anim => {
      const data = t(`animals.${anim.id}`);
      const card = document.createElement('div');
      card.className = `animal-card ${anim.colorClass}`;
      card.setAttribute('data-animal-id', anim.id);

      card.innerHTML = `
        <div class="animal-avatar">${anim.icon}</div>
        <div class="animal-name">${data.name}</div>
        <div class="sound-badge">${data.soundName}</div>
      `;

      card.addEventListener('click', (e) => {
        this.onAnimalCardTapped(anim, data, card, e);
      });

      grid.appendChild(card);
    });
  }

  onAnimalCardTapped(anim, data, card, e) {
    // 1. Efeito visual e animação elástica
    card.classList.add('animating');
    setTimeout(() => card.classList.remove('animating'), 500);
    fx.spawnFloatingElements(e.clientX, e.clientY, 4);

    // 2. Banner de destaque visual
    const banner = document.getElementById('speaking-banner');
    const bannerIcon = document.getElementById('speaking-banner-icon');
    const bannerText = document.getElementById('speaking-banner-text');

    if (banner && bannerIcon && bannerText) {
      bannerIcon.textContent = anim.icon;
      bannerText.textContent = `${data.name} • "${data.soundName}"`;
      banner.classList.add('active');
    }

    // 3. Toca o som autêntico do bicho
    animalAudio.playAnimal(anim.id);

    // 4. Pronuncia claramente o nome do bicho
    setTimeout(() => {
      animalSpeech.speakAnimal(anim.id);
    }, 600);
  }

  // ==========================================
  // MODO 2: QUEM FAZ ESSE SOM? (QUIZ AUDITIVO)
  // ==========================================
  startNewQuizRound() {
    const shuffled = [...this.animals].sort(() => Math.random() - 0.5);
    this.quizTarget = shuffled[0];
    const options = [shuffled[0], shuffled[1], shuffled[2]].sort(() => Math.random() - 0.5);

    const container = document.getElementById('quiz-options-container');
    if (!container) return;
    container.innerHTML = '';

    options.forEach(opt => {
      const data = t(`animals.${opt.id}`);
      const choiceCard = document.createElement('div');
      choiceCard.className = 'quiz-choice-card';

      choiceCard.innerHTML = `
        <div class="animal-avatar">${opt.icon}</div>
        <div class="animal-name">${data.name}</div>
      `;

      choiceCard.addEventListener('click', () => {
        const promptHeader = document.querySelector('.quiz-prompt-header p');
        if (opt.id === this.quizTarget.id) {
          // ACERTOU!
          choiceCard.classList.add('correct');
          if (promptHeader) {
            promptHeader.textContent = getLanguage() === 'pt'
              ? `Isso! É o ${data.name}! ${opt.icon} 🎉`
              : `Yes! It's the ${data.name}! ${opt.icon} 🎉`;
            promptHeader.style.color = '#15803d';
          }
          animalAudio.playAnimal(opt.id);
          animalAudio.playVictoryChime();
          fx.triggerConfetti();
          animalSpeech.speakSuccessFeedback(opt.id);

          setTimeout(() => {
            if (promptHeader) {
              promptHeader.textContent = t('modes.soundQuiz.question');
              promptHeader.style.color = '';
            }
            this.startNewQuizRound();
          }, 2400);
        } else {
          // ERROU (apoio afetuoso sem punição)
          choiceCard.classList.add('wrong');
          if (promptHeader) {
            promptHeader.textContent = getLanguage() === 'pt'
              ? `Ops! Vamos tentar mais uma vez! 🌟`
              : `Oops! Let's try once more! 🌟`;
            promptHeader.style.color = '#d97706';
            setTimeout(() => {
              promptHeader.textContent = t('modes.soundQuiz.question');
              promptHeader.style.color = '';
            }, 1800);
          }
          animalAudio.playTryAgainChime();
          animalSpeech.speakTryAgain();
          setTimeout(() => choiceCard.classList.remove('wrong'), 600);
        }
      });

      container.appendChild(choiceCard);
    });

    // Toca o som do bicho misterioso e pergunta
    setTimeout(() => {
      animalAudio.playAnimal(this.quizTarget.id);
      setTimeout(() => {
        animalSpeech.speakSoundQuizQuestion();
      }, 750);
    }, 300);
  }

  // ==========================================
  // MODO 3: ONDE ESTÁ O BICHINHO? (CAÇA AO ANIMAL)
  // ==========================================
  startNewFindRound() {
    const shuffled = [...this.animals].sort(() => Math.random() - 0.5);
    this.findTarget = shuffled[0];
    // Apresenta 4 opções para a criança buscar
    const options = [shuffled[0], shuffled[1], shuffled[2], shuffled[3]].sort(() => Math.random() - 0.5);

    const container = document.getElementById('find-options-container');
    if (!container) return;
    container.innerHTML = '';

    options.forEach(opt => {
      const data = t(`animals.${opt.id}`);
      const choiceCard = document.createElement('div');
      choiceCard.className = 'quiz-choice-card';

      choiceCard.innerHTML = `
        <div class="animal-avatar">${opt.icon}</div>
        <div class="animal-name">${data.name}</div>
      `;

      choiceCard.addEventListener('click', () => {
        if (opt.id === this.findTarget.id) {
          choiceCard.classList.add('correct');
          animalAudio.playAnimal(opt.id);
          animalAudio.playVictoryChime();
          fx.triggerConfetti();
          animalSpeech.speakSuccessFeedback(opt.id);

          setTimeout(() => this.startNewFindRound(), 2600);
        } else {
          choiceCard.classList.add('wrong');
          animalAudio.playTryAgainChime();
          animalSpeech.speakTryAgain();
          setTimeout(() => choiceCard.classList.remove('wrong'), 600);
        }
      });

      container.appendChild(choiceCard);
    });

    // Pronuncia a pergunta chamando o animal
    setTimeout(() => {
      animalSpeech.speakFindAnimalQuestion(this.findTarget.id);
    }, 350);
  }

  // ==========================================
  // MODO 4: TECLADO MUSICAL DOS BICHINHOS (PIANO)
  // ==========================================
  renderPianoKeys() {
    const container = document.getElementById('piano-keys-container');
    if (!container) return;
    container.innerHTML = '';

    const lang = getLanguage();

    this.pianoNotes.forEach(item => {
      const key = document.createElement('div');
      key.className = `piano-key ${item.colorClass}`;
      const noteLabel = lang === 'pt' ? item.notePt : item.noteEn;

      key.innerHTML = `
        <div class="piano-key-note">${noteLabel}</div>
        <div class="piano-key-icon">🎵</div>
      `;

      const playKey = () => {
        key.classList.add('playing');
        animalAudio.playAnimalPianoNote(this.selectedSinger, item.freq);
        setTimeout(() => key.classList.remove('playing'), 180);
      };

      key.addEventListener('pointerdown', playKey);
      container.appendChild(key);
    });
  }

  // ==========================================
  // MODO 5: HORA DE DORMIR DOS BICHINHOS (BEDTIME)
  // ==========================================
  bindBedtimeEvents() {
    const toggles = ['rain', 'crickets', 'lullaby', 'purr'];
    toggles.forEach(type => {
      const btn = document.getElementById(`btn-bedtime-${type}`);
      if (btn) {
        btn.addEventListener('click', () => {
          const isActive = btn.classList.toggle('active');
          animalAudio.toggleBedtimeSound(type, isActive);
          this.updateBedtimeMasterState();
        });
      }
    });

    // Sliders de Volume Individuais
    document.querySelectorAll('.bedtime-vol-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        const soundType = slider.getAttribute('data-sound');
        const val = parseFloat(e.target.value);
        animalAudio.setBedtimeVolume(soundType, val);
      });
    });

    // Botão Master Play / Pause
    const masterBtn = document.getElementById('btn-bedtime-master');
    if (masterBtn) {
      masterBtn.addEventListener('click', () => {
        const isAnyPlaying = Object.values(animalAudio.bedtimeStates).some(Boolean);
        if (isAnyPlaying) {
          animalAudio.stopAllBedtime();
          toggles.forEach(type => {
            const btn = document.getElementById(`btn-bedtime-${type}`);
            if (btn) btn.classList.remove('active');
          });
          masterBtn.innerHTML = `<span>🎵</span> <span>${t('modes.bedtime.masterPlay')}</span>`;
        } else {
          animalAudio.toggleBedtimeSound('rain', true);
          animalAudio.toggleBedtimeSound('lullaby', true);
          const rBtn = document.getElementById('btn-bedtime-rain');
          const lBtn = document.getElementById('btn-bedtime-lullaby');
          if (rBtn) rBtn.classList.add('active');
          if (lBtn) lBtn.classList.add('active');
          masterBtn.innerHTML = `<span>⏸️</span> <span>${t('modes.bedtime.masterPause')}</span>`;
        }
      });
    }

    // Chips de Timer do Bedtime
    document.querySelectorAll('.timer-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.timer-chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const minutes = parseInt(chip.getAttribute('data-timer-val'), 10);
        this.setBedtimeTimer(minutes);
      });
    });
  }

  updateBedtimeMasterState() {
    const masterBtn = document.getElementById('btn-bedtime-master');
    if (!masterBtn) return;
    const isAny = Object.values(animalAudio.bedtimeStates).some(Boolean);
    if (isAny) {
      masterBtn.innerHTML = `<span>⏸️</span> <span>${t('modes.bedtime.masterPause')}</span>`;
    } else {
      masterBtn.innerHTML = `<span>🎵</span> <span>${t('modes.bedtime.masterPlay')}</span>`;
    }
  }

  setBedtimeTimer(minutes) {
    if (this.bedtimeTimerInterval) {
      clearInterval(this.bedtimeTimerInterval);
      this.bedtimeTimerInterval = null;
    }

    const countdownEl = document.getElementById('bedtime-timer-countdown');
    if (!minutes || minutes <= 0) {
      if (countdownEl) countdownEl.textContent = '';
      return;
    }

    this.bedtimeSecondsLeft = minutes * 60;
    const update = () => {
      const m = Math.floor(this.bedtimeSecondsLeft / 60);
      const s = this.bedtimeSecondsLeft % 60;
      if (countdownEl) countdownEl.textContent = `⏱️ ${m}m ${s < 10 ? '0' : ''}${s}s`;
    };
    update();

    this.bedtimeTimerInterval = setInterval(() => {
      this.bedtimeSecondsLeft--;
      update();

      if (this.bedtimeSecondsLeft <= 5) {
        animalAudio.fadeAndStopBedtime(5);
      }

      if (this.bedtimeSecondsLeft <= 0) {
        clearInterval(this.bedtimeTimerInterval);
        this.bedtimeTimerInterval = null;
        if (countdownEl) countdownEl.textContent = '💤 Boa noite!';
        ['rain', 'crickets', 'lullaby', 'purr'].forEach(type => {
          const btn = document.getElementById(`btn-bedtime-${type}`);
          if (btn) btn.classList.remove('active');
        });
        this.updateBedtimeMasterState();
      }
    }, 1000);
  }

  // ==========================================
  // ÁREA DOS PAIS (PARENT GATE)
  // ==========================================
  bindParentGateEvents() {
    const openBtn = document.getElementById('open-parent-gate');
    const modal = document.getElementById('parent-gate-modal');
    const closeBtn = document.getElementById('close-parent-gate');
    const holdBtn = document.getElementById('hold-unlock-btn');
    const holdBar = document.getElementById('hold-progress-bar');
    const mathForm = document.getElementById('math-challenge-form');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => {
        this.generateMathChallenge();
        modal.removeAttribute('hidden');
        modal.style.setProperty('display', 'flex', 'important');
        modal.classList.add('active');
      });
    }

    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => {
        modal.setAttribute('hidden', '');
        modal.style.setProperty('display', 'none', 'important');
        modal.classList.remove('active');
      });
    }

    // 1. Desbloqueio por Pressão de 3s
    if (holdBtn && holdBar) {
      const startHold = (e) => {
        e.preventDefault();
        this.holdStartTime = Date.now();
        holdBar.style.width = '0%';

        this.holdTimer = setInterval(() => {
          const elapsed = Date.now() - this.holdStartTime;
          const pct = Math.min(100, (elapsed / this.holdDuration) * 100);
          holdBar.style.width = `${pct}%`;

          if (elapsed >= this.holdDuration) {
            this.clearHold();
            this.unlockParentGate();
          }
        }, 50);
      };

      const stopHold = () => {
        this.clearHold();
        holdBar.style.width = '0%';
      };

      holdBtn.addEventListener('pointerdown', startHold);
      holdBtn.addEventListener('pointerup', stopHold);
      holdBtn.addEventListener('pointerleave', stopHold);
      holdBtn.addEventListener('pointercancel', stopHold);
    }

    // 2. Desafio Matemático
    if (mathForm) {
      mathForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('math-answer-input');
        const val = parseInt(input.value, 10);
        if (val === this.mathExpected) {
          this.unlockParentGate();
        } else {
          alert(t('parentGate.mathError'));
          input.value = '';
          this.generateMathChallenge();
        }
      });
    }

    // Limitador de Volume Seguro
    const volSlider = document.getElementById('parent-volume-slider');
    const volDisplay = document.getElementById('parent-volume-display');
    if (volSlider && volDisplay) {
      volSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        volDisplay.textContent = `${Math.round(val * 100)}%`;
        animalAudio.setMasterVolume(val);
      });
    }

    // Seletor de Idioma
    const langSelect = document.getElementById('parent-lang-select');
    if (langSelect) {
      langSelect.addEventListener('change', (e) => {
        setLanguage(e.target.value);
      });
    }

    // Temporizador de Tela
    const timerSelect = document.getElementById('parent-timer-select');
    if (timerSelect) {
      timerSelect.addEventListener('change', (e) => {
        this.setScreenTimer(parseInt(e.target.value, 10));
      });
    }

    // Modais Legais
    this.bindLegalLinks();
  }

  generateMathChallenge() {
    const a = Math.floor(Math.random() * 5) + 3;
    const b = Math.floor(Math.random() * 4) + 2;
    this.mathExpected = a + b;
    const promptEl = document.getElementById('math-prompt');
    if (promptEl) promptEl.textContent = `${a} + ${b} = ?`;
  }

  clearHold() {
    if (this.holdTimer) {
      clearInterval(this.holdTimer);
      this.holdTimer = null;
    }
  }

  unlockParentGate() {
    this.parentUnlocked = true;
    const lockedArea = document.getElementById('parent-locked-area');
    const unlockedArea = document.getElementById('parent-unlocked-area');
    if (lockedArea) lockedArea.style.display = 'none';
    if (unlockedArea) unlockedArea.style.display = 'block';
  }

  setScreenTimer(minutes) {
    if (this.sleepTimerInterval) {
      clearInterval(this.sleepTimerInterval);
      this.sleepTimerInterval = null;
    }

    const statusEl = document.getElementById('timer-status');
    if (!minutes || minutes <= 0) {
      if (statusEl) statusEl.textContent = '';
      return;
    }

    this.sleepSecondsLeft = minutes * 60;
    const update = () => {
      const m = Math.floor(this.sleepSecondsLeft / 60);
      const s = this.sleepSecondsLeft % 60;
      if (statusEl) statusEl.textContent = `${t('parentGate.settings.timerActive')} ${m}m ${s < 10 ? '0' : ''}${s}s`;
    };
    update();

    this.sleepTimerInterval = setInterval(() => {
      this.sleepSecondsLeft--;
      update();

      if (this.sleepSecondsLeft <= 0) {
        clearInterval(this.sleepTimerInterval);
        this.sleepTimerInterval = null;
        if (statusEl) statusEl.textContent = '';
        this.switchMode('bedtime');
        animalAudio.toggleBedtimeSound('lullaby', true);
        const btn = document.getElementById('btn-bedtime-lullaby');
        if (btn) btn.classList.add('active');
        alert(getLanguage() === 'pt' ? '🌙 Hora de descansar e dormir com os bichinhos!' : '🌙 Time to relax and sleep with the animals!');
      }
    }, 1000);
  }

  initPixArea() {
    const payload = generatePixPayload();
    const qrUrl = getPixQrCodeUrl(payload);

    const qrImg = document.getElementById('pix-qr-image');
    if (qrImg) qrImg.src = qrUrl;

    const copyBtn = document.getElementById('pix-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(payload).then(() => {
          const original = copyBtn.textContent;
          copyBtn.textContent = t('parentGate.patronage.copied');
          setTimeout(() => copyBtn.textContent = original, 3000);
        }).catch(() => {
          prompt('Chave PIX Copia-e-Cola:', payload);
        });
      });
    }
  }

  bindLegalLinks() {
    const termsLink = document.getElementById('link-terms');
    const privLink = document.getElementById('link-privacy');
    const legalModal = document.getElementById('legal-modal');
    const legalTitle = document.getElementById('legal-modal-title');
    const legalBody = document.getElementById('legal-modal-body');
    const legalClose = document.getElementById('legal-modal-close');

    if (termsLink && legalModal) {
      termsLink.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        legalTitle.textContent = t('legalModal.termsTitle');
        legalBody.innerHTML = t('legalModal.termsBody');
        legalModal.removeAttribute('hidden');
        legalModal.style.setProperty('display', 'flex', 'important');
        legalModal.classList.add('active');
      });
    }

    if (privLink && legalModal) {
      privLink.addEventListener('click', (e) => {
        if (e && e.preventDefault) e.preventDefault();
        legalTitle.textContent = t('legalModal.privacyTitle');
        legalBody.innerHTML = t('legalModal.privacyBody');
        legalModal.removeAttribute('hidden');
        legalModal.style.setProperty('display', 'flex', 'important');
        legalModal.classList.add('active');
      });
    }

    if (legalClose && legalModal) {
      legalClose.addEventListener('click', () => {
        legalModal.setAttribute('hidden', '');
        legalModal.style.setProperty('display', 'none', 'important');
        legalModal.classList.remove('active');
      });
    }
  }

  checkInitialRoute() {
    try {
      const path = (window.location.pathname || '').toLowerCase();
      if (path === '/termos' || path.endsWith('/termos')) {
        setTimeout(() => {
          const termsLink = document.getElementById('link-terms');
          if (termsLink) termsLink.click();
        }, 200);
      } else if (path === '/privacidade' || path.endsWith('/privacidade')) {
        setTimeout(() => {
          const privLink = document.getElementById('link-privacy');
          if (privLink) privLink.click();
        }, 200);
      }
    } catch {}
  }

  registerServiceWorker() {
    if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch(() => {});
      });
    }
  }

  // =========================================================================
  // GESTÃO DO PERÍODO DE USO GRATUITO (1 HORA) E CHECKOUT PIX
  // =========================================================================

  initTrialTimer() {
    this.isLicensed = localStorage.getItem('soundworld_licensed') === 'true';

    const now = Date.now();
    let startTime = localStorage.getItem('soundworld_trial_start_time');
    if (!startTime) {
      startTime = now.toString();
      localStorage.setItem('soundworld_trial_start_time', startTime);
    }

    const savedSeconds = localStorage.getItem('soundworld_trial_seconds_left');
    if (savedSeconds !== null) {
      this.trialSecondsLeft = parseInt(savedSeconds, 10);
    } else {
      this.trialSecondsLeft = 3600; // 60 minutos
      localStorage.setItem('soundworld_trial_seconds_left', this.trialSecondsLeft.toString());
    }

    // Validação cruzada de integridade do tempo decorrido
    const elapsedSecs = Math.floor((now - parseInt(startTime, 10)) / 1000);
    if (elapsedSecs > 3600) {
      this.trialSecondsLeft = 0;
      localStorage.setItem('soundworld_trial_seconds_left', '0');
    } else if (3600 - elapsedSecs < this.trialSecondsLeft) {
      this.trialSecondsLeft = Math.max(0, 3600 - elapsedSecs);
    }

    this.updateTrialDisplay();

    if (this.isLicensed) return;

    if (this.trialSecondsLeft <= 0) {
      setTimeout(() => this.showPaywall(), 500);
      return;
    }

    // Intervalo de 1 segundo
    this.trialTimerInterval = setInterval(() => {
      if (this.isLicensed) {
        clearInterval(this.trialTimerInterval);
        return;
      }

      this.trialSecondsLeft--;
      localStorage.setItem('soundworld_trial_seconds_left', this.trialSecondsLeft.toString());
      this.updateTrialDisplay();

      if (this.trialSecondsLeft <= 0) {
        clearInterval(this.trialTimerInterval);
        this.showPaywall();
      }
    }, 1000);
  }

  updateTrialDisplay() {
    const badge = document.getElementById('trial-timer-badge');
    const text = document.getElementById('trial-timer-text');
    if (!badge || !text) return;

    if (this.isLicensed) {
      badge.className = 'trial-timer-badge licensed';
      badge.innerHTML = `<span>🌟</span> <span>${t('trial.badgeUnlocked')}</span>`;
      return;
    }

    if (this.trialSecondsLeft <= 0) {
      badge.className = 'trial-timer-badge warning';
      badge.innerHTML = `<span>🔒</span> <span>${t('trial.badgeExpired')}</span>`;
      return;
    }

    const mins = Math.floor(this.trialSecondsLeft / 60);
    const secs = this.trialSecondsLeft % 60;
    const formatted = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

    badge.className = this.trialSecondsLeft <= 300 ? 'trial-timer-badge warning' : 'trial-timer-badge';
    badge.innerHTML = `<span>⏱️</span> <span>${formatted}</span>`;
  }

  showPaywall() {
    const modal = document.getElementById('paywall-modal');
    if (modal) {
      modal.removeAttribute('hidden');
      modal.style.setProperty('display', 'flex', 'important');
      modal.classList.add('active');
    }
  }

  hidePaywall() {
    const modal = document.getElementById('paywall-modal');
    if (modal) {
      modal.setAttribute('hidden', '');
      modal.style.setProperty('display', 'none', 'important');
      modal.classList.remove('active');
    }
  }

  initPaywallEvents() {
    const badge = document.getElementById('trial-timer-badge');
    if (badge) {
      badge.addEventListener('click', () => {
        if (!this.isLicensed) {
          this.showPaywall();
        }
      });
    }

    // Alternador de Idioma no próprio Paywall (Pills Bilíngues)
    const pillPt = document.getElementById('paywall-lang-pt');
    const pillEn = document.getElementById('paywall-lang-en');
    if (pillPt) {
      pillPt.addEventListener('click', () => {
        setLanguage('pt');
        animalAudio.playButtonClick();
      });
    }
    if (pillEn) {
      pillEn.addEventListener('click', () => {
        setLanguage('en');
        animalAudio.playButtonClick();
      });
    }

    // Botão de Checkout Kiwify no Paywall
    const kiwifyBtn = document.getElementById('paywall-kiwify-checkout-btn');
    if (kiwifyBtn) {
      kiwifyBtn.addEventListener('click', () => {
        animalAudio.playSuccessFanfare();
      });
    }

    // Botão na área dos pais para inserir código a qualquer momento
    const parentCodeBtn = document.getElementById('parent-enter-code-btn');
    if (parentCodeBtn) {
      parentCodeBtn.addEventListener('click', () => {
        const code = prompt('🔑 Digite seu Código de Ativação VIP do SoundWorld:');
        if (code && validateActivationCode(code)) {
          this.unlockLifetimeAccess(code.trim().toUpperCase());
          alert(t('trial.unlockedToast') || '🎉 Parabéns! Acesso vitalício liberado com sucesso!');
        } else if (code) {
          alert(t('trial.codeError') || 'Código inválido. Envie o comprovante no WhatsApp.');
        }
      });
    }
  }

  unlockLifetimeAccess(code = 'VIP') {
    this.isLicensed = true;
    localStorage.setItem('soundworld_licensed', 'true');
    localStorage.setItem('soundworld_license_code', code);
    setTimeout(() => this.hidePaywall(), 1200);
    this.updateTrialDisplay();

    animalAudio.playVictoryChime();
    fx.triggerConfetti();
  }
}

function startApp() {
  const app = new AnimalSoundApp();
  app.init();
  window.__soundWorldApp = app;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp);
} else {
  startApp();
}
