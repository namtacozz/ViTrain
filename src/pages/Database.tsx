import { useState } from 'react';
import pokemonData from '../data/pokemon.json';
import { PokemonSprite } from '../components/PokemonSprite';
import { getOfficialArtworkUrl } from '../lib/utils/sprites';
import { TypeBadge } from '../components/TypeBadge';
import { BaseStatsChart } from '../components/BaseStatsChart';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

export default function Database() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = pokemonData.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.types.some(t => t.toLowerCase().includes(query.toLowerCase())) ||
    p.roleTags.some(r => r.toLowerCase().includes(query.toLowerCase()))
  );

  const selectedPokemon = pokemonData.find(p => p.id === selectedId);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Pokémon Database</h2>
          <p className="text-sm text-muted-foreground">Explore stats, types, and roles.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, type, or role..."
            value={query}
            onChange={(e) => setSearchParams({ q: e.target.value })}
            className="w-full h-10 rounded-lg border border-border bg-card pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {filtered.map(p => (
            <button 
              key={p.id}
              onClick={() => setSelectedId(p.id)}
              className={`flex flex-col items-center p-3 rounded-xl border transition-all ${
                selectedId === p.id 
                  ? 'border-blue-500 bg-blue-500/10 glow-blue shadow-sm' 
                  : 'border-border bg-card hover:border-blue-500/50'
              }`}
            >
              <PokemonSprite dexNumber={p.dexNumber} name={p.name} size="lg" className="mb-2" />
              <span className="font-bold text-sm truncate w-full text-center">{p.name}</span>
              <div className="flex gap-1 mt-1 justify-center flex-wrap">
                {p.types.map(t => <TypeBadge key={t} type={t} size="xs" />)}
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl border-border bg-card/50">
              No Pokémon found matching "{query}".
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {selectedPokemon ? (
            <div className="sticky top-20 border border-border rounded-2xl p-6 bg-card space-y-6 shadow-sm">
              <div className="flex flex-col items-center text-center relative">
                <span className="absolute top-0 right-0 text-xs font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full border border-border">
                  #{selectedPokemon.dexNumber.toString().padStart(3, '0')}
                </span>
                <img 
                  src={getOfficialArtworkUrl(selectedPokemon.dexNumber)} 
                  alt={selectedPokemon.name}
                  className="h-32 w-32 object-contain drop-shadow-xl mb-3"
                  loading="lazy"
                />
                <h3 className="text-2xl font-bold">{selectedPokemon.name}</h3>
                <div className="flex gap-1.5 mt-2">
                  {selectedPokemon.types.map(t => <TypeBadge key={t} type={t} size="sm" />)}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-3">Base Stats</h4>
                <BaseStatsChart stats={selectedPokemon.baseStats} />
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Abilities</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPokemon.abilities.map((a, i) => (
                    <span key={i} className="bg-secondary text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border">{a}</span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-muted-foreground mb-2">Role Tags</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPokemon.roleTags.map((r, i) => (
                    <span key={i} className="text-[10px] uppercase font-bold tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-full">{r}</span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="sticky top-20 border-2 border-dashed border-border rounded-2xl p-12 text-center bg-card/50 text-muted-foreground flex flex-col items-center gap-4">
              <Search className="h-8 w-8 opacity-20" />
              <span>Select a Pokémon to view details.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
