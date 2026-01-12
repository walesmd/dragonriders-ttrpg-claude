import { useRef, useEffect } from 'react';
import type { LogEntry } from '../../data/types';

interface GameLogProps {
  entries: LogEntry[];
  currentTurn: number;
}

export default function GameLog({ entries, currentTurn }: GameLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [entries]);

  const formatEntry = (entry: LogEntry) => {
    const playerColor = entry.player === 1 ? 'text-blue-400' : 'text-red-400';

    return (
      <div key={`${entry.turn}-${entry.timestamp}`} className="py-1 px-2 hover:bg-gray-700/30 rounded">
        <span className={playerColor}>P{entry.player}</span>
        <span className="text-gray-400 mx-1">·</span>
        <span className="text-gray-200">{entry.action}</span>
      </div>
    );
  };

  // Group entries by turn
  const turnGroups: { turn: number; entries: LogEntry[] }[] = [];
  let currentGroup: { turn: number; entries: LogEntry[] } | null = null;

  for (const entry of entries) {
    if (!currentGroup || currentGroup.turn !== entry.turn) {
      currentGroup = { turn: entry.turn, entries: [] };
      turnGroups.push(currentGroup);
    }
    currentGroup.entries.push(entry);
  }

  return (
    <div className="bg-gray-800 rounded-xl h-full flex flex-col">
      <div className="p-3 border-b border-gray-700">
        <h3 className="font-bold text-white">Game Log</h3>
        <span className="text-xs text-gray-400">Turn {currentTurn}</span>
      </div>

      <div
        ref={scrollRef}
        className="flex-grow overflow-y-auto p-2 text-sm font-mono"
      >
        {turnGroups.map((group) => (
          <div key={group.turn} className="mb-2">
            <div className="text-xs text-gray-500 uppercase tracking-wide mb-1 px-2">
              Turn {group.turn}
            </div>
            {group.entries.map(formatEntry)}
          </div>
        ))}

        {entries.length === 0 && (
          <div className="text-gray-500 italic p-2">No actions yet...</div>
        )}
      </div>
    </div>
  );
}
