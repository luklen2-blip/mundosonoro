// public/js/demo-player.js - Player de Demonstração de 10 Segundos (Vídeo HTML5 + Fallback Interativo)
import { animalAudio } from './audio-engine.js';

export function initDemoPlayer(wrapperId = 'demo-video-wrapper') {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const video = wrapper.querySelector('video');
  const posterOverlay = wrapper.querySelector('.demo-poster-overlay');
  const interactiveContainer = wrapper.querySelector('.demo-interactive-container');
  const stageVisual = wrapper.querySelector('.demo-stage-visual');
  const stageTitle = wrapper.querySelector('.demo-stage-title');
  const stageSubtitle = wrapper.querySelector('.demo-stage-subtitle');
  const stageBadge = wrapper.querySelector('.demo-stage-badge');
  const playToggleBtn = wrapper.querySelector('.demo-play-toggle-btn');
  const soundToggleBtn = wrapper.querySelector('.demo-sound-toggle-btn');
  const restartBtn = wrapper.querySelector('.demo-restart-btn');
  const progressFill = wrapper.querySelector('.demo-progress-fill');
  const progressTrack = wrapper.querySelector('.demo-progress-track');
  const timeCounter = wrapper.querySelector('.demo-time-counter');

  let isPlaying = false;
  let isMuted = false;
  let currentTime = 0;
  const duration = 10; // 10 segundos exatos
  let animFrameId = null;
  let lastTimestamp = null;
  let currentStep = -1;

  const scenes = [
    {
      start: 0,
      end: 2.5,
      badge: '🐾 16 Bichinhos Reais',
      visual: '🐶',
      title: 'Cachorro & Gato',
      subtitle: 'Sons reais sintetizados e locução carinhosa',
      bg: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
      onEnter: () => {
        if (!isMuted) {
          try { animalAudio.playAnimal('dog'); } catch (e) {}
        }
      }
    },
    {
      start: 2.5,
      end: 5.0,
      badge: '🧠 Jogos Educativos',
      visual: '⭐',
      title: 'Adivinhe o Som!',
      subtitle: 'Estrelinhas brilhantes e feedback positivo para a criança',
      bg: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
      onEnter: () => {
        if (!isMuted) {
          try { animalAudio.playVictoryChime(); } catch (e) {}
        }
      }
    },
    {
      start: 5.0,
      end: 7.5,
      badge: '🎹 Teclado dos Bichinhos',
      visual: '🎵',
      title: 'Piano Musical Infantil',
      subtitle: 'Toque notas musicais e crie pequenas melodias alegres',
      bg: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      onEnter: () => {
        if (!isMuted) {
          try {
            animalAudio.playPianoNote(261.63); // Dó
            setTimeout(() => { if (isPlaying && !isMuted) animalAudio.playPianoNote(329.63); }, 400); // Mi
            setTimeout(() => { if (isPlaying && !isMuted) animalAudio.playPianoNote(392.00); }, 800); // Sol
          } catch (e) {}
        }
      }
    },
    {
      start: 7.5,
      end: 10.0,
      badge: '🌙 Hora de Dormir',
      visual: '😴',
      title: 'Modo Noturno & Acalanto',
      subtitle: 'Sons suaves para relaxar e desacelerar antes de dormir',
      bg: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      onEnter: () => {
        if (!isMuted) {
          try { animalAudio.playSunSparkle(); } catch (e) {}
        }
      }
    }
  ];

  function startInteractiveShow() {
    if (posterOverlay) posterOverlay.style.display = 'none';
    if (video) video.style.display = 'none';
    if (interactiveContainer) interactiveContainer.style.display = 'flex';
    currentTime = 0;
    currentStep = -1;
    isPlaying = true;
    if (playToggleBtn) playToggleBtn.textContent = '⏸';
    lastTimestamp = performance.now();
    cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(tick);
  }

  function pauseInteractiveShow() {
    isPlaying = false;
    if (playToggleBtn) playToggleBtn.textContent = '▶';
    cancelAnimationFrame(animFrameId);
  }

  function resumeInteractiveShow() {
    if (currentTime >= duration) currentTime = 0;
    isPlaying = true;
    if (playToggleBtn) playToggleBtn.textContent = '⏸';
    lastTimestamp = performance.now();
    cancelAnimationFrame(animFrameId);
    animFrameId = requestAnimationFrame(tick);
  }

  function tick(now) {
    if (!isPlaying) return;
    const delta = (now - lastTimestamp) / 1000;
    lastTimestamp = now;
    currentTime = Math.min(duration, currentTime + delta);

    // Atualiza barra de progresso
    const pct = (currentTime / duration) * 100;
    if (progressFill) progressFill.style.width = `${pct}%`;

    // Atualiza contador de tempo (0:00 / 0:10)
    const secs = Math.floor(currentTime);
    const secsFormatted = secs < 10 ? `0${secs}` : `${secs}`;
    if (timeCounter) timeCounter.textContent = `0:${secsFormatted} / 0:10`;

    // Determina cena atual
    const sceneIndex = scenes.findIndex(s => currentTime >= s.start && currentTime < s.end);
    if (sceneIndex !== -1 && sceneIndex !== currentStep) {
      currentStep = sceneIndex;
      const s = scenes[sceneIndex];
      if (stageBadge) stageBadge.textContent = s.badge;
      if (stageVisual) stageVisual.textContent = s.visual;
      if (stageTitle) stageTitle.textContent = s.title;
      if (stageSubtitle) stageSubtitle.textContent = s.subtitle;
      if (interactiveContainer) interactiveContainer.style.background = s.bg;
      s.onEnter();
    }

    if (currentTime >= duration) {
      finishShow();
      return;
    }

    animFrameId = requestAnimationFrame(tick);
  }

  function finishShow() {
    isPlaying = false;
    if (playToggleBtn) playToggleBtn.textContent = '▶';
    if (stageBadge) stageBadge.textContent = '🌟 Demonstração Concluída';
    if (stageVisual) stageVisual.textContent = '🎉';
    if (stageTitle) stageTitle.textContent = 'SoundWorld Kids';
    if (stageSubtitle) stageSubtitle.textContent = '16 Bichinhos • Jogos • Teclado • Hora de Dormir • R$ 19,90';
    if (progressFill) progressFill.style.width = '100%';
    if (timeCounter) timeCounter.textContent = '0:10 / 0:10';
  }

  // Interação ao clicar no Play inicial
  const bigPlayBtn = wrapper.querySelector('.demo-start-play-btn') || wrapper.querySelector('.demo-poster-overlay');
  if (bigPlayBtn) {
    bigPlayBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      // Inicializa áudio no clique
      try { animalAudio.init(); } catch (e) {}

      // Tenta reproduzir arquivo nativo de vídeo se existir e for válido
      if (video && video.src && !video.error && video.readyState >= 2) {
        if (posterOverlay) posterOverlay.style.display = 'none';
        video.play().catch(() => startInteractiveShow());
      } else {
        startInteractiveShow();
      }
    });
  }

  // Se o vídeo nativo der erro de carregamento (ex: 404), troca para o show interativo
  if (video) {
    video.addEventListener('error', () => {
      // Vídeo físico não encontrado, preparado para o show interativo
    });
    video.addEventListener('play', () => {
      if (posterOverlay) posterOverlay.style.display = 'none';
    });
  }

  // Botões da barra de controles do player
  if (playToggleBtn) {
    playToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        pauseInteractiveShow();
      } else {
        resumeInteractiveShow();
      }
    });
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isMuted = !isMuted;
      soundToggleBtn.textContent = isMuted ? '🔇' : '🔊';
    });
  }

  if (restartBtn) {
    restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      startInteractiveShow();
    });
  }

  if (progressTrack) {
    progressTrack.addEventListener('click', (e) => {
      e.stopPropagation();
      const rect = progressTrack.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      currentTime = pct * duration;
      currentStep = -1; // força reavaliação da cena
      if (!isPlaying) resumeInteractiveShow();
    });
  }
}
