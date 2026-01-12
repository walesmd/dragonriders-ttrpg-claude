import type { AIDifficulty, DragonName } from '../data/types';

export interface AIConfig {
  randomness: number;
  aggression: number;
  riderFocus: number;
}

export const DIFFICULTY_PRESETS: Record<AIDifficulty, AIConfig> = {
  easy: { randomness: 15, aggression: 0.5, riderFocus: 0.3 },
  medium: { randomness: 8, aggression: 0.6, riderFocus: 0.4 },
  hard: { randomness: 3, aggression: 0.7, riderFocus: 0.5 },
  expert: { randomness: 0, aggression: 0.7, riderFocus: 0.5 },
};

export function getDragonAIModifiers(dragonName: DragonName): Partial<AIConfig> {
  switch (dragonName) {
    case 'Voidmaw':
      return { aggression: 0.8 };
    case 'Emberfang':
      return { aggression: 0.6 };
    case 'Cryowyrm':
      return { aggression: 0.5 };
    case 'Steelhorn':
      return { aggression: 0.4 };
    case 'Voltwing':
      return { aggression: 0.8 };
    default:
      return {};
  }
}

export function getAIConfig(difficulty: AIDifficulty, dragonName: DragonName): AIConfig {
  const base = { ...DIFFICULTY_PRESETS[difficulty] };
  const modifiers = getDragonAIModifiers(dragonName);
  return { ...base, ...modifiers };
}
