import type { Team } from '../types/pokemon';
import pokemonData from '../data/pokemon.json';
import { PokemonSprite } from './PokemonSprite';

export function SpeedTierChart({ team }: { team: Team }) {
  const speeds = team.pokemon.map(p => {
    const spec = pokemonData.find(s => s.id === p.speciesId);
    return {
      name: p.name,
      baseSpe: spec?.baseStats.spe || 0,
      dexNumber: spec?.dexNumber || 0
    }
  }).sort((a, b) => b.baseSpe - a.baseSpe);

  return (
    <div className="space-y-4 animate-fade-in p-4 bg-card rounded-2xl border border-border shadow-sm">
      <h3 className="font-bold text-lg mb-6 text-center">Base Speed Tiers</h3>
      <div className="relative border-l-2 border-border ml-[60px] space-y-6 py-4 max-w-sm mx-auto">
        {speeds.map((s, i) => (
          <div key={i} className="relative flex items-center group">
            <div className="absolute -left-[54px] font-mono font-bold text-sm w-10 text-right text-muted-foreground group-hover:text-foreground transition-colors">
              {s.baseSpe}
            </div>
            <div className="absolute -left-2 w-3.5 h-3.5 rounded-full bg-blue-500 ring-4 ring-background shadow-sm" />
            <div className="ml-6 bg-background border border-border rounded-xl p-2.5 flex items-center gap-4 pr-6 shadow-sm group-hover:border-blue-500/50 transition-colors w-full">
              <PokemonSprite dexNumber={s.dexNumber} name={s.name} size="sm" />
              <span className="font-bold text-sm">{s.name}</span>
            </div>
          </div>
        ))}
        {speeds.length === 0 && (
          <div className="text-muted-foreground text-center text-sm py-4 ml-6">
            Add Pokémon to see speed tiers.
          </div>
        )}
      </div>
    </div>
  );
}
