import type { PredictedAction } from '../../lib/battle/predictionEngine';
import { Brain, TrendingUp } from 'lucide-react';

interface NextTurnPredictionsProps {
  slot0Actions: PredictedAction[];
  slot1Actions: PredictedAction[];
  name0?: string;
  name1?: string;
}

function ConfidenceBar({ value }: { value: number }) {
  const color = value >= 80 ? 'bg-red-500' : value >= 60 ? 'bg-orange-500' : value >= 40 ? 'bg-yellow-500' : 'bg-gray-400';
  return (
    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${value}%` }} />
    </div>
  );
}

export default function NextTurnPredictions({ slot0Actions, slot1Actions, name0, name1 }: NextTurnPredictionsProps) {
  if (slot0Actions.length === 0 && slot1Actions.length === 0) return null;

  const renderActions = (actions: PredictedAction[], name?: string) => (
    <div className="flex-1">
      <div className="text-xs font-semibold mb-2 text-orange-400">{name || 'Opponent Slot'}</div>
      <div className="space-y-2">
        {actions.slice(0, 3).map((action, i) => (
          <div key={i} className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium">{action.action}</span>
              <span className={`text-[10px] font-bold ${action.confidence >= 70 ? 'text-orange-400' : 'text-muted-foreground'}`}>
                {action.confidence}%
              </span>
            </div>
            <ConfidenceBar value={action.confidence} />
            <p className="text-[9px] text-muted-foreground leading-tight">{action.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-card border border-orange-500/20 rounded-xl p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Brain size={16} className="text-orange-400" />
        <h3 className="text-sm font-bold">Opponent Predictions — Next Turn</h3>
        <TrendingUp size={14} className="text-muted-foreground ml-auto" />
      </div>
      <div className="flex gap-6 divide-x divide-border">
        <div className="flex-1 pr-6">
          {renderActions(slot0Actions, name0)}
        </div>
        <div className="flex-1 pl-6">
          {renderActions(slot1Actions, name1)}
        </div>
      </div>
    </div>
  );
}
