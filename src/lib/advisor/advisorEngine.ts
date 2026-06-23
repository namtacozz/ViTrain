import type { TeamMember, PokemonSpecies } from '../../types/pokemon';
import { getTypeEffectiveness } from '../battle/matchup';
import { getPokemonById } from '../data/pokemonCache';

// Helper to get full species info
function getSpecies(id: string): PokemonSpecies | undefined {
  return getPokemonById(id);
}

export type Archetype = 'sun' | 'rain' | 'trick-room' | 'tailwind' | 'sand' | 'balance';

export interface OpponentAnalysis {
  archetype: Archetype;
  threats: string[];
  reasons: string[];
}

export interface Recommendation {
  lead: TeamMember[];
  back: TeamMember[];
  score: number;
  reasons: string[];
  turnOnePlan: string;
}

// Helper to generate combinations of k items from array
function combinations<T>(arr: T[], k: number): T[][] {
  const results: T[][] = [];
  function helper(start: number, path: T[]) {
    if (path.length === k) {
      results.push([...path]);
      return;
    }
    for (let i = start; i < arr.length; i++) {
      path.push(arr[i]!);
      helper(i + 1, path);
      path.pop();
    }
  }
  helper(0, []);
  return results;
}

// 1. Analyze Opponent Archetype & Threats
export function analyzeOpponent(opponentList: PokemonSpecies[]): OpponentAnalysis {
  const ids = opponentList.map(o => o.id);
  const threats: string[] = [];
  const reasons: string[] = [];
  let archetype: Archetype = 'balance';

  // Rain
  const hasRainSetter = ids.includes('pelipper');
  const hasRainAbuser = ids.includes('basculegion') || ids.includes('swampert') || ids.includes('archaludon');
  if (hasRainSetter && hasRainAbuser) {
    archetype = 'rain';
    reasons.push("Rain Core detected (Pelipper + Swimmers/Archaludon).");
  }

  // Sun
  const hasSunSetter = ids.includes('torkoal') || ids.includes('charizard');
  const hasSunAbuser = ids.includes('venusaur');
  if (hasSunSetter && hasSunAbuser) {
    archetype = 'sun';
    reasons.push("Sun Core detected (Charizard/Torkoal + Chlorophyll Venusaur).");
  }

  // Trick Room
  const trSetters = opponentList.filter(o => o.roleTags.includes('Trick Room setter'));
  const slowMons = opponentList.filter(o => o.baseStats.spe <= 60);
  if (trSetters.length >= 1 && slowMons.length >= 2) {
    archetype = 'trick-room';
    reasons.push(`Trick Room Setup detected (${trSetters.map(s => s.name).join('/')} + slow threats).`);
  }

  // Tailwind
  const twSetters = opponentList.filter(o => o.roleTags.includes('speed control') && o.legalMoves.includes('Tailwind'));
  if (twSetters.length >= 1 && archetype === 'balance') {
    archetype = 'tailwind';
    reasons.push(`Tailwind Offense detected (${twSetters.map(s => s.name).join('/')}).`);
  }

  // Sand
  const hasSandSetter = ids.includes('tyranitar') || ids.includes('hippowdon');
  const hasSandAbuser = ids.includes('excadrill');
  if (hasSandSetter && hasSandAbuser) {
    archetype = 'sand';
    reasons.push("Sand Core detected (Ttar/Hippo + Excadrill).");
  }

  // Specific threats identification
  opponentList.forEach(op => {
    if (op.id === 'venusaur' && archetype === 'sun') {
      threats.push("Venusaur: Chlorophyll Sleep Powder is high threat.");
    }
    if (op.id === 'kingambit') {
      threats.push("Kingambit: Supreme Overlord / Defiant late-game sweeper.");
    }
    if (op.id === 'archaludon' && archetype === 'rain') {
      threats.push("Archaludon: Electro Shot spam in Rain.");
    }
    if (op.id === 'sneasler') {
      threats.push("Sneasler: Unburden speed / Dire Claw poison/sleep.");
    }
  });

  return { archetype, threats, reasons };
}

