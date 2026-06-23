import type { Team, TeamMember } from '../../types/pokemon';
import { getPokemonById } from '../data/pokemonCache';

// Input validation constants
const MAX_INPUT_LENGTH = 50000; // 50KB max
const MAX_POKEMON_NAME_LENGTH = 50;
const MAX_MOVE_NAME_LENGTH = 50;
const MAX_ABILITY_NAME_LENGTH = 50;
const MAX_ITEM_NAME_LENGTH = 50;
const VALID_SPECIES_ID_PATTERN = /^[a-z0-9-]{1,50}$/;

/**
 * Sanitize and validate input string
 */
function sanitizeInput(input: string, maxLength: number): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML/XSS chars
}

/**
 * Validate species ID exists in database
 */
function validateSpeciesId(id: string): boolean {
  return VALID_SPECIES_ID_PATTERN.test(id) && getPokemonById(id) !== undefined;
}

export function parseShowdownTeam(text: string): Team {
  // Input validation
  if (typeof text !== 'string') {
    throw new Error('Invalid input: expected string');
  }
  if (text.length > MAX_INPUT_LENGTH) {
    throw new Error(`Input too large: max ${MAX_INPUT_LENGTH} characters`);
  }

  const blocks = text.trim().split(/\n\s*\n/);

  const members: TeamMember[] = blocks
    .slice(0, 6) // Enforce max 6 pokemon early
    .map((block) => {
      const lines = block.split('\n').map(l => l.trim());
      const firstLine = lines[0] || '';

      // Parse "Species @ Item" or just "Species"
      let speciesName = firstLine;
      let item: string | undefined = undefined;
      if (firstLine.includes('@')) {
        const parts = firstLine.split('@');
        speciesName = sanitizeInput(parts[0]!, MAX_POKEMON_NAME_LENGTH);
        item = sanitizeInput(parts[1]!, MAX_ITEM_NAME_LENGTH);
      }

      // Handle Gender/Level in first line
      // Example: "Incineroar (M) @ Figy Berry" -> speciesName should be Incineroar
      if (speciesName.includes(' (')) {
        speciesName = speciesName.substring(0, speciesName.indexOf(' (')).trim();
      }

      speciesName = sanitizeInput(speciesName, MAX_POKEMON_NAME_LENGTH);

      let ability: string | undefined = undefined;
      let nature: string | undefined = undefined;
      const moves: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i]!;
        if (line.startsWith('Ability:')) {
          ability = sanitizeInput(line.replace('Ability:', '').trim(), MAX_ABILITY_NAME_LENGTH);
        } else if (line.endsWith('Nature')) {
          nature = sanitizeInput(line.replace('Nature', '').trim(), 20);
        } else if (line.startsWith('-')) {
          const move = sanitizeInput(line.replace('-', '').trim(), MAX_MOVE_NAME_LENGTH);
          if (move) moves.push(move);
        }
      }

      // Generate species ID and validate
      const speciesId = speciesName.toLowerCase().replace(/[^a-z0-9]/g, '');

      if (!speciesId || !validateSpeciesId(speciesId)) {
        throw new Error(`Invalid or unknown Pokemon: ${speciesName}`);
      }

      return {
        id: crypto.randomUUID(),
        speciesId,
        name: speciesName,
        item,
        ability,
        nature,
        moves: moves.slice(0, 4), // max 4 moves
      };
    })
    .filter(Boolean); // Remove any null entries

  if (members.length === 0) {
    throw new Error('No valid Pokemon found in import');
  }

  return {
    id: crypto.randomUUID(),
    name: `Imported Team ${new Date().toLocaleDateString()}`,
    format: 'vgc',
    pokemon: members,
    createdAt: Date.now(),
  };
}
