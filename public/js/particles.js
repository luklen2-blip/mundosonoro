// public/js/particles.js - Motor de Partículas e Feedback Visual Tátil

export class ParticleFX {
  constructor() {
    this.colors = ['#FF5E7E', '#FFD166', '#06D6A0', '#118AB2', '#9D4EDD', '#FF9F1C'];
    this.notes = ['♪', '♫', '♩', '♬', '⭐', '✨'];
  }

  // Cria onda de choque / ripple colorido ao tocar
  createRipple(x, y, color = null) {
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    const c = color || this.colors[Math.floor(Math.random() * this.colors.length)];
    ripple.style.borderColor = c;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);
    setTimeout(() => {
      if (ripple.parentNode) ripple.parentNode.removeChild(ripple);
    }, 600);
  }

  // Lança notas musicais ou estrelas flutuantes
  spawnFloatingElements(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      el.className = 'floating-particle';
      el.textContent = this.notes[Math.floor(Math.random() * this.notes.length)];
      el.style.color = this.colors[Math.floor(Math.random() * this.colors.length)];

      const angle = (Math.PI * 2 * i) / count + (Math.random() * 0.5);
      const dist = 40 + Math.random() * 60;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist - 30; // Tendência a subir

      el.style.left = `${x}px`;
      el.style.top = `${y}px`;
      el.style.setProperty('--dx', `${dx}px`);
      el.style.setProperty('--dy', `${dy}px`);

      document.body.appendChild(el);
      setTimeout(() => {
        if (el.parentNode) el.parentNode.removeChild(el);
      }, 900);
    }
  }

  // Chuva de confetes comemorativos no jogo de adivinhação
  triggerConfetti() {
    const container = document.createElement('div');
    container.className = 'confetti-layer';
    document.body.appendChild(container);

    const confettiCount = 50;
    for (let i = 0; i < confettiCount; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.backgroundColor = this.colors[Math.floor(Math.random() * this.colors.length)];
      piece.style.left = `${Math.random() * 100}vw`;
      piece.style.animationDelay = `${Math.random() * 0.4}s`;
      piece.style.animationDuration = `${1.2 + Math.random() * 1.5}s`;
      container.appendChild(piece);
    }

    setTimeout(() => {
      if (container.parentNode) container.parentNode.removeChild(container);
    }, 2800);
  }
}

export const fx = new ParticleFX();
