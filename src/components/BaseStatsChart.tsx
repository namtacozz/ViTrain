import { StatBar } from './StatBar';

interface BaseStats {
  hp: number; atk: number; def: number; spa: number; spd: number; spe: number;
}

export function BaseStatsChart({ stats }: { stats: BaseStats }) {
  const total = stats.hp + stats.atk + stats.def + stats.spa + stats.spd + stats.spe;
  
  return (
    <div className="space-y-2 w-full">
      <StatBar label="HP" value={stats.hp} colorClass="bg-[#FF5959]" />
      <StatBar label="Atk" value={stats.atk} colorClass="bg-[#F5AC78]" />
      <StatBar label="Def" value={stats.def} colorClass="bg-[#FAE078]" />
      <StatBar label="SpA" value={stats.spa} colorClass="bg-[#9DB7F5]" />
      <StatBar label="SpD" value={stats.spd} colorClass="bg-[#A7DB8D]" />
      <StatBar label="Spe" value={stats.spe} colorClass="bg-[#FA92B2]" />
      <div className="pt-2 mt-2 border-t border-border flex justify-between text-sm font-bold">
        <span className="text-muted-foreground">TOTAL</span>
        <span>{total}</span>
      </div>
    </div>
  );
}
