import pokemonData from '../../data/pokemon.json';
import type { PokemonSpecies } from '../../types/pokemon';

// Create optimized Map for O(1) Pokemon lookups instead of O(n) array.find()
const pokemonDb = pokemonData as PokemonSpecies[];
export const pokemonMap = new Map<string, PokemonSpecies>(
  pokemonDb.map(p => [p.id, p])
);

/**
 * Get Pokemon species by ID - O(1) lookup
 * @param id - Pokemon species ID
 * @returns PokemonSpecies or undefined if not found
 */
export function getPokemonById(id: string): PokemonSpecies | undefined {
  return pokemonMap.get(id);
}

/**
 * Get all Pokemon as array (for cases where full list is needed)
 */
export function getAllPokemon(): PokemonSpecies[] {
  return pokemonDb;
}
