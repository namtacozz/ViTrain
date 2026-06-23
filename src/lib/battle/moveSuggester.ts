import type { BattleState } from './battleState';
import { getMoveData } from './moveDatabase';
import { estimateDamage, getEffectiveSpeed } from './matchup';
import type { PokemonSpecies, TeamMember } from '../../types/pokemon';
import { getPokemonById } from '../data/pokemonCache';

export interface MoveSuggestion {
  moveName: string;
  target: string;
  reason: string;
  effectiveness: number;
  estimatedDamage?: number;
  priority: 'critical' | 'recommended' | 'alternative';
  tags: string[];
}

function getSpecies(pokemon: TeamMember | PokemonSpecies): PokemonSpecies | undefined {
  if ('speciesId' in pokemon) {
    return getPokemonById(pokemon.speciesId);
  }
  return pokemon;
}

export function suggestMoves(slotIndex: 0 | 1, state: BattleState): MoveSuggestion[] {
  const suggestions: MoveSuggestion[] = [];
  const mySlot = state.mySlots[slotIndex];
  
  if (!mySlot.pokemon || mySlot.isFainted) return suggestions;

  const spec = getSpecies(mySlot.pokemon);
  if (!spec) return suggestions;

  const isFasterThanBoth = (() => {
    const mySpeed = getEffectiveSpeed(spec.baseStats.spe, mySlot.boosts.spe, mySlot.status, state.field.weather, spec.abilities, state.field.myTailwind);
    
    let isFaster = true;
    for (const oppSlot of state.oppSlots) {
      if (oppSlot.pokemon && !oppSlot.isFainted) {
        const oppSpec = getSpecies(oppSlot.pokemon);
        if (oppSpec) {
          const oppSpeed = getEffectiveSpeed(oppSpec.baseStats.spe, oppSlot.boosts.spe, oppSlot.status, state.field.weather, oppSpec.abilities, state.field.oppTailwind);
          if (state.field.trickRoom ? oppSpeed < mySpeed : oppSpeed > mySpeed) {
            isFaster = false;
          }
        }
      }
    }
    return isFaster;
  })();

  const moves = 'moves' in mySlot.pokemon ? mySlot.pokemon.moves : mySlot.pokemon.legalMoves.slice(0, 4);

  moves.forEach(moveName => {
    const moveData = getMoveData(moveName);
    if (!moveData) {
      // Fallback for unknown moves
      suggestions.push({
        moveName,
        target: 'Any',
        reason: 'Move info not in database.',
        effectiveness: 1,
        priority: 'alternative',
        tags: []
      });
      return;
    }

    // Protect Logic
    if (moveData.effects?.protect) {
      if (mySlot.isProtected) return; // Unlikely to work twice
      
      let reason = 'Safe scout or stall out field conditions.';
      let priority: 'alternative' | 'recommended' | 'critical' = 'alternative';
      
      if (!isFasterThanBoth && mySlot.currentHpPercent < 50) {
        priority = 'recommended';
        reason = 'Low HP and slower than opponent. Protect to survive.';
      }
      
      suggestions.push({
        moveName,
        target: 'Self',
        reason,
        effectiveness: 1,
        priority,
        tags: ['protect']
      });
      return;
    }

    // Fake Out Logic
    if (moveData.effects?.fakeOut) {
      if (mySlot.turnsOnField === 0 && !mySlot.usedMoves.includes(moveName)) {
        suggestions.push({
          moveName,
          target: 'Threat',
          reason: 'Turn 1 Fake Out to stop the biggest threat.',
          effectiveness: 1,
          priority: 'critical',
          tags: ['priority', 'flinch']
        });
      }
      return;
    }

    // Setup / Speed Control
    if (moveData.effects?.tailwind && !state.field.myTailwind) {
      suggestions.push({
        moveName,
        target: 'Ally Side',
        reason: 'Setup Tailwind for speed advantage.',
        effectiveness: 1,
        priority: isFasterThanBoth ? 'recommended' : 'critical',
        tags: ['setup', 'speed control']
      });
      return;
    }

    if (moveData.effects?.trickRoom) {
      suggestions.push({
        moveName,
        target: 'Field',
        reason: state.field.trickRoom ? 'Reverse Trick Room.' : 'Setup Trick Room for slow allies.',
        effectiveness: 1,
        priority: 'recommended',
        tags: ['setup', 'speed control']
      });
      return;
    }

    // Attack Logic
    if (moveData.power > 0) {
      state.oppSlots.forEach((oppSlot, oppIdx) => {
        if (!oppSlot.pokemon || oppSlot.isFainted) return;
        const oppSpec = getSpecies(oppSlot.pokemon);
        if (!oppSpec) return;

        const isSpread = moveData.flags.includes('spread');
        
        const dmgEstimate = estimateDamage(
          50,
          moveData.power,
          moveData.type,
          moveData.category as 'physical' | 'special',
          moveData.category === 'physical' ? spec.baseStats.atk : spec.baseStats.spa,
          moveData.category === 'physical' ? oppSpec.baseStats.def : oppSpec.baseStats.spd,
          moveData.category === 'physical' ? mySlot.boosts.atk : mySlot.boosts.spa,
          moveData.category === 'physical' ? oppSlot.boosts.def : oppSlot.boosts.spd,
          oppSpec.types,
          spec.types,
          state.field.weather,
          mySlot.status,
          isSpread
        );

        // Very rough % max HP estimation (assuming base stat * 2 + 75 = Max HP)
        const oppMaxHpEstimate = oppSpec.baseStats.hp * 2 + 75;
        const estimatedPercent = Math.min(100, Math.round((dmgEstimate.maxPercent / oppMaxHpEstimate) * 100));

        if (dmgEstimate.effectiveness > 0) {
          let priority: 'alternative' | 'recommended' | 'critical' = 'alternative';
          let reason = 'Solid damage output.';
          
          if (estimatedPercent >= oppSlot.currentHpPercent) {
            priority = 'critical';
            reason = 'Potential KO!';
          } else if (dmgEstimate.effectiveness > 1) {
            priority = 'recommended';
            reason = 'Super-effective damage.';
          } else if (isSpread) {
            priority = 'recommended';
            reason = 'Good spread chip damage.';
          }

          // Avoid suggesting very low damage moves
          if (estimatedPercent < 15 && priority !== 'critical') return;

          suggestions.push({
            moveName,
            target: isSpread ? 'Both Foes' : `Opponent ${oppIdx === 0 ? 'A' : 'B'} (${oppSpec.name})`,
            reason,
            effectiveness: dmgEstimate.effectiveness,
            estimatedDamage: estimatedPercent,
            priority,
            tags: isSpread ? ['spread'] : dmgEstimate.effectiveness > 1 ? ['super-effective'] : []
          });
        }
      });
    }
  });

  // Sort: Critical > Recommended > Alternative, then by estimated damage
  return suggestions.sort((a, b) => {
    const prioScore = { critical: 3, recommended: 2, alternative: 1 };
    if (prioScore[a.priority] !== prioScore[b.priority]) {
      return prioScore[b.priority] - prioScore[a.priority];
    }
    return (b.estimatedDamage || 0) - (a.estimatedDamage || 0);
  }).slice(0, 4); // Top 4 suggestions
}
