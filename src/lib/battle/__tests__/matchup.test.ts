import { describe, it, expect } from 'vitest';
import { getTypeEffectiveness, getBoostMultiplier, getEffectiveSpeed } from '../matchup';

describe('matchup calculations', () => {
  describe('getTypeEffectiveness', () => {
    it('should calculate super-effective damage', () => {
      expect(getTypeEffectiveness('Water', ['Fire'])).toBe(2);
      expect(getTypeEffectiveness('Fire', ['Grass', 'Steel'])).toBe(4); // 2 * 2
    });

    it('should calculate not-very-effective damage', () => {
      expect(getTypeEffectiveness('Water', ['Water'])).toBe(0.5);
      expect(getTypeEffectiveness('Fire', ['Fire', 'Water'])).toBe(0.25); // 0.5 * 0.5
    });

    it('should calculate immune damage', () => {
      expect(getTypeEffectiveness('Electric', ['Ground'])).toBe(0);
      expect(getTypeEffectiveness('Normal', ['Ghost'])).toBe(0);
    });

    it('should calculate neutral damage', () => {
      expect(getTypeEffectiveness('Water', ['Electric'])).toBe(1);
    });
  });

  describe('getBoostMultiplier', () => {
    it('should calculate positive boost multipliers', () => {
      expect(getBoostMultiplier(1)).toBe(1.5); // +1 = 1.5x
      expect(getBoostMultiplier(2)).toBe(2);   // +2 = 2x
      expect(getBoostMultiplier(6)).toBe(4);   // +6 = 4x (max)
    });

    it('should calculate negative boost multipliers', () => {
      expect(getBoostMultiplier(-1)).toBeCloseTo(0.67, 1); // -1 ≈ 0.67x
      expect(getBoostMultiplier(-2)).toBe(0.5);            // -2 = 0.5x
      expect(getBoostMultiplier(-6)).toBe(0.25);           // -6 = 0.25x (min)
    });

    it('should return 1 for zero boost', () => {
      expect(getBoostMultiplier(0)).toBe(1);
    });
  });

  describe('getEffectiveSpeed', () => {
    it('should apply stat boosts correctly', () => {
      expect(getEffectiveSpeed(100, 1)).toBe(150); // +1 boost = 1.5x
      expect(getEffectiveSpeed(100, 2)).toBe(200); // +2 boost = 2x
    });

    it('should apply paralysis', () => {
      expect(getEffectiveSpeed(100, 0, 'paralysis')).toBe(50); // 0.5x
    });

    it('should apply weather abilities', () => {
      expect(getEffectiveSpeed(50, 0, null, 'rain', ['Swift Swim'])).toBe(100); // 2x
      expect(getEffectiveSpeed(50, 0, null, 'sun', ['Chlorophyll'])).toBe(100); // 2x
    });

    it('should apply tailwind', () => {
      expect(getEffectiveSpeed(100, 0, null, 'none', [], true)).toBe(200); // 2x
    });

    it('should stack multiple modifiers correctly', () => {
      // +1 boost + Tailwind = 1.5 * 2 = 3x
      expect(getEffectiveSpeed(100, 1, null, 'none', [], true)).toBe(300);

      // Paralysis + Tailwind = 0.5 * 2 = 1x (cancel out)
      expect(getEffectiveSpeed(100, 0, 'paralysis', 'none', [], true)).toBe(100);
    });
  });
});
