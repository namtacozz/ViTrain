import type { FieldState } from '../../lib/battle/battleState';
import { CloudRain, Sun, Wind, CloudSnow, RefreshCw } from 'lucide-react';

interface FieldConditionBarProps {
  field: FieldState;
  onUpdateField: (updates: Partial<FieldState>) => void;
}

export default function FieldConditionBar({ field, onUpdateField }: FieldConditionBarProps) {
  const toggleWeather = (w: FieldState['weather']) => {
    onUpdateField({ 
      weather: field.weather === w ? 'none' : w,
      weatherTurns: field.weather === w ? 0 : 5
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-secondary/20 rounded-lg border border-border/50">
      
      {/* Weather */}
      <div className="flex bg-background rounded border overflow-hidden">
        <button 
          onClick={() => toggleWeather('sun')}
          className={`px-2 py-1 flex items-center gap-1 transition-colors ${field.weather === 'sun' ? 'bg-orange-500 text-white' : 'hover:bg-secondary'}`}
          title="Sun"
        ><Sun size={14} /></button>
        <button 
          onClick={() => toggleWeather('rain')}
          className={`px-2 py-1 flex items-center gap-1 transition-colors ${field.weather === 'rain' ? 'bg-blue-500 text-white' : 'hover:bg-secondary'}`}
          title="Rain"
        ><CloudRain size={14} /></button>
        <button 
          onClick={() => toggleWeather('sand')}
          className={`px-2 py-1 flex items-center gap-1 font-bold text-xs transition-colors ${field.weather === 'sand' ? 'bg-yellow-700 text-white' : 'hover:bg-secondary'}`}
          title="Sandstorm"
        >SS</button>
        <button 
          onClick={() => toggleWeather('snow')}
          className={`px-2 py-1 flex items-center gap-1 transition-colors ${field.weather === 'snow' ? 'bg-cyan-300 text-black' : 'hover:bg-secondary'}`}
          title="Snow"
        ><CloudSnow size={14} /></button>
        {field.weather !== 'none' && (
          <div className="px-2 py-1 text-[10px] font-bold bg-secondary flex items-center border-l">
            {field.weatherTurns}T
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Speed Controls */}
      <div className="flex gap-1">
        <button 
          onClick={() => onUpdateField({ myTailwind: !field.myTailwind, myTailwindTurns: !field.myTailwind ? 4 : 0 })}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 border transition-colors ${field.myTailwind ? 'bg-blue-600 border-blue-600 text-white' : 'bg-background hover:bg-secondary'}`}
        >
          <Wind size={12} /> My TW {field.myTailwind && `(${field.myTailwindTurns})`}
        </button>
        
        <button 
          onClick={() => onUpdateField({ trickRoom: !field.trickRoom, trickRoomTurns: !field.trickRoom ? 5 : 0 })}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 border transition-colors ${field.trickRoom ? 'bg-purple-600 border-purple-600 text-white' : 'bg-background hover:bg-secondary'}`}
        >
          <RefreshCw size={12} /> TR {field.trickRoom && `(${field.trickRoomTurns})`}
        </button>

        <button 
          onClick={() => onUpdateField({ oppTailwind: !field.oppTailwind, oppTailwindTurns: !field.oppTailwind ? 4 : 0 })}
          className={`px-2 py-1 rounded text-xs flex items-center gap-1 border transition-colors ${field.oppTailwind ? 'bg-orange-600 border-orange-600 text-white' : 'bg-background hover:bg-secondary'}`}
        >
          <Wind size={12} /> Opp TW {field.oppTailwind && `(${field.oppTailwindTurns})`}
        </button>
      </div>

    </div>
  );
}
