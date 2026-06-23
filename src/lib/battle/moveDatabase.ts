import type { PokemonType, Weather, Terrain, StatBoosts, StatusCondition } from '../../types/pokemon';

export interface MoveData {
  id: string;
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power: number;
  accuracy: number;
  priority: number;
  target: 'single' | 'adjacent' | 'allAdjacentFoes' | 'allAdjacent' | 'self' | 'allySide' | 'foeSide';
  flags: string[];
  effects?: {
    weather?: Weather;
    terrain?: Terrain;
    boost?: Partial<StatBoosts>;
    status?: StatusCondition;
    selfBoost?: Partial<StatBoosts>;
    protect?: boolean;
    fakeOut?: boolean;
    trickRoom?: boolean;
    tailwind?: boolean;
  };
}

export const movesDatabase: Record<string, MoveData> = {
  // Protect / Fake Out
  'protect': { id: 'protect', name: 'Protect', type: 'Normal', category: 'status', power: 0, accuracy: 100, priority: 4, target: 'self', flags: [], effects: { protect: true } },
  'detect': { id: 'detect', name: 'Detect', type: 'Fighting', category: 'status', power: 0, accuracy: 100, priority: 4, target: 'self', flags: [], effects: { protect: true } },
  'fake out': { id: 'fake out', name: 'Fake Out', type: 'Normal', category: 'physical', power: 40, accuracy: 100, priority: 3, target: 'single', flags: ['contact', 'priority'], effects: { fakeOut: true } },
  
  // Speed Control
  'tailwind': { id: 'tailwind', name: 'Tailwind', type: 'Flying', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allySide', flags: [], effects: { tailwind: true } },
  'trick room': { id: 'trick room', name: 'Trick Room', type: 'Psychic', category: 'status', power: 0, accuracy: 100, priority: -7, target: 'allAdjacent', flags: [], effects: { trickRoom: true } },
  'icy wind': { id: 'icy wind', name: 'Icy Wind', type: 'Ice', category: 'special', power: 55, accuracy: 95, priority: 0, target: 'allAdjacentFoes', flags: ['spread'], effects: { boost: { spe: -1 } } },
  'electroweb': { id: 'electroweb', name: 'Electroweb', type: 'Electric', category: 'special', power: 55, accuracy: 95, priority: 0, target: 'allAdjacentFoes', flags: ['spread'], effects: { boost: { spe: -1 } } },

  // Weather / Terrain Setters
  'rain dance': { id: 'rain dance', name: 'Rain Dance', type: 'Water', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allAdjacent', flags: [], effects: { weather: 'rain' } },
  'sunny day': { id: 'sunny day', name: 'Sunny Day', type: 'Fire', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allAdjacent', flags: [], effects: { weather: 'sun' } },
  'sandstorm': { id: 'sandstorm', name: 'Sandstorm', type: 'Rock', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allAdjacent', flags: [], effects: { weather: 'sand' } },
  'snowscape': { id: 'snowscape', name: 'Snowscape', type: 'Ice', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allAdjacent', flags: [], effects: { weather: 'snow' } },
  
  // High Power / Spread
  'earthquake': { id: 'earthquake', name: 'Earthquake', type: 'Ground', category: 'physical', power: 100, accuracy: 100, priority: 0, target: 'allAdjacent', flags: ['spread'] },
  'rock slide': { id: 'rock slide', name: 'Rock Slide', type: 'Rock', category: 'physical', power: 75, accuracy: 90, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  'heat wave': { id: 'heat wave', name: 'Heat Wave', type: 'Fire', category: 'special', power: 95, accuracy: 90, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  'muddy water': { id: 'muddy water', name: 'Muddy Water', type: 'Water', category: 'special', power: 90, accuracy: 85, priority: 0, target: 'allAdjacentFoes', flags: ['spread'], effects: { boost: { accuracy: -1 } } },
  'dazzling gleam': { id: 'dazzling gleam', name: 'Dazzling Gleam', type: 'Fairy', category: 'special', power: 80, accuracy: 100, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  'make it rain': { id: 'make it rain', name: 'Make It Rain', type: 'Steel', category: 'special', power: 120, accuracy: 100, priority: 0, target: 'allAdjacentFoes', flags: ['spread'], effects: { selfBoost: { spa: -1 } } },
  'eruption': { id: 'eruption', name: 'Eruption', type: 'Fire', category: 'special', power: 150, accuracy: 100, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  'water spout': { id: 'water spout', name: 'Water Spout', type: 'Water', category: 'special', power: 150, accuracy: 100, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  'expanding force': { id: 'expanding force', name: 'Expanding Force', type: 'Psychic', category: 'special', power: 80, accuracy: 100, priority: 0, target: 'single', flags: [] },

  // Single Target Staples
  'close combat': { id: 'close combat', name: 'Close Combat', type: 'Fighting', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'], effects: { selfBoost: { def: -1, spd: -1 } } },
  'flare blitz': { id: 'flare blitz', name: 'Flare Blitz', type: 'Fire', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'wave crash': { id: 'wave crash', name: 'Wave Crash', type: 'Water', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'wood hammer': { id: 'wood hammer', name: 'Wood Hammer', type: 'Grass', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'double-edge': { id: 'double-edge', name: 'Double-Edge', type: 'Normal', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'knock off': { id: 'knock off', name: 'Knock Off', type: 'Dark', category: 'physical', power: 65, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'sucker punch': { id: 'sucker punch', name: 'Sucker Punch', type: 'Dark', category: 'physical', power: 70, accuracy: 100, priority: 1, target: 'single', flags: ['contact', 'priority'] },
  'extreme speed': { id: 'extreme speed', name: 'Extreme Speed', type: 'Normal', category: 'physical', power: 80, accuracy: 100, priority: 2, target: 'single', flags: ['contact', 'priority'] },
  'aqua jet': { id: 'aqua jet', name: 'Aqua Jet', type: 'Water', category: 'physical', power: 40, accuracy: 100, priority: 1, target: 'single', flags: ['contact', 'priority'] },
  'grassy glide': { id: 'grassy glide', name: 'Grassy Glide', type: 'Grass', category: 'physical', power: 55, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'mach punch': { id: 'mach punch', name: 'Mach Punch', type: 'Fighting', category: 'physical', power: 40, accuracy: 100, priority: 1, target: 'single', flags: ['contact', 'priority'] },
  'bullet punch': { id: 'bullet punch', name: 'Bullet Punch', type: 'Steel', category: 'physical', power: 40, accuracy: 100, priority: 1, target: 'single', flags: ['contact', 'priority'] },
  'ice spinner': { id: 'ice spinner', name: 'Ice Spinner', type: 'Ice', category: 'physical', power: 80, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'stomping tantrum': { id: 'stomping tantrum', name: 'Stomping Tantrum', type: 'Ground', category: 'physical', power: 75, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'brave bird': { id: 'brave bird', name: 'Brave Bird', type: 'Flying', category: 'physical', power: 120, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'acrobatics': { id: 'acrobatics', name: 'Acrobatics', type: 'Flying', category: 'physical', power: 55, accuracy: 100, priority: 0, target: 'single', flags: ['contact'] },
  'play rough': { id: 'play rough', name: 'Play Rough', type: 'Fairy', category: 'physical', power: 90, accuracy: 90, priority: 0, target: 'single', flags: ['contact'] },
  'shadow ball': { id: 'shadow ball', name: 'Shadow Ball', type: 'Ghost', category: 'special', power: 80, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'moonblast': { id: 'moonblast', name: 'Moonblast', type: 'Fairy', category: 'special', power: 95, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'sludge bomb': { id: 'sludge bomb', name: 'Sludge Bomb', type: 'Poison', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'earth power': { id: 'earth power', name: 'Earth Power', type: 'Ground', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'ice beam': { id: 'ice beam', name: 'Ice Beam', type: 'Ice', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'thunderbolt': { id: 'thunderbolt', name: 'Thunderbolt', type: 'Electric', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'flamethrower': { id: 'flamethrower', name: 'Flamethrower', type: 'Fire', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'surf': { id: 'surf', name: 'Surf', type: 'Water', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'allAdjacent', flags: ['spread'] },
  'energy ball': { id: 'energy ball', name: 'Energy Ball', type: 'Grass', category: 'special', power: 90, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'flash cannon': { id: 'flash cannon', name: 'Flash Cannon', type: 'Steel', category: 'special', power: 80, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'draco meteor': { id: 'draco meteor', name: 'Draco Meteor', type: 'Dragon', category: 'special', power: 130, accuracy: 90, priority: 0, target: 'single', flags: [], effects: { selfBoost: { spa: -2 } } },
  'overheat': { id: 'overheat', name: 'Overheat', type: 'Fire', category: 'special', power: 130, accuracy: 90, priority: 0, target: 'single', flags: [], effects: { selfBoost: { spa: -2 } } },
  'leaf storm': { id: 'leaf storm', name: 'Leaf Storm', type: 'Grass', category: 'special', power: 130, accuracy: 90, priority: 0, target: 'single', flags: [], effects: { selfBoost: { spa: -2 } } },
  'hurricane': { id: 'hurricane', name: 'Hurricane', type: 'Flying', category: 'special', power: 110, accuracy: 70, priority: 0, target: 'single', flags: [] },
  'thunder': { id: 'thunder', name: 'Thunder', type: 'Electric', category: 'special', power: 110, accuracy: 70, priority: 0, target: 'single', flags: [] },
  'blizzard': { id: 'blizzard', name: 'Blizzard', type: 'Ice', category: 'special', power: 110, accuracy: 70, priority: 0, target: 'allAdjacentFoes', flags: ['spread'] },
  
  // Status/Support
  'spore': { id: 'spore', name: 'Spore', type: 'Grass', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'single', flags: [], effects: { status: 'sleep' } },
  'sleep powder': { id: 'sleep powder', name: 'Sleep Powder', type: 'Grass', category: 'status', power: 0, accuracy: 75, priority: 0, target: 'single', flags: [], effects: { status: 'sleep' } },
  'will-o-wisp': { id: 'will-o-wisp', name: 'Will-O-Wisp', type: 'Fire', category: 'status', power: 0, accuracy: 85, priority: 0, target: 'single', flags: [], effects: { status: 'burn' } },
  'thunder wave': { id: 'thunder wave', name: 'Thunder Wave', type: 'Electric', category: 'status', power: 0, accuracy: 90, priority: 0, target: 'single', flags: [], effects: { status: 'paralysis' } },
  'toxic': { id: 'toxic', name: 'Toxic', type: 'Poison', category: 'status', power: 0, accuracy: 90, priority: 0, target: 'single', flags: [], effects: { status: 'toxic' } },
  'taunt': { id: 'taunt', name: 'Taunt', type: 'Dark', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'encore': { id: 'encore', name: 'Encore', type: 'Normal', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'helping hand': { id: 'helping hand', name: 'Helping Hand', type: 'Normal', category: 'status', power: 0, accuracy: 100, priority: 5, target: 'single', flags: [] },
  'parting shot': { id: 'parting shot', name: 'Parting Shot', type: 'Dark', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'single', flags: [], effects: { boost: { atk: -1, spa: -1 } } },
  'clear smog': { id: 'clear smog', name: 'Clear Smog', type: 'Poison', category: 'special', power: 50, accuracy: 100, priority: 0, target: 'single', flags: [] },
  'haze': { id: 'haze', name: 'Haze', type: 'Ice', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'allAdjacent', flags: [] },
  
  // Setup
  'swords dance': { id: 'swords dance', name: 'Swords Dance', type: 'Normal', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { atk: 2 } } },
  'nasty plot': { id: 'nasty plot', name: 'Nasty Plot', type: 'Dark', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { spa: 2 } } },
  'calm mind': { id: 'calm mind', name: 'Calm Mind', type: 'Psychic', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { spa: 1, spd: 1 } } },
  'bulk up': { id: 'bulk up', name: 'Bulk Up', type: 'Fighting', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { atk: 1, def: 1 } } },
  'dragon dance': { id: 'dragon dance', name: 'Dragon Dance', type: 'Dragon', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { atk: 1, spe: 1 } } },
  'quiver dance': { id: 'quiver dance', name: 'Quiver Dance', type: 'Bug', category: 'status', power: 0, accuracy: 100, priority: 0, target: 'self', flags: [], effects: { selfBoost: { spa: 1, spd: 1, spe: 1 } } },
};

export function getMoveData(moveName: string): MoveData | undefined {
  return movesDatabase[moveName.toLowerCase()];
}
