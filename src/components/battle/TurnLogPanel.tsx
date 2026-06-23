import type { TurnLogEntry } from '../../lib/battle/battleState';
import { Clock, Undo2, Swords, RefreshCw, Skull, Wind, Shield } from 'lucide-react';

interface TurnLogPanelProps {
  logs: TurnLogEntry[];
  onUndoLast: () => void;
}

export default function TurnLogPanel({ logs, onUndoLast }: TurnLogPanelProps) {
  // Group logs by turn
  const logsByTurn = logs.reduce((acc, log) => {
    if (!acc[log.turnNumber]) acc[log.turnNumber] = [];
    acc[log.turnNumber]!.push(log);
    return acc;
  }, {} as Record<number, TurnLogEntry[]>);

  const turns = Object.keys(logsByTurn).map(Number).sort((a, b) => b - a);

  const getActionIcon = (action: TurnLogEntry['action']) => {
    switch (action) {
      case 'attack': return <Swords size={14} />;
      case 'switch': return <RefreshCw size={14} />;
      case 'faint': return <Skull size={14} className="text-red-500" />;
      case 'field':
      case 'weather': return <Wind size={14} className="text-blue-400" />;
      case 'protect': return <Shield size={14} className="text-blue-500" />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="border rounded-xl bg-card flex flex-col h-full max-h-[400px]">
      <div className="p-3 border-b flex justify-between items-center bg-secondary/30 rounded-t-xl">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <Clock size={16} /> Battle Log
        </h3>
        <button 
          onClick={onUndoLast}
          disabled={logs.length === 0}
          className="text-[10px] flex items-center gap-1 bg-background hover:bg-secondary border px-2 py-1 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Undo2 size={12} /> Undo
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-3 space-y-4 text-sm scrollbar-thin">
        {turns.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-8 italic">No actions recorded yet.</p>
        ) : (
          turns.map(turn => (
            <div key={turn} className="space-y-2">
              <div className="sticky top-0 bg-card py-1 z-10 text-xs font-bold text-muted-foreground border-b border-dashed border-border/50">
                Turn {turn}
              </div>
              <div className="space-y-1.5 pl-2">
                {logsByTurn[turn]!.sort((a, b) => b.timestamp - a.timestamp).map(log => (
                  <div key={log.timestamp} className="flex gap-2 items-start text-xs group">
                    <div className={`mt-0.5 shrink-0 ${log.side === 'mine' ? 'text-blue-400' : log.side === 'opponent' ? 'text-orange-400' : 'text-zinc-400'}`}>
                      {getActionIcon(log.action)}
                    </div>
                    <div>
                      <span className="font-semibold text-foreground/90">{log.actor}</span>
                      {log.target && <span className="text-muted-foreground"> → {log.target}</span>}
                      <span className="text-muted-foreground ml-1">- {log.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
