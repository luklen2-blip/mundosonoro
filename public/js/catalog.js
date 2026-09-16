// public/js/catalog.js - Catálogo Modular de Mundos e Bichinhos do SoundWorld Kids

export const WORLDS = [
  { id: 'all', icon: '🌟', color: '#ffd166', i18nKey: 'worlds.all' },
  { id: 'home', icon: '🐶', color: '#ff70a6', i18nKey: 'worlds.home' },
  { id: 'farm', icon: '🐮', color: '#70d6ff', i18nKey: 'worlds.farm' },
  { id: 'jungle', icon: '🦁', color: '#ff9770', i18nKey: 'worlds.jungle' },
  { id: 'africa', icon: '🐘', color: '#9b5de5', i18nKey: 'worlds.africa' },
  { id: 'ocean', icon: '🐬', color: '#00bbf9', i18nKey: 'worlds.ocean' },
  { id: 'forest', icon: '🐦', color: '#06d6a0', i18nKey: 'worlds.forest' },
  { id: 'bugs', icon: '🐞', color: '#f15bb5', i18nKey: 'worlds.bugs' }
];

export const ANIMALS_CATALOG = [
  // 🐶 Animais de Casa
  { id: 'dog', icon: '🐶', world: 'home', colorClass: 'card-border-pink', audioMethod: 'playDog' },
  { id: 'cat', icon: '🐱', world: 'home', colorClass: 'card-border-purple', audioMethod: 'playCat' },

  // 🐮 Fazenda
  { id: 'cow', icon: '🐮', world: 'farm', colorClass: 'card-border-green', audioMethod: 'playCow' },
  { id: 'horse', icon: '🐴', world: 'farm', colorClass: 'card-border-pink', audioMethod: 'playHorse' },
  { id: 'sheep', icon: '🐑', world: 'farm', colorClass: 'card-border-blue', audioMethod: 'playSheep' },
  { id: 'duck', icon: '🦆', world: 'farm', colorClass: 'card-border-yellow', audioMethod: 'playDuck' },

  // 🦁 Selva
  { id: 'lion', icon: '🦁', world: 'jungle', colorClass: 'card-border-yellow', audioMethod: 'playLion' },
  { id: 'monkey', icon: '🐵', world: 'jungle', colorClass: 'card-border-yellow', audioMethod: 'playMonkey' },

  // 🐘 África
  { id: 'elephant', icon: '🐘', world: 'africa', colorClass: 'card-border-purple', audioMethod: 'playElephant' },

  // 🐬 Oceano
  { id: 'dolphin', icon: '🐬', world: 'ocean', colorClass: 'card-border-blue', audioMethod: 'playDolphin' },
  { id: 'whale', icon: '🐋', world: 'ocean', colorClass: 'card-border-blue', audioMethod: 'playWhale' },

  // 🐦 Floresta
  { id: 'owl', icon: '🦉', world: 'forest', colorClass: 'card-border-blue', audioMethod: 'playOwl' },
  { id: 'bird', icon: '🐦', world: 'forest', colorClass: 'card-border-blue', audioMethod: 'playBird' },
  { id: 'frog', icon: '🐸', world: 'forest', colorClass: 'card-border-green', audioMethod: 'playFrog' },

  // 🐞 Pequenos Bichos
  { id: 'cricket', icon: '🦗', world: 'bugs', colorClass: 'card-border-green', audioMethod: 'playCricket' },
  { id: 'bee', icon: '🐝', world: 'bugs', colorClass: 'card-border-yellow', audioMethod: 'playBee' }
];

// Blueprints para Expansões Futuras (Arquitetura Extensível para Novos Mundos e IA)
export const FUTURE_WORLDS_BLUEPRINT = [
  { id: 'city', name: 'Sons da Cidade', icon: '🚗', status: 'planned' },
  { id: 'transports', name: 'Transportes Mágicos', icon: '🚂', status: 'planned' },
  { id: 'nature', name: 'Sons da Natureza', icon: '🌧️', status: 'planned' },
  { id: 'home_sounds', name: 'Sons de Casa', icon: '🏠', status: 'planned' },
  { id: 'instruments', name: 'Instrumentos Musicais', icon: '🎺', status: 'planned' },
  { id: 'ai_stories', name: 'Histórias Sonoras com IA', icon: '📖', status: 'planned' }
];