// 2. Score Individual Pokemon against Opponent Team
export function scorePokemon(
  member: TeamMember,
  opponentList: PokemonSpecies[],
  opponentAnalysis: OpponentAnalysis
): { score: number; reasons: string[] } {
  let score = 50; // base score
  const reasons: string[] = [];
  const spec = getSpecies(member.speciesId);
  if (!spec) return { score: 0, reasons: [] };

  // Type Matchup Evaluation (Offense)
  let superEffectiveCount = 0;
  opponentList.forEach(op => {
    // Check if member has moves that hit this opponent super effectively
    let hasSEMove = false;
    member.moves.forEach(_m => {
      // Find move type from DB, if mock not available, make basic type deduction
      // We will assume some standard move types or check if it matches species STAB
      const moveType = spec.types[0]!; // fallback to primary STAB type
      if (getTypeEffectiveness(moveType, op.types) > 1) {
        hasSEMove = true;
      }
    });

    if (hasSEMove) superEffectiveCount++;
  });
  score += superEffectiveCount * 8;
  if (superEffectiveCount >= 3) {
    reasons.push(`Good offensive matchups (${spec.name} has super-effective pressure).`);
  }

  // Type Matchup Evaluation (Defense)
  let weaknessesCount = 0;
  let resistCount = 0;
  opponentList.forEach(op => {
    op.types.forEach(opType => {
      const eff = getTypeEffectiveness(opType, spec.types);
      if (eff > 1) weaknessesCount++;
      if (eff < 1) resistCount++;
    });
  });
  score -= weaknessesCount * 4;
  score += resistCount * 3;

  // Utility Checks
  const moves = member.moves.map(m => m.toLowerCase());
  
  if (moves.includes('fake out')) {
    score += 12;
    reasons.push(`${spec.name} Fake Out provides crucial turn 1 pressure.`);
  }

  if (moves.includes('tailwind')) {
    if (opponentAnalysis.archetype === 'tailwind' || opponentAnalysis.archetype === 'balance') {
      score += 15;
      reasons.push("Tailwind response to match opponent's speed control.");
    } else {
      score += 8;
    }
  }

  if (moves.includes('trick room')) {
    if (opponentAnalysis.archetype === 'trick-room') {
      score += 18;
      reasons.push("Trick Room reverse to counter enemy Trick Room.");
    } else {
      score += 5;
    }
  }

  // Weather check
  if (member.ability === 'Drizzle' || spec.abilities.includes('Drizzle')) {
    if (opponentAnalysis.archetype === 'sun') {
      score += 20;
      reasons.push("Drizzle to overwrite opponent's Sun weather.");
    }
    if (opponentAnalysis.archetype === 'sand') {
      score += 12;
      reasons.push("Drizzle to overwrite Sandstorm.");
    }
  }

  // Matchup specific logic
  if (opponentAnalysis.archetype === 'sun') {
    if (spec.types.includes('Water')) {
      // Fire moves boosted in sun makes Water/Steel types unsafe unless rain is up
      if (!member.ability?.includes('Drizzle') && !spec.abilities.includes('Drizzle')) {
        score -= 10;
        reasons.push("Water-type is vulnerable to Sun-boosted fire moves.");
      }
    }
    if (spec.types.includes('Steel') || spec.types.includes('Grass')) {
      score -= 12;
      reasons.push("Fragile to Fire-type attacks in Sun.");
    }
  }

  if (opponentAnalysis.archetype === 'trick-room') {
    // Slow pokemon are better in Trick Room
    if (spec.baseStats.spe <= 60) {
      score += 12;
      reasons.push("Bulky slow build benefits in Trick Room.");
    } else if (spec.baseStats.spe >= 100) {
      score -= 10;
      reasons.push("Fast frail build is risky against Trick Room.");
    }
  }

  return { score, reasons };
}

// 3. Score a complete group of 4 (Lead 2 + Back 2)
export function advisePick(
  myTeam: TeamMember[],
  opponentList: PokemonSpecies[]
): Recommendation[] {
  const opponentAnalysis = analyzeOpponent(opponentList);

  if (myTeam.length < 4) {
    return [];
  }

  // Generate all possible groups of 4 from my team (6 choose 4)
  const candidateGroups = combinations(myTeam, 4);
  const recommendations: Recommendation[] = [];

  candidateGroups.forEach(group => {
    // For each group, evaluate all possible lead pairs (4 choose 2)
    const leadPairs = combinations(group, 2);
    
    leadPairs.forEach(leadPair => {
      const backline = group.filter(p => !leadPair.includes(p));

      // Calculate total group score
      let totalScore = 0;
      const reasons: string[] = [];

      // Individual scores
      group.forEach(member => {
        const res = scorePokemon(member, opponentList, opponentAnalysis);
        totalScore += res.score;
        res.reasons.forEach(r => {
          if (!reasons.includes(r)) reasons.push(r);
        });
      });

      // Synergistic bonus for lead pair
      const leadNames = leadPair.map(l => l.name);
      let leadBonus = 0;
      let turnOnePlan = "Play standard defensive positioning.";

      if (leadNames.includes('Pelipper') && leadNames.includes('Incineroar')) {
        leadBonus += 15;
        if (opponentList.map(o => o.id).includes('venusaur') && opponentAnalysis.archetype === 'sun') {
          turnOnePlan = "Fake Out Venusaur to deny Sleep Powder, set Tailwind with Pelipper.";
        } else {
          turnOnePlan = "Fake Out high threat, set Tailwind to establish board control.";
        }
      }

      // Check if team has enough speed control
      const hasTailwind = group.some(m => m.moves.map(mv => mv.toLowerCase()).includes('tailwind'));
      const hasTrickRoom = group.some(m => m.moves.map(mv => mv.toLowerCase()).includes('trick room'));
      if (!hasTailwind && !hasTrickRoom && opponentAnalysis.archetype !== 'trick-room') {
        totalScore -= 10;
        reasons.push("Caution: Team lacks active speed control options.");
      }

      // Archetype specific checks
      if (opponentAnalysis.archetype === 'sun') {
        const hasRain = group.some(m => m.ability === 'Drizzle' || getSpecies(m.speciesId)?.abilities.includes('Drizzle'));
        if (hasRain) {
          totalScore += 20;
          reasons.push("Rain core included to overwrite enemy Sun weather.");
        }
      }

      // Final score adjustment
      totalScore += leadBonus;

      recommendations.push({
        lead: leadPair,
        back: backline,
        score: totalScore,
        reasons: reasons.slice(0, 4), // Top 4 reasons
        turnOnePlan
      });
    });
  });

  // Sort by score descending and return top 3
  return recommendations.sort((a, b) => b.score - a.score).slice(0, 3);
}
