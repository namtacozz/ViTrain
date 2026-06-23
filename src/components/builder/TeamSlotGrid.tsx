import React from 'react';
import type { TeamMember, PokemonSpecies } from '../../types/pokemon';
import { Plus } from 'lucide-react';
import pokemonData from '../../data/pokemon.json';

interface TeamSlotGridProps {
  team: TeamMember[];
  onSelectSlot: (index: number) => void;
  selectedIndex: number | null;
}

export default function TeamSlotGrid({ team, onSelectSlot, selectedIndex }: TeamSlotGridProps) {
  // Always render exactly 6 slots
  const slots = Array.from({ length: 6 }).map((_, i) => team[i] || null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {slots.map((member, i) => (
        <div
          key={i}
          onClick={() => onSelectSlot(i)}
          className={`
            relative flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer
            border-2 transition-all duration-200
            ${selectedIndex === i 
              ? 'border-primary bg-primary/10 shadow-[0_0_15px_rgba(var(--primary),0.3)]' 
              : 'border-border bg-card hover:border-primary/50'
            }
          `}
        >
          {member ? (
            <>
              {/* Show actual pokemon sprite */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2 overflow-hidden border border-border bg-muted/50">
                <img 
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(pokemonData as PokemonSpecies[]).find(p => p.id === member.speciesId)?.dexNumber}.png`}
                  alt={member.name}
                  className="w-14 h-14 object-contain drop-shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                  }}
                />
              </div>
              <span className="font-medium text-sm text-center line-clamp-1">{member.name}</span>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center mb-2 text-muted-foreground">
                <Plus size={24} />
              </div>
              <span className="text-sm font-medium text-muted-foreground">Add Slot {i + 1}</span>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
