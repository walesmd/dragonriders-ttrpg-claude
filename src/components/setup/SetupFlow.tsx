import { useSetupStore } from '../../store/setupStore';
import RiderSelect from './RiderSelect';
import DragonSelect from './DragonSelect';
import DraftScreen from './DraftScreen';
import AIDifficultySelect from './AIDifficultySelect';

export default function SetupFlow() {
  const phase = useSetupStore((s) => s.phase);
  const gameMode = useSetupStore((s) => s.gameMode);

  // AI mode needs difficulty selection before rider selection
  if (gameMode === 'ai' && phase === 'p1-rider') {
    return (
      <div>
        <AIDifficultySelect />
        <RiderSelect player={1} />
      </div>
    );
  }

  switch (phase) {
    case 'p1-rider':
      return <RiderSelect player={1} />;
    case 'p2-rider':
      return <RiderSelect player={2} />;
    case 'p1-dragon':
      return <DragonSelect player={1} />;
    case 'p2-dragon':
      return <DragonSelect player={2} />;
    case 'draft':
      return <DraftScreen />;
    default:
      return <div className="text-white">Unknown phase: {phase}</div>;
  }
}
