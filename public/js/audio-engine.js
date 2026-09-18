// public/js/audio-engine.js - Motor Acústico dos 16 Bichinhos e Piano Musical (Web Audio API)

class AnimalAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.compressor = null;
    this.safetyFilter = null;
    this.masterVolume = 0.95; // 95% nível forte, nítido e equilibrado
    this.isInitialized = false;
    this._cachedNoise = null;

    // Cache de áudio nativo decodificado em memória (0ms de latência)
    this.animalBuffers = new Map();
    this.animalLoading = new Map();

    // Mapeamento dos arquivos de áudio gravados naturais de alta fidelidade
    this.animalSoundFiles = {
      dog: '/audio/animals/dog.mp3',
      cat: '/audio/animals/cat.mp3',
      cow: '/audio/animals/cow.mp3',
      horse: '/audio/animals/horse.mp3',
      sheep: '/audio/animals/sheep.mp3',
      duck: '/audio/animals/duck.mp3',
      lion: '/audio/animals/lion.mp3',
      monkey: '/audio/animals/monkey.mp3',
      elephant: '/audio/animals/elephant.mp3',
      dolphin: '/audio/animals/dolphin.mp3',
      whale: '/audio/animals/whale.mp3',
      owl: '/audio/animals/owl.mp3',
      bird: '/audio/animals/bird.mp3',
      frog: '/audio/animals/frog.mp3',
      cricket: '/audio/animals/cricket.mp3',
      bee: '/audio/animals/bee.mp3'
    };

    // Normalização calibrada de ganho (volume percebido uniforme entre os 16 bichinhos)
    this.animalGains = {
      dog: 1.15,
      cat: 1.10,
      cow: 1.05,
      horse: 1.05,
      sheep: 1.10,
      duck: 1.05,
      lion: 1.00,
      monkey: 1.05,
      elephant: 1.05,
      dolphin: 1.10,
      whale: 1.25,
      owl: 1.15,
      bird: 1.00,
      frog: 1.10,
      cricket: 0.95,
      bee: 1.10
    };

    // Duração acústica natural (em segundos) de cada animal
    this.animalDurations = {
      dog: 0.70,
      cat: 2.10,
      cow: 1.50,
      horse: 1.70,
      sheep: 1.40,
      duck: 1.40,
      lion: 2.30,
      monkey: 2.70,
      elephant: 1.50,
      dolphin: 2.50,
      whale: 3.20,
      owl: 2.30,
      bird: 2.10,
      frog: 1.00,
      cricket: 1.60,
      bee: 2.30
    };

    // Limite máximo de duração para áudios longos na experiência infantil
    this.maxDurations = {
      whale: 3.5
    };

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

    // Compressor dinâmico de estúdio: eleva detalhes baixos e impede saturação
    this.compressor = this.ctx.createDynamicsCompressor();
    this.compressor.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.compressor.knee.setValueAtTime(6, this.ctx.currentTime);
    this.compressor.ratio.setValueAtTime(3.5, this.ctx.currentTime);
    this.compressor.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.compressor.release.setValueAtTime(0.15, this.ctx.currentTime);

    // Filtro acústico de agudos naturais (corte suave a 8.500 Hz)
    this.safetyFilter = this.ctx.createBiquadFilter();
    this.safetyFilter.type = 'lowpass';
    this.safetyFilter.frequency.setValueAtTime(8500, this.ctx.currentTime);
    this.safetyFilter.Q.setValueAtTime(0.5, this.ctx.currentTime);

    // Limitador e controle de volume master
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);

    // Cadeia de áudio master: compressor -> safetyFilter -> masterGain -> destination
    this.compressor.connect(this.safetyFilter);
    this.safetyFilter.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.isInitialized = true;

    // Pré-carrega de forma assíncrona os áudios gravados dos 16 animais em memória
    this.preloadAnimalSounds();
  }

  // Pré-carregamento concorrente com decodificação no Web Audio API
  async preloadAnimalSounds() {
    if (!this.ctx) return;
    const entries = Object.entries(this.animalSoundFiles);
    for (const [id] of entries) {
      if (!this.animalBuffers.has(id)) {
        this.loadAnimalBuffer(id).catch(() => {});
      }
    }
  }

  async loadAnimalBuffer(animalId) {
    if (this.animalBuffers.has(animalId)) {
      return this.animalBuffers.get(animalId);
    }
    if (this.animalLoading.has(animalId)) {
      return this.animalLoading.get(animalId);
    }

    const url = this.animalSoundFiles[animalId];
    if (!url) return null;

    const promise = (async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const arrayBuf = await response.arrayBuffer();
        this.ensureContext();
        const audioBuffer = await new Promise((resolve, reject) => {
          this.ctx.decodeAudioData(arrayBuf, resolve, reject);
        });
        this.animalBuffers.set(animalId, audioBuffer);
        return audioBuffer;
      } catch (err) {
        console.warn(`[AnimalAudioEngine] Falha ao carregar áudio de ${animalId}:`, err);
        return null;
      } finally {
        this.animalLoading.delete(animalId);
      }
    })();

    this.animalLoading.set(animalId, promise);
    return promise;
  }

  getAnimalDuration(animalId) {
    const buf = this.animalBuffers.get(animalId);
    if (buf && buf.duration) {
      const maxDur = this.maxDurations[animalId];
      return maxDur ? Math.min(buf.duration, maxDur) : buf.duration;
    }
    return this.animalDurations[animalId] || 2.0;
  }

  // Reproduz o áudio natural característico gravado do animal
  playAnimalSoundFile(animalId, playbackRate = 1.0) {
    this.ensureContext();
    const buffer = this.animalBuffers.get(animalId);

    if (buffer && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        if (playbackRate !== 1.0) {
          source.playbackRate.setValueAtTime(playbackRate, now);
        }

        const gainNode = this.ctx.createGain();
        const targetGain = (this.animalGains[animalId] || 1.0);
        const maxDur = this.maxDurations[animalId];
        const rawDur = buffer.duration / (playbackRate || 1.0);
        const playDur = maxDur ? Math.min(rawDur, maxDur) : rawDur;

        gainNode.gain.setValueAtTime(targetGain, now);
        if (maxDur && rawDur > maxDur) {
          // Fade suave nos últimos 0.6s se for som longo (ex: baleia)
          gainNode.gain.setValueAtTime(targetGain, now + playDur - 0.6);
          gainNode.gain.linearRampToValueAtTime(0.001, now + playDur);
        }

        source.connect(gainNode);
        gainNode.connect(this.outputNode);

        source.start(now);
        source.stop(now + playDur);
        return true;
      } catch (e) {
        console.warn(`[AnimalAudioEngine] Erro ao tocar buffer ${animalId}:`, e);
      }
    }

    // Se o buffer ainda não decodificou, dispara carregamento e toca via HTML5 Audio
    const url = this.animalSoundFiles[animalId];
    if (url) {
      this.loadAnimalBuffer(animalId);
      try {
        const audio = new Audio(url);
        audio.volume = Math.min(1.0, this.masterVolume * (this.animalGains[animalId] || 1.0));
        audio.play().catch(() => {});
        return true;
      } catch {}
    }

    // Fallback de contingência caso rede esteja inativa e sem cache
    this.synthesizeAnimal(animalId);
    return false;
  }

  get outputNode() {
    return this.compressor || this.safetyFilter || (this.ctx && this.ctx.destination);
  }

  getNoiseBuffer(duration = 1.0) {
    if (!this.ctx) return null;
    if (this._cachedNoise && this._cachedNoise.duration >= duration) {
      return this._cachedNoise;
    }
    const size = Math.floor(this.ctx.sampleRate * Math.max(1.0, duration));
    const buffer = this.ctx.createBuffer(1, size, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < size; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    this._cachedNoise = buffer;
    return buffer;
  }

  ensureContext() {
    if (!this.isInitialized) {
      this.init();
    } else if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMasterVolume(percent) {
    // Permite ajuste amplo e nítido até 100%
    const clamped = Math.max(0.05, Math.min(1.0, percent));
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
    return this.playAnimalSoundFile(animalId);
  }

  // Atalhos individuais para os 16 bichinhos (reproduzem gravação natural autêntica)
  playDog() { return this.playAnimal('dog'); }
  playCat() { return this.playAnimal('cat'); }
  playCow() { return this.playAnimal('cow'); }
  playHorse() { return this.playAnimal('horse'); }
  playSheep() { return this.playAnimal('sheep'); }
  playDuck() { return this.playAnimal('duck'); }
  playLion() { return this.playAnimal('lion'); }
  playMonkey() { return this.playAnimal('monkey'); }
  playElephant() { return this.playAnimal('elephant'); }
  playDolphin() { return this.playAnimal('dolphin'); }
  playWhale() { return this.playAnimal('whale'); }
  playOwl() { return this.playAnimal('owl'); }
  playBird() { return this.playAnimal('bird'); }
  playFrog() { return this.playAnimal('frog'); }
  playCricket() { return this.playAnimal('cricket'); }
  playBee() { return this.playAnimal('bee'); }

  // Fallback de contingência por síntese nativa Web Audio API
  synthesizeAnimal(animalId) {
    const synthMap = {
      dog: () => this.synthesizeDog(),
      cat: () => this.synthesizeCat(),
      cow: () => this.synthesizeCow(),
      horse: () => this.synthesizeHorse(),
      sheep: () => this.synthesizeSheep(),
      duck: () => this.synthesizeDuck(),
      lion: () => this.synthesizeLion(),
      monkey: () => this.synthesizeMonkey(),
      elephant: () => this.synthesizeElephant(),
      dolphin: () => this.synthesizeDolphin(),
      whale: () => this.synthesizeWhale(),
      owl: () => this.synthesizeOwl(),
      bird: () => this.synthesizeBird(),
      frog: () => this.synthesizeFrog(),
      cricket: () => this.synthesizeCricket(),
      bee: () => this.synthesizeBee()
    };
    if (synthMap[animalId]) {
      synthMap[animalId]();
    }
  }

  // =========================================================================
  // SÍNTESE ACÚSTICA DE CONTINGÊNCIA (FALLBACK CASO DISPOSITIVO ESTEJA SEM BUFFER)
  // =========================================================================
  // 1. Cachorro (Latido duplo encorpado)
  synthesizeDog() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const singleBark = (startTime, duration, basePitch, chestFreq) => {
      // 1. Cordas vocais com pitch envelope rápido
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(basePitch, startTime);
      osc.frequency.exponentialRampToValueAtTime(basePitch * 0.42, startTime + duration);

      // Formante 1: Cavidade faríngea (corpo do latido)
      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(480, startTime);
      f1.frequency.linearRampToValueAtTime(360, startTime + duration);
      f1.Q.setValueAtTime(3.2, startTime);

      // Formante 2: Cavidade oral/focinho
      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1180, startTime);
      f2.frequency.linearRampToValueAtTime(850, startTime + duration);
      f2.Q.setValueAtTime(3.8, startTime);

      // Ganho vocal
      const vocalGain = this.ctx.createGain();
      vocalGain.gain.setValueAtTime(0.001, startTime);
      vocalGain.gain.linearRampToValueAtTime(0.85, startTime + 0.025);
      vocalGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(f1);
      osc.connect(f2);
      f1.connect(vocalGain);
      f2.connect(vocalGain);
      vocalGain.connect(this.outputNode);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.02);

      // 2. Thump torácico profundo (peso acústico do peito do cão)
      const chestOsc = this.ctx.createOscillator();
      const chestGain = this.ctx.createGain();
      chestOsc.type = 'sine';
      chestOsc.frequency.setValueAtTime(chestFreq, startTime);
      chestOsc.frequency.exponentialRampToValueAtTime(chestFreq * 0.55, startTime + 0.09);

      chestGain.gain.setValueAtTime(0.001, startTime);
      chestGain.gain.linearRampToValueAtTime(0.70, startTime + 0.015);
      chestGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.09);

      chestOsc.connect(chestGain);
      chestGain.connect(this.outputNode);
      chestOsc.start(startTime);
      chestOsc.stop(startTime + 0.10);

      // 3. Ruído de sopro/ar no ataque do latido (explosão de ar na boca)
      const noiseBuf = this.getNoiseBuffer(0.08);
      if (noiseBuf) {
        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuf;
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'bandpass';
        noiseFilter.frequency.setValueAtTime(1300, startTime);
        noiseFilter.Q.setValueAtTime(1.8, startTime);

        const noiseGain = this.ctx.createGain();
        noiseGain.gain.setValueAtTime(0.35, startTime);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.05);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.outputNode);
        noiseSrc.start(startTime);
        noiseSrc.stop(startTime + 0.06);
      }
    };

    // Latido 1 (Au!) e Latido 2 (Au! mais firme e presente)
    singleBark(now, 0.18, 420, 135);
    singleBark(now + 0.22, 0.24, 380, 120);
  }

  // 2. Gato (Miado felino sintetizado)
  synthesizeCat() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.95;

    // Vibrato natural da laringe felina (5.5 Hz)
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();
    vib.frequency.setValueAtTime(5.5, now);
    vibGain.gain.setValueAtTime(16, now);
    vib.start(now);
    vib.stop(now + duration);

    // Cordas vocais: Sawtooth rica em harmônicos
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';

    // Curva de pitch autêntica: "Mii" (390Hz) -> "Aaa" (640Hz) -> "Uuu" (280Hz)
    osc.frequency.setValueAtTime(390, now);
    osc.frequency.linearRampToValueAtTime(640, now + 0.32);
    osc.frequency.exponentialRampToValueAtTime(280, now + duration);

    vib.connect(osc.frequency);

    // Trato vocal duplo com formantes móveis (F1 e F2)
    // F1: transição de vogal fechada para aberta e fecha em "u"
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(450, now);
    f1.frequency.linearRampToValueAtTime(880, now + 0.32);
    f1.frequency.linearRampToValueAtTime(380, now + duration);
    f1.Q.setValueAtTime(3.5, now);

    // F2: formante agudo da boca felina
    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1600, now);
    f2.frequency.linearRampToValueAtTime(1950, now + 0.32);
    f2.frequency.linearRampToValueAtTime(850, now + duration);
    f2.Q.setValueAtTime(4.2, now);

    // Envelope dinâmico de volume com ataque suave e corpo cheio
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.80, now + 0.18);
    gain.gain.setValueAtTime(0.80, now + 0.40);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(gain);
    f2.connect(gain);
    gain.connect(this.outputNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 3. Vaca (Mugido sintetizado)
  synthesizeCow() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.35;

    // Cordas vocais duplas com leve desafinação para espessura acústica
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'triangle';

    // Curva de entonação: sobe levemente no "Muu" e desce no repouso
    osc1.frequency.setValueAtTime(112, now);
    osc1.frequency.linearRampToValueAtTime(124, now + 0.35);
    osc1.frequency.exponentialRampToValueAtTime(86, now + duration);

    osc2.frequency.setValueAtTime(114, now);
    osc2.frequency.linearRampToValueAtTime(126, now + 0.35);
    osc2.frequency.exponentialRampToValueAtTime(88, now + duration);

    // Tremor de garganta / vocal fry bovino a 24 Hz
    const fryOsc = this.ctx.createOscillator();
    const fryGain = this.ctx.createGain();
    fryOsc.frequency.setValueAtTime(24, now);
    fryGain.gain.setValueAtTime(0.25, now);
    fryOsc.start(now);
    fryOsc.stop(now + duration);

    // Filtro formante da bocarra da vaca (ressonância do mugido)
    const mouthFilter = this.ctx.createBiquadFilter();
    mouthFilter.type = 'lowpass';
    mouthFilter.frequency.setValueAtTime(320, now);
    mouthFilter.frequency.linearRampToValueAtTime(580, now + 0.4);
    mouthFilter.frequency.linearRampToValueAtTime(260, now + duration);
    mouthFilter.Q.setValueAtTime(3.0, now);

    // Filtro peaking para ressonância peitoral quente
    const chestFilter = this.ctx.createBiquadFilter();
    chestFilter.type = 'peaking';
    chestFilter.frequency.setValueAtTime(180, now);
    chestFilter.gain.setValueAtTime(6.0, now);
    chestFilter.Q.setValueAtTime(2.0, now);

    // Envelope de ganho com modulação de garganta
    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.linearRampToValueAtTime(0.82, now + 0.20);
    voiceGain.gain.setValueAtTime(0.80, now + 0.70);
    voiceGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    fryOsc.connect(fryGain);
    fryGain.connect(voiceGain.gain);

    osc1.connect(mouthFilter);
    osc2.connect(mouthFilter);
    mouthFilter.connect(chestFilter);
    chestFilter.connect(voiceGain);
    voiceGain.connect(this.outputNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 4. Sapo (Coaxar sintetizado)
  synthesizeFrog() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const croak = (startTime, duration, fStart, fEnd, rate) => {
      // Oscilador portador
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(fStart, startTime);
      osc.frequency.exponentialRampToValueAtTime(fEnd, startTime + duration);

      // Modulador AM rápido do saco vocal (sintetiza os pulsos característicos do coaxar)
      const sacMod = this.ctx.createOscillator();
      const sacModGain = this.ctx.createGain();
      sacMod.type = 'square';
      sacMod.frequency.setValueAtTime(rate, startTime);
      sacModGain.gain.setValueAtTime(0.5, startTime);

      const ampGain = this.ctx.createGain();
      ampGain.gain.setValueAtTime(0.5, startTime);
      sacMod.connect(sacModGain);
      sacModGain.connect(ampGain.gain);

      // Formantes do papo do sapo (ressonância oca e nasal)
      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(460, startTime);
      f1.Q.setValueAtTime(4.5, startTime);

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1150, startTime);
      f2.Q.setValueAtTime(3.5, startTime);

      // Envelope principal
      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, startTime);
      mainGain.gain.linearRampToValueAtTime(0.85, startTime + 0.025);
      mainGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(ampGain);
      ampGain.connect(f1);
      ampGain.connect(f2);
      f1.connect(mainGain);
      f2.connect(mainGain);
      mainGain.connect(this.outputNode);

      sacMod.start(startTime);
      osc.start(startTime);
      sacMod.stop(startTime + duration);
      osc.stop(startTime + duration);
    };

    // Coaxar duplo de lagoa
    croak(now, 0.20, 145, 95, 38);
    croak(now + 0.26, 0.32, 125, 78, 34);
  }

  // 5. Pato (Grasnado sintetizado)
  synthesizeDuck() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const quack = (startTime, duration, fStart, fEnd) => {
      // Oscilador rico em harmônicos ímpares e pares
      const osc = this.ctx.createOscillator();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(fStart, startTime);
      osc.frequency.exponentialRampToValueAtTime(fEnd, startTime + duration);

      // Modulador de palheta da siringe do pato (raspagem nasal a 78 Hz)
      const reedMod = this.ctx.createOscillator();
      const reedGain = this.ctx.createGain();
      reedMod.frequency.setValueAtTime(78, startTime);
      reedGain.gain.setValueAtTime(0.40, startTime);

      const amNode = this.ctx.createGain();
      amNode.gain.setValueAtTime(0.60, startTime);
      reedMod.connect(reedGain);
      reedGain.connect(amNode.gain);

      // Formantes nasais de bico de pato (F1 ~720Hz, F2 ~1550Hz, F3 ~2400Hz)
      const f1 = this.ctx.createBiquadFilter();
      f1.type = 'bandpass';
      f1.frequency.setValueAtTime(720, startTime);
      f1.Q.setValueAtTime(3.8, startTime);

      const f2 = this.ctx.createBiquadFilter();
      f2.type = 'bandpass';
      f2.frequency.setValueAtTime(1550, startTime);
      f2.Q.setValueAtTime(4.2, startTime);

      const f3 = this.ctx.createBiquadFilter();
      f3.type = 'bandpass';
      f3.frequency.setValueAtTime(2400, startTime);
      f3.Q.setValueAtTime(3.0, startTime);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(0.001, startTime);
      mainGain.gain.linearRampToValueAtTime(0.85, startTime + 0.02);
      mainGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(amNode);
      amNode.connect(f1);
      amNode.connect(f2);
      amNode.connect(f3);
      f1.connect(mainGain);
      f2.connect(mainGain);
      f3.connect(mainGain);
      mainGain.connect(this.outputNode);

      reedMod.start(startTime);
      osc.start(startTime);
      reedMod.stop(startTime + duration);
      osc.stop(startTime + duration);
    };

    quack(now, 0.20, 290, 180);
    quack(now + 0.24, 0.24, 270, 160);
  }

  // 6. Leão (Rugido sintetizado)
  synthesizeLion() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.35;

    // Cordas vocais graves detunadas para massa sonora
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    osc1.frequency.setValueAtTime(72, now);
    osc1.frequency.linearRampToValueAtTime(110, now + 0.35);
    osc1.frequency.linearRampToValueAtTime(60, now + duration);

    osc2.frequency.setValueAtTime(75, now);
    osc2.frequency.linearRampToValueAtTime(114, now + 0.35);
    osc2.frequency.linearRampToValueAtTime(63, now + duration);

    // Rasgamento gutural na garganta (rasp a 32 Hz)
    const rasp = this.ctx.createOscillator();
    const raspGain = this.ctx.createGain();
    rasp.frequency.setValueAtTime(32, now);
    raspGain.gain.setValueAtTime(24, now);
    rasp.connect(osc1.frequency);
    rasp.connect(osc2.frequency);
    rasp.start(now);
    rasp.stop(now + duration);

    // Filtro de garganta dinâmica abrindo para o rugido
    const throatFilter = this.ctx.createBiquadFilter();
    throatFilter.type = 'lowpass';
    throatFilter.frequency.setValueAtTime(260, now);
    throatFilter.frequency.linearRampToValueAtTime(980, now + 0.35);
    throatFilter.frequency.linearRampToValueAtTime(200, now + duration);
    throatFilter.Q.setValueAtTime(3.5, now);

    // Ruído de turbulência de ar do rugido feroz
    const noiseBuf = this.getNoiseBuffer(duration);
    if (noiseBuf) {
      const noiseSrc = this.ctx.createBufferSource();
      noiseSrc.buffer = noiseBuf;
      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(450, now);
      noiseFilter.frequency.linearRampToValueAtTime(1400, now + 0.38);
      noiseFilter.frequency.linearRampToValueAtTime(350, now + duration);
      noiseFilter.Q.setValueAtTime(2.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now);
      noiseGain.gain.linearRampToValueAtTime(0.48, now + 0.35);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      noiseSrc.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.outputNode);
      noiseSrc.start(now);
      noiseSrc.stop(now + duration);
    }

    // Sub-grave de peito
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(48, now);
    subGain.gain.setValueAtTime(0.001, now);
    subGain.gain.linearRampToValueAtTime(0.60, now + 0.25);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    subOsc.connect(subGain);
    subGain.connect(this.outputNode);
    subOsc.start(now);
    subOsc.stop(now + duration);

    // Ganho principal da voz do leão
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.88, now + 0.30);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(throatFilter);
    osc2.connect(throatFilter);
    throatFilter.connect(mainGain);
    mainGain.connect(this.outputNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 7. Ovelha (Balido sintetizado)
  synthesizeSheep() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.05;

    // Corda vocal da ovelha
    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(245, now);
    osc.frequency.linearRampToValueAtTime(215, now + duration);

    // Tremolo laríngeo característico do balido a 13 Hz
    const flutterOsc = this.ctx.createOscillator();
    const flutterGain = this.ctx.createGain();
    flutterOsc.frequency.setValueAtTime(13, now);
    flutterGain.gain.setValueAtTime(0.35, now);
    flutterOsc.start(now);
    flutterOsc.stop(now + duration);

    // Formantes nasais de ovelha (vogal aberta "Ééé")
    const f1 = this.ctx.createBiquadFilter();
    f1.type = 'bandpass';
    f1.frequency.setValueAtTime(740, now);
    f1.Q.setValueAtTime(3.8, now);

    const f2 = this.ctx.createBiquadFilter();
    f2.type = 'bandpass';
    f2.frequency.setValueAtTime(1780, now);
    f2.Q.setValueAtTime(4.2, now);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.85, now + 0.08);
    mainGain.gain.setValueAtTime(0.80, now + 0.55);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    // Conecta tremolo no ganho da voz
    flutterOsc.connect(flutterGain);
    flutterGain.connect(mainGain.gain);

    osc.connect(f1);
    osc.connect(f2);
    f1.connect(mainGain);
    f2.connect(mainGain);
    mainGain.connect(this.outputNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  // 8. Passarinho (Trinado sintetizado)
  synthesizeBird() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Dois piados rápidos com glissando ágil
    const chirp = (startTime, fStart, fPeak, fEnd, duration) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(fStart, startTime);
      osc.frequency.exponentialRampToValueAtTime(fPeak, startTime + duration * 0.45);
      osc.frequency.exponentialRampToValueAtTime(fEnd, startTime + duration);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.75, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.outputNode);
      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    chirp(now, 2600, 4800, 3200, 0.10);
    chirp(now + 0.14, 2900, 5200, 3500, 0.11);

    // Trinado melódico rápido final (siringe vibrante a 24 Hz)
    const trillStart = now + 0.30;
    const trillDur = 0.38;
    const trillOsc = this.ctx.createOscillator();
    const trillMod = this.ctx.createOscillator();
    const trillModGain = this.ctx.createGain();
    const trillGain = this.ctx.createGain();

    trillMod.frequency.setValueAtTime(24, trillStart);
    trillModGain.gain.setValueAtTime(450, trillStart);
    trillMod.connect(trillOsc.frequency);

    trillOsc.type = 'sine';
    trillOsc.frequency.setValueAtTime(4200, trillStart);
    trillOsc.frequency.linearRampToValueAtTime(4900, trillStart + trillDur);

    trillGain.gain.setValueAtTime(0.001, trillStart);
    trillGain.gain.linearRampToValueAtTime(0.70, trillStart + 0.03);
    trillGain.gain.exponentialRampToValueAtTime(0.001, trillStart + trillDur);

    trillOsc.connect(trillGain);
    trillGain.connect(this.outputNode);

    trillMod.start(trillStart);
    trillOsc.start(trillStart);
    trillMod.stop(trillStart + trillDur);
    trillOsc.stop(trillStart + trillDur);
  }

  // 9. Elefante (Barrito sintetizado)
  synthesizeElephant() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.15;

    // Osciladores duplos com detune para riqueza de metal e tromba
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'sawtooth';

    // Curva de trombeta: ataque com subida vertiginosa e sustentação potente
    osc1.frequency.setValueAtTime(220, now);
    osc1.frequency.exponentialRampToValueAtTime(620, now + 0.38);
    osc1.frequency.exponentialRampToValueAtTime(360, now + duration);

    osc2.frequency.setValueAtTime(224, now);
    osc2.frequency.exponentialRampToValueAtTime(625, now + 0.38);
    osc2.frequency.exponentialRampToValueAtTime(364, now + duration);

    // Flutter de lábios na tromba a 28 Hz
    const lipMod = this.ctx.createOscillator();
    const lipGain = this.ctx.createGain();
    lipMod.frequency.setValueAtTime(28, now);
    lipGain.gain.setValueAtTime(0.30, now);
    lipMod.start(now);
    lipMod.stop(now + duration);

    // Filtro formante de tromba metálica ressonante (sweep de 500Hz para 2300Hz)
    const trunkFilter = this.ctx.createBiquadFilter();
    trunkFilter.type = 'bandpass';
    trunkFilter.frequency.setValueAtTime(500, now);
    trunkFilter.frequency.linearRampToValueAtTime(2300, now + 0.38);
    trunkFilter.frequency.linearRampToValueAtTime(750, now + duration);
    trunkFilter.Q.setValueAtTime(3.2, now);

    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.88, now + 0.15);
    mainGain.gain.setValueAtTime(0.85, now + 0.50);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    lipMod.connect(lipGain);
    lipGain.connect(mainGain.gain);

    osc1.connect(trunkFilter);
    osc2.connect(trunkFilter);
    trunkFilter.connect(mainGain);
    mainGain.connect(this.outputNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 10. Macaco (Galgos e gritos sintetizados)
  synthesizeMonkey() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // 1. Dois "Uh-uh" de peito
    const hoot = (startTime, duration, freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.35, startTime + duration * 0.4);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.9, startTime + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(freq * 1.8, startTime);
      filter.Q.setValueAtTime(3.0, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.80, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputNode);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    hoot(now, 0.12, 280);
    hoot(now + 0.16, 0.13, 330);

    // 2. Três guinchos agudos e alegres "Ah-Ah-AHHH!"
    const screech = (startTime, duration, freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.45, startTime + duration * 0.5);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.1, startTime + duration);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1450, startTime);
      filter.Q.setValueAtTime(3.5, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.82, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputNode);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    screech(now + 0.35, 0.13, 560);
    screech(now + 0.52, 0.14, 680);
    screech(now + 0.70, 0.20, 840);
  }

  // 11. Coruja (Canto noturno sintetizado)
  synthesizeOwl() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    const hoot = (startTime, duration, freq, isLong = false) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      // Vibrato suave de plumagem
      const vib = this.ctx.createOscillator();
      const vibGain = this.ctx.createGain();
      vib.frequency.setValueAtTime(5.0, startTime);
      vibGain.gain.setValueAtTime(6.0, startTime);
      vib.connect(osc.frequency);
      vib.start(startTime);
      vib.stop(startTime + duration);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);
      if (isLong) {
        osc.frequency.linearRampToValueAtTime(freq * 1.08, startTime + duration * 0.35);
        osc.frequency.linearRampToValueAtTime(freq * 0.95, startTime + duration);
      }

      // Caixa acústica ressonante de tronco oco
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(420, startTime);
      filter.Q.setValueAtTime(4.0, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.82, startTime + (isLong ? 0.08 : 0.03));
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.outputNode);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    // "Hoo-oo..." longo seguido de "Hu-hu-huuu"
    hoot(now, 0.45, 380, true);
    hoot(now + 0.54, 0.16, 340);
    hoot(now + 0.74, 0.16, 340);
    hoot(now + 0.94, 0.35, 310, true);
  }

  // 12. Cavalo (Relincho sintetizado)
  synthesizeHorse() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.35;

    // Relincho harmônico com vibrato a 14 Hz
    const osc = this.ctx.createOscillator();
    const vib = this.ctx.createOscillator();
    const vibGain = this.ctx.createGain();

    vib.frequency.setValueAtTime(14, now);
    vibGain.gain.setValueAtTime(32, now);
    vib.connect(osc.frequency);
    vib.start(now);
    vib.stop(now + 0.75);

    osc.type = 'sawtooth';
    // Curva de relincho: sobe rápido para agudo e despenca no sopro
    osc.frequency.setValueAtTime(680, now);
    osc.frequency.linearRampToValueAtTime(1200, now + 0.22);
    osc.frequency.exponentialRampToValueAtTime(420, now + 0.75);

    const voiceFilter = this.ctx.createBiquadFilter();
    voiceFilter.type = 'bandpass';
    voiceFilter.frequency.setValueAtTime(1100, now);
    voiceFilter.Q.setValueAtTime(2.8, now);

    const voiceGain = this.ctx.createGain();
    voiceGain.gain.setValueAtTime(0.001, now);
    voiceGain.gain.linearRampToValueAtTime(0.85, now + 0.12);
    voiceGain.gain.exponentialRampToValueAtTime(0.001, now + 0.75);

    osc.connect(voiceFilter);
    voiceFilter.connect(voiceGain);
    voiceGain.connect(this.outputNode);

    osc.start(now);
    osc.stop(now + 0.76);

    // Sopro de beiço do cavalo (flutter de lábios a 18 Hz sobre ruído filtrado)
    const snortStart = now + 0.72;
    const snortDur = 0.55;
    const noiseBuf = this.getNoiseBuffer(snortDur);
    if (noiseBuf) {
      const noise = this.ctx.createBufferSource();
      noise.buffer = noiseBuf;

      const snortFilter = this.ctx.createBiquadFilter();
      snortFilter.type = 'bandpass';
      snortFilter.frequency.setValueAtTime(550, snortStart);
      snortFilter.Q.setValueAtTime(2.2, snortStart);

      const flapMod = this.ctx.createOscillator();
      const flapGain = this.ctx.createGain();
      flapMod.frequency.setValueAtTime(18, snortStart);
      flapGain.gain.setValueAtTime(0.45, snortStart);

      const snortGain = this.ctx.createGain();
      snortGain.gain.setValueAtTime(0.001, snortStart);
      snortGain.gain.linearRampToValueAtTime(0.65, snortStart + 0.08);
      snortGain.gain.exponentialRampToValueAtTime(0.001, snortStart + snortDur);

      flapMod.connect(flapGain);
      flapGain.connect(snortGain.gain);

      noise.connect(snortFilter);
      snortFilter.connect(snortGain);
      snortGain.connect(this.outputNode);

      flapMod.start(snortStart);
      noise.start(snortStart);
      flapMod.stop(snortStart + snortDur);
      noise.stop(snortStart + snortDur);
    }
  }

  // 13. Golfinho (Cliques e assobio sintetizados)
  synthesizeDolphin() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // 1. Trem de cliques rápidos de ecolocalização
    for (let i = 0; i < 5; i++) {
      const t = now + i * 0.035;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(4200 + i * 150, t);
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.60, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
      osc.connect(gain);
      gain.connect(this.outputNode);
      osc.start(t);
      osc.stop(t + 0.025);
    }

    // 2. Assobio acústico curvo e cristalino
    const whistleStart = now + 0.20;
    const whistleDur = 0.65;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    // Contorno sonoro expressivo do golfinho
    osc.frequency.setValueAtTime(1800, whistleStart);
    osc.frequency.exponentialRampToValueAtTime(3600, whistleStart + 0.22);
    osc.frequency.exponentialRampToValueAtTime(2200, whistleStart + 0.42);
    osc.frequency.exponentialRampToValueAtTime(3300, whistleStart + whistleDur);

    gain.gain.setValueAtTime(0.001, whistleStart);
    gain.gain.linearRampToValueAtTime(0.80, whistleStart + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, whistleStart + whistleDur);

    osc.connect(gain);
    gain.connect(this.outputNode);
    osc.start(whistleStart);
    osc.stop(whistleStart + whistleDur);
  }

  // 14. Baleia (Canto oceânico sintetizado)
  synthesizeWhale() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.55;

    // Duplo oscilador oceânico com batimento suave
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sine';
    osc2.type = 'triangle';

    osc1.frequency.setValueAtTime(92, now);
    osc1.frequency.linearRampToValueAtTime(180, now + 0.65);
    osc1.frequency.linearRampToValueAtTime(78, now + duration);

    osc2.frequency.setValueAtTime(92.5, now);
    osc2.frequency.linearRampToValueAtTime(181, now + 0.65);
    osc2.frequency.linearRampToValueAtTime(78.5, now + duration);

    // Filtro de ressonância da coluna de água
    const oceanFilter = this.ctx.createBiquadFilter();
    oceanFilter.type = 'lowpass';
    oceanFilter.frequency.setValueAtTime(300, now);
    oceanFilter.frequency.linearRampToValueAtTime(520, now + 0.65);
    oceanFilter.frequency.linearRampToValueAtTime(220, now + duration);
    oceanFilter.Q.setValueAtTime(2.8, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.85, now + 0.35);
    gain.gain.setValueAtTime(0.82, now + 0.90);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc1.connect(oceanFilter);
    osc2.connect(oceanFilter);
    oceanFilter.connect(gain);
    gain.connect(this.outputNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // 15. Grilo (Canto sintetizado)
  synthesizeCricket() {
    this.ensureContext();
    const now = this.ctx.currentTime;

    // Três rajadas estridulantes de fricção das asas
    const burstOffsets = [0, 0.22, 0.44];
    burstOffsets.forEach((burstOffset) => {
      // Cada rajada tem 3 a 4 micro-pulsos rápidos
      for (let p = 0; p < 4; p++) {
        const t = now + burstOffset + p * 0.016;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(4650, t);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(4650, t);
        filter.Q.setValueAtTime(8.0, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.72, t + 0.004);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.outputNode);

        osc.start(t);
        osc.stop(t + 0.018);
      }
    });
  }

  // 16. Abelha (Zumbido sintetizado)
  synthesizeBee() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 1.15;

    // Batimento das asas da abelha (235 Hz fundamental rica em harmônicos)
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    osc1.type = 'sawtooth';
    osc2.type = 'square';

    // Curva de voo com leve curva Doppler
    osc1.frequency.setValueAtTime(235, now);
    osc1.frequency.linearRampToValueAtTime(270, now + 0.45);
    osc1.frequency.linearRampToValueAtTime(220, now + duration);

    osc2.frequency.setValueAtTime(470, now);
    osc2.frequency.linearRampToValueAtTime(540, now + 0.45);
    osc2.frequency.linearRampToValueAtTime(440, now + duration);

    // Tremor de alta frequência (115 Hz AM) da asa da abelha
    const flutterMod = this.ctx.createOscillator();
    const flutterGain = this.ctx.createGain();
    flutterMod.frequency.setValueAtTime(115, now);
    flutterGain.gain.setValueAtTime(0.35, now);
    flutterMod.start(now);
    flutterMod.stop(now + duration);

    const bodyFilter = this.ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.setValueAtTime(750, now);
    bodyFilter.Q.setValueAtTime(3.0, now);

    // Envelope de passagem da abelhinha voando perto do ouvido
    const mainGain = this.ctx.createGain();
    mainGain.gain.setValueAtTime(0.001, now);
    mainGain.gain.linearRampToValueAtTime(0.82, now + 0.40);
    mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    flutterMod.connect(flutterGain);
    flutterGain.connect(mainGain.gain);

    osc1.connect(bodyFilter);
    osc2.connect(bodyFilter);
    bodyFilter.connect(mainGain);
    mainGain.connect(this.outputNode);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  }

  // =========================================================================
  // 2. TECLADO MUSICAL ANIMAL (AFINADO NA ESCALA DE DÓ MAIOR)
  // =========================================================================

  playAnimalPianoNote(animalId, freq) {
    this.ensureContext();
    const now = this.ctx.currentTime;
    const duration = 0.55;

    // Toca a gravação natural autêntica afinada na nota da escala
    const buffer = this.animalBuffers.get(animalId);
    if (buffer && this.ctx) {
      try {
        const baseFreq = 261.63; // Dó central (C4)
        const rate = Math.max(0.35, Math.min(3.5, freq / baseFreq));
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.playbackRate.setValueAtTime(rate, now);

        const gainNode = this.ctx.createGain();
        const baseGain = (this.animalGains[animalId] || 1.0) * 0.95;
        const noteDuration = Math.min(0.65, buffer.duration / rate);

        gainNode.gain.setValueAtTime(baseGain, now);
        gainNode.gain.setValueAtTime(baseGain, now + noteDuration - 0.12);
        gainNode.gain.linearRampToValueAtTime(0.001, now + noteDuration);

        source.connect(gainNode);
        gainNode.connect(this.outputNode);

        source.start(now);
        source.stop(now + noteDuration);
        return;
      } catch (e) {
        console.warn('[AnimalAudioEngine] Erro ao tocar nota com sample:', e);
      }
    }

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
    gain.gain.linearRampToValueAtTime(0.70, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.outputNode);

    osc.start(now);
    osc.stop(now + duration);
  }

  playPianoNote(freq = 261.63) {
    this.playAnimalPianoNote('cat', freq);
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
      gain.gain.linearRampToValueAtTime(0.55, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.5);
      osc.connect(gain);
      gain.connect(this.outputNode);
      osc.start(time);
      osc.stop(time + 0.55);
    });
  }

  playTreeRustle() {
    this.ensureContext();
    const now = this.ctx.currentTime;
    // Farfalhar de folhas com ruído filtrado
    const bufferSize = Math.floor(this.ctx.sampleRate * 0.35);
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
    gain.gain.setValueAtTime(0.60, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    noise.connect(bpf);
    bpf.connect(gain);
    gain.connect(this.outputNode);
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
      gain.gain.linearRampToValueAtTime(0.65, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.6);

      osc.connect(gain);
      gain.connect(this.outputNode);

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

      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.50, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.35);

      osc.connect(gain);
      gain.connect(this.outputNode);

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
