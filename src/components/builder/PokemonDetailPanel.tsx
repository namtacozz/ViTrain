import React from 'react';
import type { TeamMember } from '../../types/pokemon';

interface PokemonDetailPanelProps {
  pokemon: TeamMember | null;
  onUpdate: (updated: TeamMember) => void;
}

export default function PokemonDetailPanel({ pokemon, onUpdate }: PokemonDetailPanelProps) {
  if (!pokemon) {
    return (
      <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-lg">
        Select a slot to edit Pokémon details.
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2">
      <div className="grid grid-cols-2 gap-4">
        {/* Item & Ability */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Item</label>
          <input 
            type="text" 
            placeholder="e.g. Leftovers" 
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            value={pokemon.item || ''}
            onChange={(e) => onUpdate({ ...pokemon, item: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Ability</label>
          <input 
            type="text" 
            placeholder="e.g. Intimidate" 
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            value={pokemon.ability || ''}
            onChange={(e) => onUpdate({ ...pokemon, ability: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Nature</label>
          <input 
            type="text" 
            placeholder="e.g. Adamant" 
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            value={pokemon.nature || ''}
            onChange={(e) => onUpdate({ ...pokemon, nature: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Tera Type</label>
          <input 
            type="text" 
            placeholder="e.g. Normal" 
            className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
            value={pokemon.teraType || ''}
            onChange={(e) => onUpdate({ ...pokemon, teraType: e.target.value as any })}
          />
        </div>
      </div>

      {/* Moves */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Moves</label>
        <div className="grid grid-cols-1 gap-2">
          {[0, 1, 2, 3].map(i => (
            <input 
              key={i}
              type="text" 
              placeholder={`Move ${i + 1}`} 
              className="w-full px-3 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:border-primary"
              value={pokemon.moves[i] || ''}
              onChange={(e) => {
                const newMoves = [...pokemon.moves];
                newMoves[i] = e.target.value;
                onUpdate({ ...pokemon, moves: newMoves });
              }}
            />
          ))}
        </div>
      </div>

      {/* EVs & IVs simple layout for now */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">EVs</label>
        <div className="grid grid-cols-6 gap-2 text-center text-xs">
          {['hp', 'atk', 'def', 'spa', 'spd', 'spe'].map((stat) => (
            <div key={stat} className="flex flex-col gap-1">
              <span className="uppercase text-muted-foreground font-semibold">{stat}</span>
              <input 
                type="number" 
                min={0} max={252} 
                className="w-full px-1 py-1 bg-background border border-border rounded text-center focus:outline-none focus:border-primary"
                value={pokemon.evs?.[stat as keyof typeof pokemon.evs] || 0}
                onChange={(e) => {
                  const newEvs = { ...(pokemon.evs || { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }) };
                  newEvs[stat as keyof typeof newEvs] = parseInt(e.target.value) || 0;
                  onUpdate({ ...pokemon, evs: newEvs });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
