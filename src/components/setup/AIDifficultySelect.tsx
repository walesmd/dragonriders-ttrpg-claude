import { useSetupStore } from '../../store/setupStore';
import type { AIDifficulty } from '../../data/types';

const DIFFICULTIES: { value: AIDifficulty; label: string; description: string }[] = [
  { value: 'easy', label: 'Easy', description: 'High randomness, forgiving mistakes' },
  { value: 'medium', label: 'Medium', description: 'Balanced play, some randomness' },
  { value: 'hard', label: 'Hard', description: 'Strong play, minimal randomness' },
  { value: 'expert', label: 'Expert', description: 'Optimal play, no mercy' },
];

export default function AIDifficultySelect() {
  const aiDifficulty = useSetupStore((s) => s.aiDifficulty);
  const setAIDifficulty = useSetupStore((s) => s.setAIDifficulty);

  return (
    <div className="bg-gray-800/50 rounded-xl p-4 mb-8 max-w-md mx-auto">
      <h3 className="text-white font-bold mb-3 text-center">AI Difficulty</h3>
      <div className="grid grid-cols-2 gap-2">
        {DIFFICULTIES.map((diff) => (
          <button
            key={diff.value}
            onClick={() => setAIDifficulty(diff.value)}
            className={`
              p-3 rounded-lg text-left transition-all
              ${aiDifficulty === diff.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
            `}
          >
            <div className="font-bold">{diff.label}</div>
            <div className="text-xs opacity-70">{diff.description}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
