import React, { useState, useMemo } from 'react';
import pokemonData from '../../data/pokemon.json';
import { Search, X } from 'lucide-react';
import type { PokemonSpecies } from '../../types/pokemon';

interface PokemonSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (pokemon: PokemonSpecies) => void;
}

export default function PokemonSearchModal({ isOpen, onClose, onSelect }: PokemonSearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const allPokemon = useMemo(() => {
    return Object.values(pokemonData) as PokemonSpecies[];
  }, []);

  const filteredPokemon = useMemo(() => {
    return allPokemon.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.aliases.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 50); // limit to 50 for performance
  }, [allPokemon, searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl border border-border shadow-2xl flex flex-col h-[80vh]">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Select Pokémon</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-full">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <input 
              type="text" 
              placeholder="Search by name or alias..." 
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredPokemon.map(p => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left border border-transparent hover:border-border"
              >
                <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center border border-border overflow-hidden">
                   <img 
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.dexNumber}.png`}
                    alt={p.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                    }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-sm">{p.name}</div>
                  <div className="text-xs text-muted-foreground flex gap-1 mt-1">
                    {p.types.map(t => (
                      <span key={t} className="px-1.5 py-0.5 bg-background rounded text-[10px] uppercase border border-border">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
            {filteredPokemon.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No Pokémon found matching "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
