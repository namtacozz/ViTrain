import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface OpponentMemoryPanelProps {
  memory: {
    revealedMoves: Record<string, string[]>;
    revealedItem: Record<string, string>;
    revealedAbility: Record<string, string>;
  };
  oppTeamNames: Record<string, string>; // speciesId -> name
}

export default function OpponentMemoryPanel({ memory, oppTeamNames }: OpponentMemoryPanelProps) {
  const hasData = Object.keys(memory.revealedMoves).length > 0 || 
                  Object.keys(memory.revealedItem).length > 0 ||
                  Object.keys(memory.revealedAbility).length > 0;

  if (!hasData) {
    return (
      <div className="border rounded-xl bg-card p-4">
        <div className="flex items-center gap-2 mb-3">
          <Eye size={16} className="text-orange-400" />
          <h3 className="font-bold text-sm">Opponent Intel</h3>
        </div>
        <p className="text-xs text-muted-foreground italic text-center py-4">
          No moves or items recorded yet.<br/>
          Click predicted moves on opponent cards to reveal them.
        </p>
      </div>
    );
  }

  // Gather all speciesIds with any data
  const allSpecies = Array.from(new Set([
    ...Object.keys(memory.revealedMoves),
    ...Object.keys(memory.revealedItem),
    ...Object.keys(memory.revealedAbility),
  ]));

  return (
    <div className="border rounded-xl bg-card overflow-hidden">
      <div className="p-3 border-b flex items-center gap-2 bg-orange-950/20">
        <Eye size={16} className="text-orange-400" />
        <h3 className="font-bold text-sm">Opponent Intel</h3>
        <span className="ml-auto text-[10px] text-orange-400/70 font-medium">
          {Object.values(memory.revealedMoves).reduce((sum, m) => sum + m.length, 0)} moves recorded
        </span>
      </div>
      <div className="p-3 space-y-4">
        {allSpecies.map(speciesId => {
          const moves = memory.revealedMoves[speciesId] || [];
          const item = memory.revealedItem[speciesId];
          const ability = memory.revealedAbility[speciesId];
          const name = oppTeamNames[speciesId] || speciesId;

          return (
            <div key={speciesId} className="space-y-2">
              <div className="text-xs font-bold text-orange-300">{name}</div>
              {(item || ability) && (
                <div className="flex flex-wrap gap-1">
                  {item && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded">
                      🎒 {item}
                    </span>
                  )}
                  {ability && (
                    <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded">
                      ✨ {ability}
                    </span>
                  )}
                </div>
              )}
              {moves.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {moves.map(m => (
                    <span key={m} className="text-[9px] px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded font-medium">
                      ✓ {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
