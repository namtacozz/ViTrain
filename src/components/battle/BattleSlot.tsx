import type { BattleSlotState } from '../../lib/battle/battleState';
import type { PokemonSpecies, TeamMember } from '../../types/pokemon';
import { PokemonSprite } from '../PokemonSprite';
import { TypeBadge } from '../TypeBadge';
import { Shield, Skull } from 'lucide-react';
import pokemonData from '../../data/pokemon.json';

const pokemonDb = pokemonData as PokemonSpecies[];

interface BattleSlotProps {
  slotState: BattleSlotState;
  side: 'mine' | 'opponent';
  label: string;
  bench: (TeamMember | PokemonSpecies)[];
  onSwap: (targetId: string) => void;
  onHpChange: (newHp: number) => void;
  onToggleProtect: () => void;
  onStatusChange: (status: BattleSlotState['status']) => void;
  onFaintToggle: () => void;
  predictedItem?: string;
  predictedAbility?: string;
  predictedMoves?: string[];
  onRevealMove?: (move: string) => void;
  onRevealItem?: (item: string) => void;
}

export default function BattleSlot({
  slotState, side, label, bench, onSwap, onHpChange, onToggleProtect, onStatusChange, onFaintToggle,
  predictedItem, predictedAbility, predictedMoves, onRevealMove, onRevealItem
}: BattleSlotProps) {
  const pokemon = slotState.pokemon;
  const isMine = side === 'mine';

  if (!pokemon) {
    return (
      <div className={`w-full h-full min-h-[160px] border-2 border-dashed rounded-xl flex items-center justify-center bg-secondary/20 ${isMine ? 'border-blue-500/30' : 'border-orange-500/30'}`}>
        <span className="text-xs text-muted-foreground">Empty Slot</span>
      </div>
    );
  }

  const spec = 'speciesId' in pokemon 
    ? pokemonDb.find(p => p.id === pokemon.speciesId) 
    : pokemonDb.find(p => p.id === pokemon.id);

  if (!spec) return null;

  const hpColor = slotState.currentHpPercent > 50 ? 'bg-green-500' : slotState.currentHpPercent > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className={`relative w-full border rounded-xl p-3 shadow-sm transition-all ${isMine ? 'bg-blue-950/10 border-blue-500/30' : 'bg-orange-950/10 border-orange-500/30'} ${slotState.isFainted ? 'opacity-50 grayscale' : ''}`}>
      {/* Label Badge */}
      <span className={`absolute -top-2.5 left-3 px-2 py-0.5 rounded text-[10px] font-bold text-white shadow-sm ${isMine ? 'bg-blue-600' : 'bg-orange-600'}`}>
        {label}
      </span>

      {/* Protect Indicator */}
      {slotState.isProtected && (
        <div className="absolute top-2 right-2 text-blue-400 animate-pulse" title="Protected">
          <Shield size={16} />
        </div>
      )}

      {/* Fainted Overlay */}
      {slotState.isFainted && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <Skull size={48} className="text-red-500/70" />
        </div>
      )}

      <div className="flex gap-3">
        {/* Left: Sprite */}
        <div className="w-16 h-16 shrink-0 flex items-center justify-center bg-background/50 rounded-lg overflow-hidden relative group cursor-pointer" onClick={onFaintToggle}>
          <PokemonSprite dexNumber={spec.dexNumber} name={spec.name} className="w-14 h-14 object-contain" />
          <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-[10px] text-white font-bold text-center">
            {slotState.isFainted ? 'Revive' : 'KO'}
          </div>
        </div>

        {/* Right: Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1">
            <h4 className="font-bold text-sm truncate pr-2">{pokemon.name}</h4>
            <div className="flex gap-1 shrink-0">
              {spec.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
            </div>
          </div>
          
          {/* HP Bar */}
          <div className="space-y-1 mb-2 relative group cursor-pointer">
            <div className="flex justify-between text-[10px] font-semibold text-muted-foreground">
              <span>HP</span>
              <span>{Math.round(slotState.currentHpPercent)}%</span>
            </div>
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-300 ${hpColor}`} 
                style={{ width: `${slotState.currentHpPercent}%` }}
              />
            </div>
            {/* Simple click overlay to set HP */}
            <div className="absolute inset-x-0 bottom-0 h-2 opacity-0 group-hover:opacity-100 flex">
              {[25, 50, 75, 100].map(val => (
                <div key={val} className="flex-1 h-full hover:bg-white/30" onClick={() => onHpChange(val)} title={`Set ${val}%`} />
              ))}
              <div className="w-4 h-full hover:bg-red-500/50 absolute left-0" onClick={(e) => { e.stopPropagation(); onHpChange(0); onFaintToggle(); }} title="KO" />
            </div>
          </div>

          {/* Status & Controls Row */}
          <div className="flex flex-wrap gap-1 items-center">
            {/* Status Selector */}
            <select 
              value={slotState.status || ''} 
              onChange={(e) => onStatusChange((e.target.value || null) as BattleSlotState['status'])}
              className={`text-[10px] border rounded px-1 py-0.5 uppercase font-bold focus:outline-none ${
                slotState.status === 'burn' ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                slotState.status === 'paralysis' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' :
                slotState.status === 'sleep' ? 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30' :
                slotState.status === 'freeze' ? 'bg-cyan-500/20 text-cyan-500 border-cyan-500/30' :
                slotState.status === 'poison' || slotState.status === 'toxic' ? 'bg-purple-500/20 text-purple-500 border-purple-500/30' :
                'bg-background text-muted-foreground'
              }`}
            >
              <option value="">OK</option>
              <option value="burn">BRN</option>
              <option value="paralysis">PAR</option>
              <option value="sleep">SLP</option>
              <option value="freeze">FRZ</option>
              <option value="poison">PSN</option>
            </select>

            {/* Protect Toggle */}
            <button 
              onClick={onToggleProtect}
              className={`text-[10px] px-1.5 py-0.5 rounded border transition-colors ${slotState.isProtected ? 'bg-blue-600 text-white border-blue-600' : 'bg-background hover:bg-secondary'}`}
            >
              Protect
            </button>
            
            {/* Swap Dropdown */}
            <select
              className="text-[10px] bg-background border rounded px-1 py-0.5 ml-auto max-w-[80px] truncate"
              value=""
              onChange={(e) => onSwap(e.target.value)}
            >
              <option value="" disabled>Swap...</option>
              {bench.map(b => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>

          {/* Predictions Section (for Opponent only) */}
          {!isMine && (predictedItem || predictedAbility || (predictedMoves && predictedMoves.length > 0)) && (
            <div className="mt-2 pt-2 border-t border-orange-500/20 text-[10px] text-muted-foreground flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-orange-400">🔍 Predicted Build</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {predictedItem && <span className="px-1.5 py-0.5 bg-orange-500/10 border border-orange-500/20 rounded text-[9px]">🎒 {predictedItem}</span>}
                {predictedAbility && <span className="px-1.5 py-0.5 bg-purple-500/10 border border-purple-500/20 rounded text-[9px]">✨ {predictedAbility}</span>}
              </div>
              {predictedMoves && predictedMoves.length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="font-semibold text-[9px]">Likely Moves (click to record):</span>
                  <div className="flex flex-wrap gap-1">
                    {predictedMoves.map(m => {
                      const isRevealed = slotState.usedMoves?.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => onRevealMove?.(m)}
                          className={`px-1.5 py-0.5 rounded border text-[9px] transition-colors ${
                            isRevealed 
                              ? 'bg-green-500/20 border-green-500/40 text-green-400' 
                              : 'bg-black/20 border-white/10 hover:bg-orange-500/20 hover:border-orange-500/30'
                          }`}
                          title={isRevealed ? 'Revealed!' : 'Click when opponent uses this move'}
                        >
                          {isRevealed ? '✓ ' : ''}{m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {onRevealItem && (
                <div className="flex gap-1 items-center">
                  <span className="text-[9px]">Record item:</span>
                  <input 
                    type="text" 
                    placeholder="Type item & Enter"
                    className="flex-1 px-1 py-0.5 text-[9px] bg-background border border-border rounded focus:outline-none focus:border-orange-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value.trim();
                        if (val) { onRevealItem(val); (e.target as HTMLInputElement).value = ''; }
                      }
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
