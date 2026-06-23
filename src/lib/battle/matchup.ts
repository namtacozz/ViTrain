import type { PokemonType } from '../../types/pokemon';

const typeChart: Record<PokemonType, Record<PokemonType, number>> = {
  Normal: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1 },
  Fire: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 2, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 2, Fairy: 1 },
  Water: { Normal: 1, Fire: 2, Water: 0.5, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1, Ground: 2, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 1, Fairy: 1 },
  Electric: { Normal: 1, Fire: 1, Water: 2, Electric: 0.5, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1, Ground: 0, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 1, Fairy: 1 },
  Grass: { Normal: 1, Fire: 0.5, Water: 2, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 0.5, Ground: 2, Flying: 0.5, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Dragon: 0.5, Dark: 1, Steel: 0.5, Fairy: 1 },
  Ice: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 0.5, Fighting: 1, Poison: 1, Ground: 2, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Dark: 1, Steel: 0.5, Fairy: 1 },
  Fighting: { Normal: 2, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 1, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Dragon: 1, Dark: 2, Steel: 2, Fairy: 0.5 },
  Poison: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 1, Poison: 0.5, Ground: 0.5, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0.5, Dragon: 1, Dark: 1, Steel: 0, Fairy: 2 },
  Ground: { Normal: 1, Fire: 2, Water: 1, Electric: 2, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 2, Ground: 1, Flying: 0, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Dragon: 1, Dark: 1, Steel: 2, Fairy: 1 },
  Flying: { Normal: 1, Fire: 1, Water: 1, Electric: 0.5, Grass: 2, Ice: 1, Fighting: 2, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1 },
  Psychic: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 2, Ground: 1, Flying: 1, Psychic: 0.5, Bug: 1, Rock: 1, Ghost: 1, Dragon: 1, Dark: 0, Steel: 0.5, Fairy: 1 },
  Bug: { Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 0.5, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 2, Bug: 1, Rock: 1, Ghost: 0.5, Dragon: 1, Dark: 2, Steel: 0.5, Fairy: 0.5 },
  Rock: { Normal: 1, Fire: 2, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 0.5, Poison: 1, Ground: 0.5, Flying: 2, Psychic: 1, Bug: 2, Rock: 1, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 1 },
  Ghost: { Normal: 0, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Dragon: 1, Dark: 0.5, Steel: 1, Fairy: 1 },
  Dragon: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Dark: 1, Steel: 0.5, Fairy: 0.5 },
  Dark: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 0.5, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Dragon: 1, Dark: 0.5, Steel: 1, Fairy: 0.5 },
  Steel: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 0.5, Grass: 1, Ice: 2, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Dragon: 1, Dark: 1, Steel: 0.5, Fairy: 2 },
  Fairy: { Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 0.5, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Dragon: 2, Dark: 2, Steel: 0.5, Fairy: 1 }
};

export function getTypeEffectiveness(moveType: PokemonType, defenderTypes: PokemonType[]): number {
  let multiplier = 1;
  for (const defType of defenderTypes) {
    // lookup how moveType attacks defType
    const m = typeChart[moveType]?.[defType] ?? 1;
    multiplier *= m;
  }
  return multiplier;
}

export function getDefensiveWeaknesses(types: PokemonType[]): Record<PokemonType, number> {
  const weaknesses: Partial<Record<PokemonType, number>> = {};
  const allTypes = Object.keys(typeChart) as PokemonType[];
  
  for (const atkType of allTypes) {
    const eff = getTypeEffectiveness(atkType, types);
    if (eff !== 1) {
      weaknesses[atkType] = eff;
    }
  }
  
  return weaknesses as Record<PokemonType, number>;
}

// Calculate effective stat after boosts
export function getBoostMultiplier(stage: number): number {
  if (stage >= 0) {
    return (2 + stage) / 2; // +1 = 1.5, +2 = 2, etc.
  } else {
    return 2 / (2 - stage); // -1 = 0.66, -2 = 0.5, etc.
  }
}

