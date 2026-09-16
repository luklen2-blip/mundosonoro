// public/js/audio-engine.js - Motor Acústico dos 16 Bichinhos e Piano Musical (Web Audio API)

class AnimalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.safetyFilter = null;
    this.masterVolume = 0.70; // 70% nível seguro para crianças
    this.isInitialized = false;

    this.bedtimeNodes = {
      rain: null,
      ocean: null,
      forest: null,
      crickets: null,
      lullabyTimer: null,
      purr: null
    };
    this.bedtimeStates = {
      rain: false,
      ocean: false,
      forest: false,
      crickets: false,
      lullaby: false,
      purr: false
    };
    this.bedtimeVolumes = {
      rain: 0.22,
      ocean: 0.25,
      forest: 0.20,
      crickets: 0.08,
      lullaby: 0.18,
      purr: 0.16
    };
  }

  init() {
    if (this.isInitialized && this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Filtro protetor de agudos excessivos (corte quente a 6.500 Hz)
    this.safetyFilter = this.ctx.createBiquadFilter();
    this.safetyFilter.type = 'lowpass';
    this.safetyFilter.frequency.setValueAtTime(6500, this.ctx.currentTime);
    this.safetyFilter.Q.setValueAtTime(0.7, this.ctx.currentTime);

    // Limitador de Volume Master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

    this.safetyFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    } else if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(percent) {
    // Trava de segurança auditiva infantil da OMS: máximo 85% (85 dB)
    const clamped = Math.max(0.05, Math.min(0.85, percent));
    this.masterVolume = clamped;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.05);
    }
  }

  triggerHaptic() {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(20);
      } catch {}
    }
  }

  // Despacha o som específico do animal pelo identificador
  playAnimal(animalId) {
    this.triggerHaptic();
    this.ensureContext();
    switch (animalId) {
      case 'dog': this.playDog(); break;
      case 'cat': this.playCat(); break;
      case 'cow': this.playCow(); break;
      case 'frog': this.playFrog(); break;
      case 'duck': this.playDuck(); break;
      case 'lion': this.playLion(); break;
      case 'sheep': this.playSheep(); break;
      case 'bird': this.playBird(); break;
      case 'elephant': this.playElephant(); break;
      case 'monkey': this.playMonkey(); break;
      case 'owl': this.playOwl(); break;
      case 'horse': this.playHorse(); break;
      case 'dolphin': this.playDolphin(); break;
      case 'whale': this.playWhale(); break;
      case 'cricket': this.playCricket(); break;
      case 'bee': this.playBee(); break;
      default: this.playVictoryChime(); break;
    }
  }

  // =========================================================================
  // 1. SONS AUTÊNTICOS DOS 16 ANIMAIS (SÍNTESE NATIVA WEB AUDIO API)
  // =========================================================================

  // 1. Cachorro (Latido duplo amigável "Au-Au!")
  playDog() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const bark = (time, duration) => {
      const osc = this.ctx.createOscillator();
      const bpf = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, time);
      osc.frequency.exponentialRampToValueAtTime(130, time + duration);

      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(750, time);
      bpf.Q.setValueAtTime(3.5, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.5, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.connect(bpf);
      bpf.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + duration);
    };

    bark(now, 0.16);
    bark(now + 0.22, 0.22);
  }

  // 2. Gato (Miado doce "Mii-aa-uu!")
  playCat() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.85;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();

    // Vibrato felino a 6 Hz
    vib.frequency.setValueAtTime(6.0, now);
    vibGain.gain.setValueAtTime(8, now);
    vib.connect(osc.frequency);

    osc.type = 'sawtooth';
    // Curva melódica de miado: 380Hz -> 650Hz -> 300Hz
    osc.frequency.setValueAtTime(380, now);
    osc.frequency.linearRampToValueAtTime(640, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(300, now + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.frequency.linearRampToValueAtTime(1100, now + 0.25);
    filter.frequency.linearRampToValueAtTime(500, now + duration);
    filter.Q.setValueAtTime(4.0, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    vib.start(now);
    osc.start(now);
    vib.stop(now + duration);
    osc.stop(now + duration);
  }

  // 3. Vaca (Mugido profundo "Muuu!")
  playCow() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.1;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(95, now);
    osc1.frequency.linearRampToValueAtTime(82, now + duration);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(95.5, now);
    osc2.frequency.linearRampToValueAtTime(82.5, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(350, now);
    filter.frequency.linearRampToValueAtTime(500, now + 0.35);
    filter.frequency.linearRampToValueAtTime(250, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 4. Sapo (Coaxar ressonante "Co-ax!")
  playFrog() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const pulse = (time, dur, fStart, fEnd) => {
      const osc = this.ctx.createOscillator();
      const bpf = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(fStart, time);
      osc.frequency.exponentialRampToValueAtTime(fEnd, time + dur);

      bpf.type = 'bandpass';
      bpf.frequency.setValueAtTime(420, time);
      bpf.Q.setValueAtTime(5.5, time);

      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(0.45, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(bpf);
      bpf.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + dur);
    };

    pulse(now, 0.12, 115, 80);
    pulse(now + 0.15, 0.28, 95, 55);
  }

  // 5. Pato (Grasnado nasal engraçado "Quack-Quack!")
  playDuck() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const quack = (time) => {
      const osc = this.ctx.createOscillator();
      const bpf1 = this.ctx.createBiquadFilter();
      const bpf2 = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(280, time);
      osc.frequency.exponentialRampToValueAtTime(160, time + 0.2);

      bpf1.type = 'bandpass';
      bpf1.frequency.setValueAtTime(650, time);
      bpf1.Q.setValueAtTime(4.0, time);

      bpf2.type = 'bandpass';
      bpf2.frequency.setValueAtTime(1350, time);
      bpf2.Q.setValueAtTime(4.0, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.4, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);

      osc.connect(bpf1);
      osc.connect(bpf2);
      bpf1.connect(gain);
      bpf2.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + 0.24);
    };

    quack(now);
    quack(now + 0.22);
  }

  // 6. Leão (Rugido brincalhão e poderoso "Roaaar!")
  playLion() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.95;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(90, now + 0.3);
    osc.frequency.linearRampToValueAtTime(65, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.linearRampToValueAtTime(680, now + 0.3);
    filter.frequency.linearRampToValueAtTime(180, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 7. Ovelha (Balido com tremolo doce "Mééé!")
  playSheep() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.85;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const tremolo = this.ctx.createOscillator();
    const tremoloGain = this.ctx.createGain();
    const masterVoiceGain = this.ctx.createGain();

    // Tremolo a 15 Hz característico da ovelha
    tremolo.frequency.setValueAtTime(15, now);
    tremoloGain.gain.setValueAtTime(0.18, now);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(230, now);
    osc.frequency.linearRampToValueAtTime(200, now + duration);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(850, now);
    filter.Q.setValueAtTime(3.0, now);

    masterVoiceGain.gain.setValueAtTime(0.001, now);
    masterVoiceGain.gain.linearRampToValueAtTime(0.35, now + 0.1);
    masterVoiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    tremolo.connect(tremoloGain);
    tremoloGain.connect(masterVoiceGain.gain);

    osc.connect(filter);
    filter.connect(masterVoiceGain);
    masterVoiceGain.connect(this.safetyFilter);

    tremolo.start(now);
    osc.start(now);
    tremolo.stop(now + duration);
    osc.stop(now + duration);
  }

  // 8. Passarinho (Trinado cristalino "Piu-Piu!")
  playBird() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [1480, 1960, 2637, 2093];

    notes.forEach((freq, idx) => {
      const time = now + idx * 0.07;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.linearRampToValueAtTime(freq * 1.15, time + 0.08);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.28, time + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.09);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + 0.1);
    });
  }

  // 9. Elefante (Barrito alegre de tromba)
  playElephant() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.9;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(240, now);
    osc1.frequency.exponentialRampToValueAtTime(580, now + 0.4);
    osc1.frequency.exponentialRampToValueAtTime(320, now + duration);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(242, now);
    osc2.frequency.exponentialRampToValueAtTime(584, now + 0.4);
    osc2.frequency.exponentialRampToValueAtTime(322, now + duration);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.linearRampToValueAtTime(1800, now + 0.4);
    filter.frequency.linearRampToValueAtTime(600, now + duration);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.42, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 10. Macaco (Galgos rápidos e animados "Uh-Uh-Ah-Ah!")
  playMonkey() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const pitches = [340, 420, 520, 680];

    pitches.forEach((freq, i) => {
      const time = now + i * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, time + 0.08);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.4, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + 0.12);
    });
  }

  // 11. Coruja (Canto noturno sereno "Hoo-Hoo!")
  playOwl() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const hoot = (time, freq, dur) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();

      vib.frequency.setValueAtTime(5.5, time);
      vibGain.gain.setValueAtTime(5, time);
      vib.connect(osc.frequency);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.exponentialRampToValueAtTime(0.35, time + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      vib.start(time);
      osc.start(time);
      vib.stop(time + dur);
      osc.stop(time + dur);
    };

    hoot(now, 523.25, 0.35); // Dó5
    hoot(now + 0.38, 440.00, 0.65); // Lá4
  }

  // 12. Cavalo (Trote com relincho "Iii-hóóó!")
  playHorse() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Relincho harmônico com vibrato rápido
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();

    vib.frequency.setValueAtTime(14, now);
    vibGain.gain.setValueAtTime(25, now);
    vib.connect(osc.frequency);

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(650, now);
    osc.frequency.linearRampToValueAtTime(1150, now + 0.25);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.85);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    osc.connect(gain);
    gain.connect(this.safetyFilter);

    vib.start(now);
    osc.start(now);
    vib.stop(now + 0.85);
    osc.stop(now + 0.85);
  }

  // 13. Golfinho (Assobio marítimo alegre com cliques suaves)
  playDolphin() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1300, now);
    osc.frequency.exponentialRampToValueAtTime(2800, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(1400, now + 0.48);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.28, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.52);

    osc.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  // 14. Baleia (Canto oceânico profundo e harmônico)
  playWhale() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(135, now);
    osc.frequency.linearRampToValueAtTime(210, now + 0.55);
    osc.frequency.linearRampToValueAtTime(115, now + 1.15);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(320, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.32, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start(now);
    osc.stop(now + 1.25);
  }

  // 15. Grilo (Canto rítmico dos pequenos bichos)
  playCricket() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    [0, 0.08, 0.16, 0.28, 0.36].forEach((offset) => {
      const t = now + offset;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(4300, t);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.055);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(t);
      osc.stop(t + 0.065);
    });
  }

  // 16. Abelha (Zumbidinho fofo e suave)
  playBee() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.linearRampToValueAtTime(265, now + 0.3);
    osc.frequency.linearRampToValueAtTime(215, now + 0.65);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(620, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.26, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start(now);
    osc.stop(now + 0.72);
  }

  // =========================================================================
  // 2. TECLADO MUSICAL ANIMAL (AFINADO NA ESCALA DE DÓ MAIOR)
  // =========================================================================

  playAnimalPianoNote(animalId, freq) {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.55;

    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    // Modela a forma de onda de acordo com o bicho cantor
    if (animalId === 'cat') {
      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.5, now);
      filter.Q.setValueAtTime(3.0, now);
    } else if (animalId === 'dog') {
      osc.type = 'triangle';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 2.2, now);
    } else if (animalId === 'duck') {
      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.8, now);
      filter.Q.setValueAtTime(4.0, now);
    } else if (animalId === 'frog') {
      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(freq * 1.2, now);
    } else {
      osc.type = 'sine';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(4000, now);
    }

    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start(now);
    osc.stop(now + duration);
  }

  // =========================================================================
  // ELEMENTOS INTERATIVOS DO CENÁRIO DA FLORESTA (SOL E ÁRVORES)
  // =========================================================================

  playSunSparkle() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const freqs = [1046.50, 1318.51, 1567.98, 2093.00, 2637.02]; // C6, E6, G6, C7, E7
    freqs.forEach((f, i) => {
      const time = now + i * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.3, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.connect(gain);
      gain.connect(this.safetyFilter);
      osc.start(time);
      osc.stop(time + 0.55);
    });
  }

  playTreeRustle() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    // Farfalhar de folhas com ruído filtrado
    const bufferSize = this.ctx.sampleRate * 0.35;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const bpf = this.ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.setValueAtTime(1600, now);
    bpf.Q.setValueAtTime(2.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.safetyFilter);
    noise.start(now);

    // Adiciona pequeno gorjeio de passarinho na árvore
    setTimeout(() => {
      if (this.ctx) this.playBird();
    }, 200);
  }

  // =========================================================================
  // 3. JOGO: FANFARRA DE VITÓRIA E ENCORAJAMENTO
  // =========================================================================

  playVictoryChime() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((f, i) => {
      const time = now + i * 0.12;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.35, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + 0.65);
    });
  }

  playTryAgainChime() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const notes = [392.00, 329.63]; // Sol4 -> Mi4 acolhedor
    notes.forEach((f, i) => {
      const time = now + i * 0.16;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, time);

      gain.gain.setValueAtTime(0.25, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(time);
      osc.stop(time + 0.38);
    });
  }

  // =========================================================================
  // 4. MODO ACALANTO / HORA DE DORMIR (BEDTIME)
  // =========================================================================

  toggleBedtimeSound(type, state) {
    this.ensureContext();
    this.bedtimeStates[type] = state;

    if (type === 'rain') {
      if (state) this.startRain();
      else this.stopRain();
    } else if (type === 'ocean') {
      if (state) this.startOcean();
      else this.stopOcean();
    } else if (type === 'forest') {
      if (state) this.startForest();
      else this.stopForest();
    } else if (type === 'crickets') {
      if (state) this.startCrickets();
      else this.stopCrickets();
    } else if (type === 'lullaby') {
      if (state) this.startLullaby();
      else this.stopLullaby();
    } else if (type === 'purr') {
      if (state) this.startPurr();
      else this.stopPurr();
    }
  }

  // 1. Chuva Suave
  startRain() {
    if (this.bedtimeNodes.rain) return;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.45;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.bedtimeVolumes.rain, this.ctx.currentTime + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    noise.start();
    this.bedtimeNodes.rain = { noise, gain };
  }

  stopRain() {
    if (this.bedtimeNodes.rain) {
      const { noise, gain } = this.bedtimeNodes.rain;
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        try { noise.stop(); noise.disconnect(); } catch {}
      }, 650);
      this.bedtimeNodes.rain = null;
    }
  }

  // 2. Ondas do Oceano Lentas (com modulação LFO suave)
  startOcean() {
    if (this.bedtimeNodes.ocean) return;
    const bufferSize = this.ctx.sampleRate * 3;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = (Math.random() * 2 - 1);
      data[i] = (lastOut + (0.04 * white)) / 1.04;
      lastOut = data[i];
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(360, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    lfo.frequency.setValueAtTime(0.12, this.ctx.currentTime); // onda a cada ~8s
    lfoGain.gain.setValueAtTime(240, this.ctx.currentTime);
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.bedtimeVolumes.ocean, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    noise.start();
    lfo.start();
    this.bedtimeNodes.ocean = { noise, filter, lfo, gain };
  }

  stopOcean() {
    if (this.bedtimeNodes.ocean) {
      const { noise, lfo, gain } = this.bedtimeNodes.ocean;
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
      setTimeout(() => {
        try { noise.stop(); lfo.stop(); noise.disconnect(); lfo.disconnect(); } catch {}
      }, 850);
      this.bedtimeNodes.ocean = null;
    }
  }

  // 3. Floresta Noturna (Brisa suave entre árvores)
  startForest() {
    if (this.bedtimeNodes.forest) return;
    const bufferSize = this.ctx.sampleRate * 2.5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.28;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(750, this.ctx.currentTime);
    filter.Q.setValueAtTime(1.4, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(this.bedtimeVolumes.forest, this.ctx.currentTime + 1.2);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.safetyFilter);

    noise.start();
    this.bedtimeNodes.forest = { noise, gain };
  }

  stopForest() {
    if (this.bedtimeNodes.forest) {
      const { noise, gain } = this.bedtimeNodes.forest;
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
      setTimeout(() => {
        try { noise.stop(); noise.disconnect(); } catch {}
      }, 650);
      this.bedtimeNodes.forest = null;
    }
  }



  startCrickets() {
    if (this.bedtimeNodes.crickets) return;
    const playChirp = () => {
      if (!this.bedtimeStates.crickets) return;
      const now = this.ctx.currentTime;
      for (let i = 0; i < 3; i++) {
        const time = now + i * 0.05;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4500, time);

        gain.gain.setValueAtTime(0.001, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

        osc.connect(gain);
        gain.connect(this.safetyFilter);

        osc.start(time);
        osc.stop(time + 0.05);
      }
      const nextDelay = 800 + Math.random() * 1200;
      this.bedtimeNodes.crickets = setTimeout(playChirp, nextDelay);
    };
    playChirp();
  }

  stopCrickets() {
    if (this.bedtimeNodes.crickets) {
      clearTimeout(this.bedtimeNodes.crickets);
      this.bedtimeNodes.crickets = null;
    }
  }

  startLullaby() {
    if (this.bedtimeNodes.lullabyTimer) return;
    const notes = [523.25, 523.25, 783.99, 783.99, 880.00, 880.00, 783.99, 659.25, 659.25, 587.33, 587.33, 523.25];
    let idx = 0;

    const tick = () => {
      if (!this.bedtimeStates.lullaby) return;
      const f = notes[idx % notes.length];
      idx++;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.safetyFilter);

      osc.start(this.ctx.currentTime);
      osc.stop(this.ctx.currentTime + 1.25);

      this.bedtimeNodes.lullabyTimer = setTimeout(tick, 950);
    };
    tick();
  }

  stopLullaby() {
    if (this.bedtimeNodes.lullabyTimer) {
      clearTimeout(this.bedtimeNodes.lullabyTimer);
      this.bedtimeNodes.lullabyTimer = null;
    }
  }

  startPurr() {
    if (this.bedtimeNodes.purr) return;
    // Ronrom de gato: onda de 45Hz modulada por LFO suave
    const osc = this.ctx.createOscillator();
    const lfo = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(46, this.ctx.currentTime);

    lfo.frequency.setValueAtTime(1.8, this.ctx.currentTime); // ~1.8 Hz ritmo do ronrom
    lfoGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.16, this.ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    osc.connect(gain);
    gain.connect(this.safetyFilter);

    osc.start();
    lfo.start();
    this.bedtimeNodes.purr = { osc, lfo, gain };
  }

  stopPurr() {
    if (this.bedtimeNodes.purr) {
      const { osc, lfo } = this.bedtimeNodes.purr;
      try { osc.stop(); lfo.stop(); } catch {}
      this.bedtimeNodes.purr = null;
    }
  }

  setBedtimeVolume(type, vol) {
    if (this.bedtimeVolumes[type] !== undefined) {
      this.bedtimeVolumes[type] = Math.max(0.01, Math.min(1.0, vol));
      if (this.ctx) {
        if (type === 'rain' && this.bedtimeNodes.rain && this.bedtimeNodes.rain.gain) {
          this.bedtimeNodes.rain.gain.gain.setTargetAtTime(this.bedtimeVolumes.rain, this.ctx.currentTime, 0.05);
        } else if (type === 'ocean' && this.bedtimeNodes.ocean && this.bedtimeNodes.ocean.gain) {
          this.bedtimeNodes.ocean.gain.gain.setTargetAtTime(this.bedtimeVolumes.ocean, this.ctx.currentTime, 0.05);
        } else if (type === 'forest' && this.bedtimeNodes.forest && this.bedtimeNodes.forest.gain) {
          this.bedtimeNodes.forest.gain.gain.setTargetAtTime(this.bedtimeVolumes.forest, this.ctx.currentTime, 0.05);
        } else if (type === 'purr' && this.bedtimeNodes.purr && this.bedtimeNodes.purr.gain) {
          this.bedtimeNodes.purr.gain.gain.setTargetAtTime(this.bedtimeVolumes.purr, this.ctx.currentTime, 0.05);
        }
      }
    }
  }

  fadeAndStopBedtime(fadeDurationSec = 5) {
    if (this.ctx) {
      const now = this.ctx.currentTime;
      ['rain', 'ocean', 'forest', 'purr'].forEach((k) => {
        if (this.bedtimeNodes[k] && this.bedtimeNodes[k].gain) {
          this.bedtimeNodes[k].gain.gain.linearRampToValueAtTime(0.001, now + fadeDurationSec);
        }
      });
    }
    setTimeout(() => {
      this.stopAllBedtime();
    }, fadeDurationSec * 1000 + 100);
  }

  stopAllBedtime() {
    this.stopRain();
    this.stopOcean();
    this.stopForest();
    this.stopCrickets();
    this.stopLullaby();
    this.stopPurr();
    Object.keys(this.bedtimeStates).forEach(k => this.bedtimeStates[k] = false);
  }
}

export const animalAudio = new AnimalAudioEngine();
