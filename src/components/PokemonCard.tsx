import type { TeamMember } from '../types/pokemon';
import { PokemonSprite } from './PokemonSprite';
import { TypeBadge } from './TypeBadge';
import pokemonData from '../data/pokemon.json';

export function PokemonCard({ pokemon }: { pokemon: TeamMember }) {
  const spec = pokemonData.find(p => p.id === pokemon.speciesId);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 hover:border-blue-500/50 transition-all group">
      <div className="flex items-center gap-3">
        <PokemonSprite 
          dexNumber={spec?.dexNumber || 0} 
          name={pokemon.name} 
          size="lg" 
          className="group-hover:scale-110 transition-transform" 
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-foreground truncate">{pokemon.name}</h4>
          <div className="flex gap-1 mt-1">
            {spec?.types.map(t => <TypeBadge key={t} type={t} size="xs" />)}
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 truncate">
            {pokemon.item ? `@ ${pokemon.item}` : 'No Item'}
          </p>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1">
        {pokemon.moves.map((m, i) => (
          <span key={i} className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground truncate" title={m}>
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}
