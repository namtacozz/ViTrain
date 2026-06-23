import type { TeamMember, PokemonSpecies, PokemonType } from '../../types/pokemon';
import typeChartData from '../../data/type-chart.json';
import pokemonData from '../../data/pokemon.json';

export interface TeamAnalysisResult {
  weaknesses: Record<PokemonType, number>;
  resistances: Record<PokemonType, number>;
  warnings: string[];
  suggestions: string[];
}

const ALL_TYPES = Object.keys(typeChartData) as PokemonType[];

export function analyzeTeam(team: TeamMember[]): TeamAnalysisResult {
  const result: TeamAnalysisResult = {
    weaknesses: {} as Record<PokemonType, number>,
    resistances: {} as Record<PokemonType, number>,
    warnings: [],
    suggestions: [],
  };

  ALL_TYPES.forEach(type => {
    result.weaknesses[type] = 0;
    result.resistances[type] = 0;
  });

  const activeMembers = team.filter(m => m !== null);
  if (activeMembers.length === 0) return result;

  const db = pokemonData as PokemonSpecies[];

  // Early return for empty team
  if (activeMembers.length === 0) return result;

  let protectCount = 0;
  let speedControlCount = 0;
  let fakeOutCount = 0;
  let physicalCount = 0;
  let specialCount = 0;

  activeMembers.forEach(member => {
    const species = db.find(p => p.id === member.speciesId);
    if (!species) return;

    // Calculate defensive profile based on base typing (ignoring Tera for base analysis, or we could factor Tera in if it's set)
    // For simplicity, we use base types
    const types = species.types;
    
    ALL_TYPES.forEach(attackType => {
      let multiplier = 1;
      types.forEach(defType => {
        multiplier *= (typeChartData as any)[attackType][defType] || 1;
      });

      if (multiplier > 1) {
        result.weaknesses[attackType]++;
      } else if (multiplier < 1) {
        result.resistances[attackType]++;
      }
    });

    // Check moves
    if (member.moves.includes('Protect') || member.moves.includes('Detect') || member.moves.includes('Spiky Shield')) {
      protectCount++;
    }
    if (member.moves.includes('Tailwind') || member.moves.includes('Trick Room') || member.moves.includes('Icy Wind') || member.moves.includes('Electroweb')) {
      speedControlCount++;
    }
    if (member.moves.includes('Fake Out')) {
      fakeOutCount++;
    }

    // Rough check for attacker type based on base stats (if they don't have EVs set yet)
    if (species.baseStats.atk > species.baseStats.spa + 15) {
      physicalCount++;
    } else if (species.baseStats.spa > species.baseStats.atk + 15) {
      specialCount++;
    }
  });

  // Generate warnings
  ALL_TYPES.forEach(type => {
    if (result.weaknesses[type] >= 3) {
      result.warnings.push(`3 or more Pokémon are weak to ${type}-type attacks.`);
    }
  });

  if (activeMembers.length >= 4) {
    if (protectCount < activeMembers.length / 2) {
      result.warnings.push('Consider adding Protect to more Pokémon. It is crucial in VGC double battles.');
    }
    if (speedControlCount === 0) {
      result.warnings.push('Your team lacks speed control (e.g., Tailwind, Trick Room, Icy Wind).');
    }
    if (physicalCount >= 4) {
      result.suggestions.push('Your team is very physically offensive. Watch out for Intimidate and Will-O-Wisp.');
    }
    if (fakeOutCount === 0) {
      result.suggestions.push('Consider adding a Fake Out user to help set up Tailwind or Trick Room safely.');
    }
  }

  return result;
}
