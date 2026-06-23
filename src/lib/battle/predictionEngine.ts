import type { BattleState, BattleSlotState } from './battleState';
import pokemonData from '../../data/pokemon.json';
import { metaPresets } from '../data/metaPresets';
import type { PokemonSpecies } from '../../types/pokemon';

// Types
export interface OpponentMemory {
  revealedMoves: Record<string, string[]>;
  revealedItem: Record<string, string>;
  revealedAbility: Record<string, string>;
}

export interface PredictedAction {
  action: string;
  confidence: number; // 0-100
  reason: string;
}

const db = pokemonData as PokemonSpecies[];

/**
 * Guesses the opponent's build (moves, item, ability) based on the meta and what they have revealed.
 */
export function guessOpponentBuild(speciesId: string, memory: OpponentMemory) {
  const revealedMoves = memory.revealedMoves[speciesId] || [];
  const revealedItem = memory.revealedItem[speciesId];
  const revealedAbility = memory.revealedAbility[speciesId];
  
  const species = db.find(p => p.id === speciesId);
  if (!species) return null;

  // Use most-used preset (sorted by usage desc, first entry)
  const speciesPresets = metaPresets[speciesId] || [];
  const topPreset = speciesPresets.sort((a, b) => (b.usage || 0) - (a.usage || 0))[0];
  
  const metaMoves: string[] = topPreset?.moves || species.legalMoves.slice(0, 4) || [];
  const metaItem: string = topPreset?.item || 'Focus Sash';
  const metaAbility: string = topPreset?.ability || species.abilities[0] || 'Unknown';

  return {
    likelyMoves: Array.from(new Set([...revealedMoves, ...metaMoves])).slice(0, 4),
    likelyItem: revealedItem || metaItem,
    likelyAbility: revealedAbility || metaAbility,
  };
}

/**
 * Predicts the most likely actions the opponent will take on the current turn.
 */
export function predictNextActions(state: BattleState, memory: OpponentMemory): { slot0: PredictedAction[], slot1: PredictedAction[] } {
  const predictions = {
    slot0: [] as PredictedAction[],
    slot1: [] as PredictedAction[]
  };

  const analyzeSlot = (slot: BattleSlotState, oppSlotIndex: 0 | 1) => {
    if (!slot.pokemon || slot.isFainted) return [];

    const preds: PredictedAction[] = [];
    const speciesId = slot.pokemon.id;
    const build = guessOpponentBuild(speciesId, memory);
    if (!build) return preds;

    const moves = build.likelyMoves;

    // Fake Out prediction (Turn 1 only)
    if (moves.includes('Fake Out') && slot.turnsOnField === 0) {
      preds.push({
        action: 'Fake Out',
        confidence: 90,
        reason: 'First turn on field and has Fake Out.'
      });
    }

    // Protect prediction (if they didn't protect last turn and are threatened)
    if (moves.includes('Protect') || moves.includes('Detect')) {
      if (!slot.isProtected) {
        // Ideally we check if my slots threaten them
        preds.push({
          action: 'Protect',
          confidence: 40,
          reason: 'Common defensive play, especially if threatened.'
        });
      }
    }

    // Speed control prediction
    if (moves.includes('Tailwind') && !state.field.oppTailwind) {
      preds.push({
        action: 'Tailwind',
        confidence: 75,
        reason: 'Tailwind is not active on their side.'
      });
    }
    if (moves.includes('Trick Room') && !state.field.trickRoom) {
      preds.push({
        action: 'Trick Room',
        confidence: 70,
        reason: 'Trick Room is not active.'
      });
    }

    // Spore / Sleep powder
    if (moves.includes('Spore') || moves.includes('Sleep Powder')) {
      preds.push({
        action: 'Spore/Sleep Powder',
        confidence: 60,
        reason: 'Strong status control move.'
      });
    }

    // General Attack
    preds.push({
      action: 'Attack',
      confidence: 50,
      reason: 'Use strong STAB move.'
    });

    return preds.sort((a, b) => b.confidence - a.confidence);
  };

  predictions.slot0 = analyzeSlot(state.oppSlots[0], 0);
  predictions.slot1 = analyzeSlot(state.oppSlots[1], 1);

  return predictions;
}
