export interface MetaPreset {
  name: string;
  item: string;
  ability: string;
  nature: string;
  moves: string[];
  evs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  usage: number; // Percentage usage in meta
}

export const metaPresets: Record<string, MetaPreset[]> = {
  'incineroar': [
    {
      name: 'Standard Support',
      item: 'Sitrus Berry',
      ability: 'Intimidate',
      nature: 'Careful',
      moves: ['Fake Out', 'Flare Blitz', 'Knock Off', 'Parting Shot'],
      evs: { hp: 36, atk: 0, def: 20, spa: 0, spd: 10, spe: 0 }, // 66 points total
      usage: 45,
    },
    {
      name: 'Assault Vest',
      item: 'Assault Vest',
      ability: 'Intimidate',
      nature: 'Adamant',
      moves: ['Fake Out', 'Flare Blitz', 'Knock Off', 'U-turn'],
      evs: { hp: 36, atk: 20, def: 0, spa: 0, spd: 0, spe: 10 },
      usage: 25,
    }
  ],
  'flutter-mane': [
    {
      name: 'Fast Sweeper',
      item: 'Booster Energy',
      ability: 'Protosynthesis',
      nature: 'Timid',
      moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Protect'],
      evs: { hp: 4, atk: 0, def: 0, spa: 31, spd: 0, spe: 31 },
      usage: 55,
    },
    {
      name: 'Choice Specs',
      item: 'Choice Specs',
      ability: 'Protosynthesis',
      nature: 'Modest',
      moves: ['Moonblast', 'Shadow Ball', 'Dazzling Gleam', 'Thunderbolt'],
      evs: { hp: 12, atk: 0, def: 12, spa: 31, spd: 0, spe: 11 },
      usage: 25,
    }
  ],
  'urshifu-rapid-strike': [
    {
      name: 'Surging Strikes',
      item: 'Mystic Water',
      ability: 'Unseen Fist',
      nature: 'Adamant',
      moves: ['Surging Strikes', 'Close Combat', 'Aqua Jet', 'Protect'],
      evs: { hp: 4, atk: 31, def: 0, spa: 0, spd: 0, spe: 31 },
      usage: 60,
    },
    {
      name: 'Choice Scarf',
      item: 'Choice Scarf',
      ability: 'Unseen Fist',
      nature: 'Adamant',
      moves: ['Surging Strikes', 'Close Combat', 'U-turn', 'Aqua Jet'],
      evs: { hp: 4, atk: 31, def: 0, spa: 0, spd: 0, spe: 31 },
      usage: 20,
    }
  ],
  'amoonguss': [
    {
      name: 'Redirection Support',
      item: 'Sitrus Berry',
      ability: 'Regenerator',
      nature: 'Relaxed',
      moves: ['Spore', 'Rage Powder', 'Pollen Puff', 'Protect'],
      evs: { hp: 31, atk: 0, def: 25, spa: 0, spd: 10, spe: 0 },
      usage: 65,
    },
    {
      name: 'Rocky Helmet',
      item: 'Rocky Helmet',
      ability: 'Regenerator',
      nature: 'Bold',
      moves: ['Spore', 'Rage Powder', 'Clear Smog', 'Protect'],
      evs: { hp: 31, atk: 0, def: 31, spa: 0, spd: 4, spe: 0 },
      usage: 25,
    }
  ],
  'rillaboom': [
    {
      name: 'Assault Vest',
      item: 'Assault Vest',
      ability: 'Grassy Surge',
      nature: 'Adamant',
      moves: ['Fake Out', 'Grassy Glide', 'Wood Hammer', 'U-turn'],
      evs: { hp: 31, atk: 25, def: 0, spa: 0, spd: 10, spe: 0 },
      usage: 50,
    },
    {
      name: 'Miracle Seed',
      item: 'Miracle Seed',
      ability: 'Grassy Surge',
      nature: 'Adamant',
      moves: ['Fake Out', 'Grassy Glide', 'Wood Hammer', 'Protect'],
      evs: { hp: 16, atk: 31, def: 0, spa: 0, spd: 0, spe: 19 },
      usage: 30,
    }
  ],
  'tornadus-incarnate': [
    {
      name: 'Tailwind Setter',
      item: 'Covert Cloak',
      ability: 'Prankster',
      nature: 'Timid',
      moves: ['Tailwind', 'Bleakwind Storm', 'Taunt', 'Protect'],
      evs: { hp: 31, atk: 0, def: 0, spa: 4, spd: 0, spe: 31 },
      usage: 70,
    }
  ],
  'ogerpon-wellspring-mask': [
    {
      name: 'Follow Me Support',
      item: 'Wellspring Mask',
      ability: 'Water Absorb',
      nature: 'Careful',
      moves: ['Ivy Cudgel', 'Horn Leech', 'Follow Me', 'Spiky Shield'],
      evs: { hp: 31, atk: 0, def: 15, spa: 0, spd: 20, spe: 0 },
      usage: 55,
    }
  ],
  'gholdengo': [
    {
      name: 'Nasty Plot',
      item: 'Leftovers',
      ability: 'Good as Gold',
      nature: 'Modest',
      moves: ['Make It Rain', 'Shadow Ball', 'Nasty Plot', 'Protect'],
      evs: { hp: 31, atk: 0, def: 0, spa: 25, spd: 0, spe: 10 },
      usage: 45,
    },
    {
      name: 'Choice Specs',
      item: 'Choice Specs',
      ability: 'Good as Gold',
      nature: 'Modest',
      moves: ['Make It Rain', 'Shadow Ball', 'Thunderbolt', 'Trick'],
      evs: { hp: 4, atk: 0, def: 0, spa: 31, spd: 0, spe: 31 },
      usage: 40,
    }
  ]
};

export function getMetaPresets(speciesId: string): MetaPreset[] {
  return metaPresets[speciesId] || [];
}
