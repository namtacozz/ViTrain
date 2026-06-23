import typeChartData from '../data/type-chart.json';
import { TypeBadge } from '../components/TypeBadge';
import { TYPE_COLORS } from '../lib/utils/typeColors';

const types = Object.keys(typeChartData);

export default function TypeChart() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold">Type Effectiveness Chart</h2>
        <p className="text-sm text-muted-foreground">Interactive matrix for checking type matchups.</p>
      </div>

      <div className="overflow-x-auto border border-border rounded-2xl bg-card shadow-sm p-1">
        <table className="w-full text-center text-xs">
          <thead>
            <tr>
              <th className="p-2 border-b border-r border-border bg-background text-left sticky left-0 z-10">
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Defending →</span><br/>
                <span className="text-[10px] text-muted-foreground uppercase font-bold">Attacking ↓</span>
              </th>
              {types.map(t => {
                const colors = TYPE_COLORS[t] || { bg: 'bg-gray-500' };
                return (
                  <th key={t} className="p-1 border-b border-border bg-background min-w-[36px]">
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full mx-auto shadow-sm ${colors.bg}`} title={t}>
                      <span className="text-[10px] font-bold text-white uppercase">{t.substring(0, 3)}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {types.map(atkType => (
              <tr key={atkType} className="hover:bg-secondary/50 transition-colors group">
                <td className="p-2 border-r border-border font-bold text-left bg-background sticky left-0 z-10 group-hover:bg-secondary/50">
                  <TypeBadge type={atkType} size="xs" />
                </td>
                {types.map(defType => {
                  const eff = (typeChartData as any)[atkType][defType];
                  let bgClass = '';
                  let text = eff === 0.5 ? '½' : eff === 2 ? '2' : eff === 0 ? '0' : '';
                  
                  if (eff === 2) bgClass = 'bg-green-500/20 text-green-500 font-bold';
                  else if (eff === 0.5) bgClass = 'bg-red-500/20 text-red-400';
                  else if (eff === 0) bgClass = 'bg-background text-muted-foreground/20';
                  
                  return (
                    <td key={defType} className={`p-1.5 border-border border-t border-l ${bgClass}`}>
                      {text}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex gap-6 text-sm font-medium text-muted-foreground justify-center p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-green-500/20 text-green-500 font-bold flex items-center justify-center text-xs">2</span> Super Effective</div>
        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-red-500/20 text-red-400 font-bold flex items-center justify-center text-xs">½</span> Not Very Effective</div>
        <div className="flex items-center gap-2"><span className="w-5 h-5 rounded bg-background border border-border flex items-center justify-center text-xs">0</span> Immune</div>
      </div>
    </div>
  );
}
