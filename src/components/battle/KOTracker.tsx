import type { TeamMember, PokemonSpecies } from '../../types/pokemon';
import { PokemonSprite } from '../PokemonSprite';
import pokemonData from '../../data/pokemon.json';

const pokemonDb = pokemonData as PokemonSpecies[];

interface KOTrackerProps {
  myTeam: TeamMember[];
  myFainted: TeamMember[];
  oppTeam: PokemonSpecies[];
  oppFainted: PokemonSpecies[];
}

export default function KOTracker({ myTeam, myFainted, oppTeam, oppFainted }: KOTrackerProps) {
  const renderTeam = (fullTeam: (TeamMember | PokemonSpecies)[], fainted: (TeamMember | PokemonSpecies)[], side: 'mine' | 'opp') => {
    const isOpp = side === 'opp';

    // Create an array of size totalCount. For each slot, determine if it's filled, fainted, or unknown.
    // Since opponent team might not be fully known initially, we just show empty balls for unknown slots.
    
    // For simplicity, we just use the known team length or max 6.
    const displayCount = Math.max(fullTeam.length, 4);

    return (
      <div className={`flex gap-1 ${isOpp ? 'flex-row-reverse' : 'flex-row'}`}>
        {Array.from({ length: displayCount }).map((_, i) => {
          const p = fullTeam[i];
          const isFaint = p && fainted.some(f => f.id === p.id);
          
          return (
            <div 
              key={i} 
              className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                !p ? 'border-dashed border-muted-foreground/30 bg-secondary/10' :
                isFaint ? 'border-red-500/50 bg-red-950/20 grayscale opacity-50' :
                isOpp ? 'border-orange-500/50 bg-orange-950/20' : 'border-blue-500/50 bg-blue-950/20'
              }`}
            >
              {p && (() => {
                const spec = 'speciesId' in p ? pokemonDb.find(s => s.id === p.speciesId) : pokemonDb.find(s => s.id === p.id);
                if (!spec) return null;
                return (
                  <PokemonSprite 
                    dexNumber={spec.dexNumber}
                    name={'speciesId' in p ? p.name : p.name} 
                    className="w-8 h-8 object-contain scale-[1.5]" 
                  />
                );
              })()}
            </div>
          );
        })}
      </div>
    );
  };

  const myAlive = Math.max(0, myTeam.length - myFainted.length);
  const oppAlive = Math.max(0, oppTeam.length - oppFainted.length);

  return (
    <div className="border rounded-xl bg-card p-3 shadow-sm">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-xs text-muted-foreground uppercase tracking-wider">Scoreboard</h3>
        <div className="font-mono font-bold text-lg">
          <span className="text-blue-500">{myAlive}</span>
          <span className="text-muted-foreground mx-1">-</span>
          <span className="text-orange-500">{oppAlive}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        {renderTeam(myTeam, myFainted, 'mine')}
        <div className="text-[10px] text-muted-foreground font-bold px-2">VS</div>
        {renderTeam(oppTeam, oppFainted, 'opp')}
      </div>
    </div>
  );
}
