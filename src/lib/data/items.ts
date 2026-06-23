export interface ItemData {
  id: string;
  name: string;
  effect: string;
  tags: string[];
}

export const commonItems: Record<string, ItemData> = {
  // Choice Items
  'choice-scarf': { id: 'choice-scarf', name: 'Choice Scarf', effect: '1.5x Speed, but locks into first move used.', tags: ['speed', 'offense'] },
  'choice-band': { id: 'choice-band', name: 'Choice Band', effect: '1.5x Attack, but locks into first move used.', tags: ['offense'] },
  'choice-specs': { id: 'choice-specs', name: 'Choice Specs', effect: '1.5x Sp. Atk, but locks into first move used.', tags: ['offense'] },

  // Offensive Items
  'life-orb': { id: 'life-orb', name: 'Life Orb', effect: 'Boosts damage by 30%, but lose 10% max HP per attack.', tags: ['offense'] },
  'focus-sash': { id: 'focus-sash', name: 'Focus Sash', effect: 'If at full HP, survive one lethal hit with 1 HP.', tags: ['defense', 'offense'] },
  'clear-amulet': { id: 'clear-amulet', name: 'Clear Amulet', effect: 'Prevents stat drops from other Pokemon (e.g. Intimidate).', tags: ['offense', 'defense'] },
  'booster-energy': { id: 'booster-energy', name: 'Booster Energy', effect: 'Activates Protosynthesis or Quark Drive once.', tags: ['offense', 'speed'] },
  'mystic-water': { id: 'mystic-water', name: 'Mystic Water', effect: 'Boosts Water-type moves by 20%.', tags: ['offense'] },
  'miracle-seed': { id: 'miracle-seed', name: 'Miracle Seed', effect: 'Boosts Grass-type moves by 20%.', tags: ['offense'] },
  'charcoal': { id: 'charcoal', name: 'Charcoal', effect: 'Boosts Fire-type moves by 20%.', tags: ['offense'] },
  'black-glasses': { id: 'black-glasses', name: 'Black Glasses', effect: 'Boosts Dark-type moves by 20%.', tags: ['offense'] },
  'expert-belt': { id: 'expert-belt', name: 'Expert Belt', effect: 'Boosts super-effective moves by 20%.', tags: ['offense'] },
  'assault-vest': { id: 'assault-vest', name: 'Assault Vest', effect: '1.5x Sp. Def, but cannot select status moves.', tags: ['defense', 'offense'] },

  // Defensive & Recovery Items
  'sitrus-berry': { id: 'sitrus-berry', name: 'Sitrus Berry', effect: 'Restores 25% max HP when HP falls below 50%.', tags: ['recovery', 'defense'] },
  'leftovers': { id: 'leftovers', name: 'Leftovers', effect: 'Restores 1/16 max HP at the end of every turn.', tags: ['recovery', 'defense'] },
  'rocky-helmet': { id: 'rocky-helmet', name: 'Rocky Helmet', effect: 'Deals 1/6 max HP to attackers making contact.', tags: ['defense'] },
  'covert-cloak': { id: 'covert-cloak', name: 'Covert Cloak', effect: 'Protects from secondary effects of attacks (e.g. Fake Out flinch).', tags: ['defense', 'support'] },
  'safety-goggles': { id: 'safety-goggles', name: 'Safety Goggles', effect: 'Immunity to powder moves (Spore) and weather damage.', tags: ['defense', 'support'] },
  'mental-herb': { id: 'mental-herb', name: 'Mental Herb', effect: 'Cures Taunt, Encore, Torment, Disable, etc. Once.', tags: ['defense', 'support'] },

  // Berries
  'lum-berry': { id: 'lum-berry', name: 'Lum Berry', effect: 'Cures any non-volatile status condition. Once.', tags: ['recovery', 'defense'] },
  'figy-berry': { id: 'figy-berry', name: 'Figy Berry', effect: 'Restores 33% max HP when HP falls below 25%. Confuses if -Atk Nature.', tags: ['recovery', 'defense'] },
  'iapapa-berry': { id: 'iapapa-berry', name: 'Iapapa Berry', effect: 'Restores 33% max HP when HP falls below 25%. Confuses if -Def Nature.', tags: ['recovery', 'defense'] },
  'mago-berry': { id: 'mago-berry', name: 'Mago Berry', effect: 'Restores 33% max HP when HP falls below 25%. Confuses if -Spe Nature.', tags: ['recovery', 'defense'] },
  'aguav-berry': { id: 'aguav-berry', name: 'Aguav Berry', effect: 'Restores 33% max HP when HP falls below 25%. Confuses if -SpD Nature.', tags: ['recovery', 'defense'] },
  
  // Weakness Berries
  'shuca-berry': { id: 'shuca-berry', name: 'Shuca Berry', effect: 'Halves damage taken from a super-effective Ground-type attack.', tags: ['defense'] },
  'yache-berry': { id: 'yache-berry', name: 'Yache Berry', effect: 'Halves damage taken from a super-effective Ice-type attack.', tags: ['defense'] },
  'occa-berry': { id: 'occa-berry', name: 'Occa Berry', effect: 'Halves damage taken from a super-effective Fire-type attack.', tags: ['defense'] },
  'passho-berry': { id: 'passho-berry', name: 'Passho Berry', effect: 'Halves damage taken from a super-effective Water-type attack.', tags: ['defense'] },
  'rindo-berry': { id: 'rindo-berry', name: 'Rindo Berry', effect: 'Halves damage taken from a super-effective Grass-type attack.', tags: ['defense'] },
  'roseli-berry': { id: 'roseli-berry', name: 'Roseli Berry', effect: 'Halves damage taken from a super-effective Fairy-type attack.', tags: ['defense'] },
  'haban-berry': { id: 'haban-berry', name: 'Haban Berry', effect: 'Halves damage taken from a super-effective Dragon-type attack.', tags: ['defense'] },
  'colbur-berry': { id: 'colbur-berry', name: 'Colbur Berry', effect: 'Halves damage taken from a super-effective Dark-type attack.', tags: ['defense'] },
  'babiri-berry': { id: 'babiri-berry', name: 'Babiri Berry', effect: 'Halves damage taken from a super-effective Steel-type attack.', tags: ['defense'] },
  'chople-berry': { id: 'chople-berry', name: 'Chople Berry', effect: 'Halves damage taken from a super-effective Fighting-type attack.', tags: ['defense'] },

  // Miscellaneous
  'light-clay': { id: 'light-clay', name: 'Light Clay', effect: 'Extends duration of Light Screen, Reflect, and Aurora Veil to 8 turns.', tags: ['support'] },
  'eject-button': { id: 'eject-button', name: 'Eject Button', effect: 'Switches out when hit by an attack. Once.', tags: ['support', 'defense'] },
  'eject-pack': { id: 'eject-pack', name: 'Eject Pack', effect: 'Switches out when a stat is lowered. Once.', tags: ['support', 'defense'] },
  'white-herb': { id: 'white-herb', name: 'White Herb', effect: 'Restores lowered stats to normal. Once.', tags: ['support', 'defense'] },
};

export function getItemData(name: string): ItemData | undefined {
  return commonItems[name.toLowerCase().replace(/[^a-z0-9]/g, '-')];
}

export function getAllItems(): ItemData[] {
  return Object.values(commonItems).sort((a, b) => a.name.localeCompare(b.name));
}