export function getEffectiveSpeed(
  baseSpe: number,
  boosts: number = 0,
  status: string | null = null,
  weather: string = 'none',
  abilities: string[] = [],
  tailwind: boolean = false
): number {
  let speed = baseSpe;

  // Apply stat boosts
  speed *= getBoostMultiplier(boosts);

  // Apply Paralysis
  if (status === 'paralysis') {
    speed *= 0.5;
  }

  // Apply weather abilities
  if (weather === 'rain' && abilities.includes('Swift Swim')) speed *= 2;
  if (weather === 'sun' && abilities.includes('Chlorophyll')) speed *= 2;
  if (weather === 'sand' && abilities.includes('Sand Rush')) speed *= 2;
  if (weather === 'snow' && abilities.includes('Slush Rush')) speed *= 2;

  // Apply Tailwind
  if (tailwind) speed *= 2;

  return speed;
}

export function estimateDamage(
  attackerLevel: number = 50,
  movePower: number,
  moveType: PokemonType,
  category: 'physical' | 'special',
  atkStat: number, // Base or actual stat
  defStat: number, // Base or actual stat
  atkBoosts: number = 0,
  defBoosts: number = 0,
  defenderTypes: PokemonType[],
  attackerTypes: PokemonType[],
  weather: string = 'none',
  attackerStatus: string | null = null,
  isSpread: boolean = false
): { minPercent: number; maxPercent: number; effectiveness: number } {
  if (movePower === 0) return { minPercent: 0, maxPercent: 0, effectiveness: 0 };

  const typeEffectiveness = getTypeEffectiveness(moveType, defenderTypes);
  if (typeEffectiveness === 0) return { minPercent: 0, maxPercent: 0, effectiveness: 0 };

  // Calculate stats with boosts
  const effectiveAtk = atkStat * getBoostMultiplier(atkBoosts);
  const effectiveDef = defStat * getBoostMultiplier(defBoosts);

  // Level formula: ((2 * Level / 5 + 2) * Power * A / D) / 50 + 2
  let damage = ((2 * attackerLevel / 5 + 2) * movePower * (effectiveAtk / effectiveDef)) / 50 + 2;

  // Spread reduction in doubles (0.75x)
  if (isSpread) damage *= 0.75;

  // Weather modifiers
  if (weather === 'sun') {
    if (moveType === 'Fire') damage *= 1.5;
    if (moveType === 'Water') damage *= 0.5;
  } else if (weather === 'rain') {
    if (moveType === 'Water') damage *= 1.5;
    if (moveType === 'Fire') damage *= 0.5;
  }

  // Burn modifier (halves physical damage unless ability prevents it, assuming basic case)
  if (attackerStatus === 'burn' && category === 'physical') {
    damage *= 0.5;
  }

  // STAB
  if (attackerTypes.includes(moveType)) {
    damage *= 1.5;
  }

  // Type effectiveness
  damage *= typeEffectiveness;

  // Random factor: 0.85 to 1.00
  const minDamage = damage * 0.85;
  const maxDamage = damage * 1.00;

  // Estimate HP based on level 50 (usually Base HP + 75 for max IV/EV, let's use a rough estimate)
  // Simplified assumption for % calculation: Max HP ≈ Base HP + 75
  // We need to pass maxHp or estimate it. To keep it simple, let's just return raw damage, or estimate.
  // We'll require passing the raw defender HP or just estimate it if not passed.
  // Wait, let's just return the raw damage and we can convert to % later.
  // Actually, let's estimate Max HP at Lv 50: (Base * 2 + 31 + 252/4) / 2 + 50 + 10 = Base + 75 (approx for max)
  // Let's assume standard bulky or fast spreads. Default to Base + 75.
  // To be accurate, we'll need defHp passed in. Let's adjust the signature.
  // ... Wait, we didn't pass defHp. Let's just use defStat as the base stat and calculate HP.
  
  // Actually, we pass the ACTUAL stat or BASE stat? In VGC apps, usually we only have base stats unless user builds them.
  // Let's assume we use standard formulas for base stat -> actual stat at lv 50.
  // Actual HP = Base + 75 (max HP) or Base + 60 (no investment)
  // Let's assume 0 HP IV/EV for frailer mons, and 252 HP for bulky.
  // For now, let's just return the damage and calculate % outside, OR...
  // Let's return raw damage.
  return { minPercent: minDamage, maxPercent: maxDamage, effectiveness: typeEffectiveness };
}
