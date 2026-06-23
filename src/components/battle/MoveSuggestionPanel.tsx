import type { MoveSuggestion } from '../../lib/battle/moveSuggester';
import { Target, Zap, Shield, Sparkles } from 'lucide-react';

interface MoveSuggestionPanelProps {
  suggestionsA: MoveSuggestion[];
  suggestionsB: MoveSuggestion[];
  nameA?: string;
  nameB?: string;
}

export default function MoveSuggestionPanel({ suggestionsA, suggestionsB, nameA, nameB }: MoveSuggestionPanelProps) {
  const renderSuggestions = (suggestions: MoveSuggestion[], name?: string) => (
    <div className="flex-1 space-y-3">
      <h3 className="font-bold text-sm flex items-center gap-2 border-b border-border pb-2">
        <Sparkles size={16} className="text-blue-500" /> 
        Suggestions for {name || 'Slot'}
      </h3>
      
      {suggestions.length === 0 ? (
        <p className="text-xs text-muted-foreground italic">No suggestions available.</p>
      ) : (
        <div className="space-y-2">
          {suggestions.map((sug, idx) => {
            const prioColors = {
              critical: 'bg-red-500/10 border-red-500/30 ring-1 ring-red-500/50',
              recommended: 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/30',
              alternative: 'bg-secondary border-transparent'
            };
            const iconColor = sug.priority === 'critical' ? 'text-red-500' : sug.priority === 'recommended' ? 'text-blue-500' : 'text-muted-foreground';

            return (
              <div key={idx} className={`p-2.5 rounded-lg border transition-all ${prioColors[sug.priority]}`}>
                <div className="flex justify-between items-start mb-1.5">
                  <div className="font-bold text-sm capitalize flex items-center gap-1.5">
                    {sug.tags.includes('protect') ? <Shield size={14} className={iconColor} /> : <Zap size={14} className={iconColor} />}
                    {sug.moveName}
                  </div>
                  {sug.estimatedDamage !== undefined && (
                    <span className="text-[10px] font-bold bg-background px-1.5 py-0.5 rounded text-foreground">
                      ~{sug.estimatedDamage}%
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground mb-1.5">
                  <Target size={12} /> <span className="font-medium">{sug.target}</span>
                  {sug.effectiveness > 1 && <span className="ml-2 text-green-500 font-bold">SE!</span>}
                  {sug.effectiveness < 1 && sug.effectiveness > 0 && <span className="ml-2 text-red-400 font-bold">NVE</span>}
                  {sug.tags.includes('spread') && <span className="ml-2 bg-blue-900 text-blue-200 px-1 rounded">Spread</span>}
                  {sug.tags.includes('priority') && <span className="ml-2 bg-yellow-900 text-yellow-200 px-1 rounded">+Prio</span>}
                </div>

                <p className="text-xs text-foreground/80 leading-snug">
                  {sug.reason}
                </p>
                
                {sug.estimatedDamage !== undefined && (
                  <div className="mt-2 h-1 w-full bg-background rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${sug.estimatedDamage >= 100 ? 'bg-red-500' : 'bg-green-500'}`} 
                      style={{ width: `${Math.min(100, sug.estimatedDamage)}%` }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-6">
      {renderSuggestions(suggestionsA, nameA)}
      <div className="hidden md:block w-px bg-border my-2" />
      {renderSuggestions(suggestionsB, nameB)}
    </div>
  );
}
