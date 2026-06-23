import type { Team } from '../types/pokemon';
import typeChartData from '../data/type-chart.json';
import pokemonData from '../data/pokemon.json';
import { TypeBadge } from './TypeBadge';

const types = Object.keys(typeChartData);

export function TeamWeaknessChart({ team }: { team: Team }) {
  const weaknessCount: Record<string, number> = {};
  const resistCount: Record<string, number> = {};
  
  types.forEach(t => {
    weaknessCount[t] = 0;
    resistCount[t] = 0;
  });

  team.pokemon.forEach(p => {
    const spec = pokemonData.find(s => s.id === p.speciesId);
    if (!spec) return;
    
    types.forEach(atkType => {
      let multiplier = 1;
      spec.types.forEach(defType => {
         multiplier *= (typeChartData as any)[atkType][defType];
      });
      if (multiplier > 1) weaknessCount[atkType]++;
      if (multiplier < 1) resistCount[atkType]++;
    });
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border border-border rounded-2xl p-5 bg-card shadow-sm">
          <h4 className="font-bold text-sm mb-3 text-red-400 uppercase tracking-wider">Major Weaknesses (3+ Team)</h4>
          <div className="flex flex-wrap gap-2">
            {types.filter(t => weaknessCount[t] >= 3).length > 0 ? (
              types.filter(t => weaknessCount[t] >= 3).map(t => (
                <div key={t} className="flex items-center gap-1.5 bg-background border border-border px-2.5 py-1.5 rounded-lg shadow-sm">
                  <TypeBadge type={t} size="sm" />
                  <span className="text-xs font-bold text-red-400">×{weaknessCount[t]}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground flex items-center h-8">No major shared weaknesses. Excellent!</span>
            )}
          </div>
        </div>
        <div className="border border-border rounded-2xl p-5 bg-card shadow-sm">
          <h4 className="font-bold text-sm mb-3 text-green-500 uppercase tracking-wider">Key Resistances (3+ Team)</h4>
          <div className="flex flex-wrap gap-2">
            {types.filter(t => resistCount[t] >= 3).length > 0 ? (
              types.filter(t => resistCount[t] >= 3).map(t => (
                <div key={t} className="flex items-center gap-1.5 bg-background border border-border px-2.5 py-1.5 rounded-lg shadow-sm">
                  <TypeBadge type={t} size="sm" />
                  <span className="text-xs font-bold text-green-500">×{resistCount[t]}</span>
                </div>
              ))
            ) : (
              <span className="text-sm text-muted-foreground flex items-center h-8">No major shared resistances.</span>
            )}
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto border border-border rounded-2xl shadow-sm bg-card p-1">
        <table className="w-full text-center text-xs">
          <thead>
            <tr>
              <th className="p-3 border-b border-r border-border bg-background text-left sticky left-0 z-10 w-24">Pokémon</th>
              {types.map(t => (
                <th key={t} className="p-1 border-b border-border bg-background min-w-[28px]">
                  <span className="font-bold text-[10px] uppercase text-muted-foreground" title={t}>{t.substring(0,3)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {team.pokemon.map(p => {
              const spec = pokemonData.find(s => s.id === p.speciesId);
              if (!spec) return null;
              return (
                <tr key={p.id} className="border-b border-border hover:bg-secondary/30 group">
                  <td className="p-2 border-r border-border font-bold text-left sticky left-0 bg-background group-hover:bg-secondary/30 transition-colors truncate max-w-[100px]">
                    {p.name}
                  </td>
                  {types.map(atkType => {
                    let eff = 1;
                    spec.types.forEach(defType => {
                      eff *= (typeChartData as any)[atkType][defType];
                    });
                    
                    let bgClass = '';
                    let text = '';
                    if (eff > 1) { bgClass = 'bg-red-500/10 text-red-400 font-bold'; text = String(eff); }
                    else if (eff < 1) { bgClass = eff === 0 ? 'bg-background text-muted-foreground/20' : 'bg-green-500/10 text-green-500 font-bold'; text = eff === 0 ? '0' : '½'; }
                    
                    return <td key={atkType} className={`p-1.5 border-l border-border ${bgClass}`}>{text}</td>
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
