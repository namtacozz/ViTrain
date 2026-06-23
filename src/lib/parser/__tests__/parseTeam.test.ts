import { describe, it, expect } from 'vitest';
import { parseShowdownTeam } from '../parseTeam';

describe('parseShowdownTeam', () => {
  it('should parse basic Pokemon format', () => {
    const input = `Incineroar @ Figy Berry
Ability: Intimidate
- Fake Out
- Flare Blitz
- Knock Off
- Parting Shot`;

    const result = parseShowdownTeam(input);

    expect(result.pokemon).toHaveLength(1);
    expect(result.pokemon[0].name).toBe('Incineroar');
    expect(result.pokemon[0].item).toBe('Figy Berry');
    expect(result.pokemon[0].ability).toBe('Intimidate');
    expect(result.pokemon[0].moves).toEqual(['Fake Out', 'Flare Blitz', 'Knock Off', 'Parting Shot']);
  });

  it('should handle Pokemon without items', () => {
    const input = `Venusaur
Ability: Chlorophyll
- Sleep Powder
- Sludge Bomb`;

    const result = parseShowdownTeam(input);

    expect(result.pokemon[0].name).toBe('Venusaur');
    expect(result.pokemon[0].item).toBeUndefined();
    expect(result.pokemon[0].moves).toHaveLength(2);
  });

  it('should handle gender markers in names', () => {
    const input = `Incineroar (M) @ Assault Vest
- Fake Out`;

    const result = parseShowdownTeam(input);

    expect(result.pokemon[0].name).toBe('Incineroar');
    expect(result.pokemon[0].item).toBe('Assault Vest');
  });

  it('should enforce max 6 Pokemon', () => {
    const input = Array(10).fill(`Pikachu\n- Thunderbolt`).join('\n\n');

    const result = parseShowdownTeam(input);

    expect(result.pokemon.length).toBeLessThanOrEqual(6);
  });

  it('should enforce max 4 moves per Pokemon', () => {
    const input = `Pikachu
- Move1
- Move2
- Move3
- Move4
- Move5
- Move6`;

    const result = parseShowdownTeam(input);

    expect(result.pokemon[0].moves).toHaveLength(4);
  });

  it('should reject invalid input types', () => {
    expect(() => parseShowdownTeam(null as any)).toThrow('Invalid input');
    expect(() => parseShowdownTeam(123 as any)).toThrow('Invalid input');
  });

  it('should reject input that is too large', () => {
    const largeInput = 'A'.repeat(60000);
    expect(() => parseShowdownTeam(largeInput)).toThrow('Input too large');
  });

  it('should sanitize HTML/XSS characters from fields', () => {
    // Test sanitization on non-validated fields (ability, moves)
    const input = `Pikachu @ Choice<script>Band
Ability: Static<img src=x>
- Thunderbolt<script>alert('xss')</script>
- Volt Switch<style>`;

    const result = parseShowdownTeam(input);

    // Pokemon name should be valid
    expect(result.pokemon[0].name).toBe('Pikachu');
    expect(result.pokemon[0].speciesId).toBe('pikachu');

    // But other fields should have < and > stripped
    expect(result.pokemon[0].item).not.toContain('<');
    expect(result.pokemon[0].item).not.toContain('>');
    expect(result.pokemon[0].ability).not.toContain('<');
    expect(result.pokemon[0].ability).not.toContain('>');
    expect(result.pokemon[0].moves[0]).not.toContain('<');
    expect(result.pokemon[0].moves[0]).not.toContain('>');
  });

  it('should validate Pokemon species exist', () => {
    const input = `InvalidPokemonThatDoesntExist12345
- Tackle`;

    expect(() => parseShowdownTeam(input)).toThrow('Invalid or unknown Pokemon');
  });
});
