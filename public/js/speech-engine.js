// public/js/speech-engine.js - Síntese de Voz Bilíngue para Crianças

import { getLanguage, t } from './i18n.js';

class AnimalSpeechEngine {
  constructor() {
    this.synth = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
    this.voices = [];
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const load = () => {
      this.voices = this.synth.getVoices();
    };
    load();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = load;
    }
  }

  getBestVoice(langCode) {
    if (!this.voices.length) this.initVoices();
    const prefix = langCode.toLowerCase().startsWith('pt') ? 'pt' : 'en';
    const list = this.voices.filter(v => v.lang.toLowerCase().startsWith(prefix));
    const preferred = list.find(v => /google|natural|child|junior|luciana|daniel|samantha|karen|zira|helena/i.test(v.name));
    return preferred || list[0] || null;
  }

  speak(text, lang = null) {
    if (!this.synth) return;
    try {
      this.synth.cancel(); // Interrompe fala anterior para responsividade imediata

      const targetLang = lang || getLanguage();
      const langTag = targetLang === 'pt' ? 'pt-BR' : 'en-US';

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langTag;
      utterance.rate = 0.86; // Cadência suave e compassada para compreensão infantil
      utterance.pitch = 1.25; // Tom alegre, amigável e acolhedor

      const voice = this.getBestVoice(langTag);
      if (voice) {
        utterance.voice = voice;
      }

      if (this.synth.paused) {
        this.synth.resume();
      }
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('SpeechSynthesis error:', err);
    }
  }

  // Pronuncia o nome do animal com o artigo correto
  speakAnimal(animalId, lang = null) {
    const activeLang = lang || getLanguage();
    const data = t(`animals.${animalId}`);
    if (!data) return;

    if (activeLang === 'pt') {
      const art = data.article === 'a' ? 'A' : 'O';
      this.speak(`${art} ${data.name}!`, 'pt');
    } else {
      this.speak(`The ${data.name}!`, 'en');
    }
  }

  // Faz a pergunta do Quiz de Som
  speakSoundQuizQuestion(lang = null) {
    const activeLang = lang || getLanguage();
    if (activeLang === 'pt') {
      this.speak('Quem faz esse som legal?', 'pt');
    } else {
      this.speak('Who makes this fun sound?', 'en');
    }
  }

  // Faz a pergunta de encontrar o bicho
  speakFindAnimalQuestion(animalId, lang = null) {
    const activeLang = lang || getLanguage();
    const data = t(`animals.${animalId}`);
    if (!data) return;

    if (activeLang === 'pt') {
      const art = data.article === 'a' ? 'a' : 'o';
      this.speak(`Onde está ${art} ${data.name}?`, 'pt');
    } else {
      this.speak(`Where is the ${data.name}?`, 'en');
    }
  }

  // Elogio de vitória ao acertar
  speakSuccessFeedback(animalId = null, lang = null) {
    const activeLang = lang || getLanguage();
    const data = animalId ? t(`animals.${animalId}`) : null;

    if (activeLang === 'pt') {
      if (data) {
        const art = data.article === 'a' ? 'a' : 'o';
        this.speak(`Muito bem! É ${art} ${data.name}!`, 'pt');
      } else {
        const compliments = ['Muito bem!', 'Parabéns, você acertou!', 'Excelente!'];
        this.speak(compliments[Math.floor(Math.random() * compliments.length)], 'pt');
      }
    } else {
      if (data) {
        this.speak(`Awesome! It's the ${data.name}!`, 'en');
      } else {
        const compliments = ['Great job!', 'Awesome, you got it!', 'Super cool!'];
        this.speak(compliments[Math.floor(Math.random() * compliments.length)], 'en');
      }
    }
  }

  // Encorajamento amigável ao errar
  speakTryAgain(lang = null) {
    const activeLang = lang || getLanguage();
    if (activeLang === 'pt') {
      this.speak('Quase lá! Vamos tentar de novo?', 'pt');
    } else {
      this.speak("Almost! Let's try again!", 'en');
    }
  }

  stop() {
    if (this.synth) this.synth.cancel();
  }
}

export const animalSpeech = new AnimalSpeechEngine();
