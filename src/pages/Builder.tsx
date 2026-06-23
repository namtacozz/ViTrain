import React, { useState } from 'react';
import type { TeamMember, PokemonSpecies } from '../types/pokemon';
import TeamSlotGrid from '../components/builder/TeamSlotGrid';
import PokemonSearchModal from '../components/builder/PokemonSearchModal';
import PokemonDetailPanel from '../components/builder/PokemonDetailPanel';
import TeamAnalysis from '../components/builder/TeamAnalysis';
import pokemonData from '../data/pokemon.json';
import { saveTeam } from '../lib/db/localTeams';
import { useNavigate } from 'react-router-dom';
import { Save, Trash2, PlusCircle } from 'lucide-react';

export default function Builder() {
  const navigate = useNavigate();
  const [team, setTeam] = useState<(TeamMember | null)[]>(Array(6).fill(null));
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [teamName, setTeamName] = useState('My VGC Team');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const handleSelectSlot = (index: number) => {
    setSelectedIndex(index);
    if (!team[index]) {
      setIsSearchOpen(true);
    }
  };

  const handleSelectPokemon = (pokemon: PokemonSpecies) => {
    if (selectedIndex !== null) {
      const newTeam = [...team];
      newTeam[selectedIndex] = {
        id: crypto.randomUUID(),
        speciesId: pokemon.id,
        name: pokemon.name,
        moves: [],
        evs: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
        ivs: { hp: 31, atk: 31, def: 31, spa: 31, spd: 31, spe: 31 },
      };
      setTeam(newTeam);
    }
    setIsSearchOpen(false);
  };

  const handleUpdatePokemon = (updatedPokemon: TeamMember) => {
    if (selectedIndex !== null) {
      const newTeam = [...team];
      newTeam[selectedIndex] = updatedPokemon;
      setTeam(newTeam);
    }
  };

  const handleClearSlot = (index: number) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
    if (selectedIndex === index) setSelectedIndex(null);
  };

  const handleSaveTeam = async () => {
    const activeMembers = team.filter(Boolean) as TeamMember[];
    if (activeMembers.length === 0) return;
    setSaveStatus('saving');
    try {
      const id = crypto.randomUUID();
      await saveTeam({
        id,
        name: teamName,
        format: 'VGC',
        pokemon: activeMembers,
        createdAt: Date.now(),
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save team:', err);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Smart Team Builder</h1>
          <p className="text-muted-foreground mt-1">Build and analyze your VGC team.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name..."
            className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:border-primary w-40"
          />
          <button
            onClick={handleSaveTeam}
            disabled={saveStatus === 'saving' || team.filter(Boolean).length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              saveStatus === 'saved' ? 'bg-green-600 text-white' :
              saveStatus === 'error' ? 'bg-red-600 text-white' :
              'bg-primary text-primary-foreground hover:bg-primary/90'
            } disabled:opacity-50`}
          >
            <Save size={16} />
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : saveStatus === 'error' ? 'Error!' : 'Save Team'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Team Slots */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Your Team</h2>
            <TeamSlotGrid 
              team={team} 
              onSelectSlot={handleSelectSlot} 
              selectedIndex={selectedIndex} 
            />
          </div>

          {/* Analysis Section placeholder */}
          <div className="bg-card border border-border rounded-xl p-4 shadow-sm min-h-[300px]">
             <h2 className="text-lg font-semibold mb-4">Team Analysis</h2>
             <TeamAnalysis team={team} />
          </div>
        </div>

        {/* Detail Panel */}
        <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col">
          <h2 className="text-lg font-semibold mb-4">Pokémon Details</h2>
          {selectedIndex !== null && team[selectedIndex] ? (
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center border border-border overflow-hidden">
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${(pokemonData as PokemonSpecies[]).find(p => p.id === team[selectedIndex].speciesId)?.dexNumber}.png`}
                      alt={team[selectedIndex].name}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/poke-ball.png';
                      }}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{team[selectedIndex].name}</h3>
                    <div className="text-sm text-muted-foreground">Modify details below</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsSearchOpen(true)}
                    className="px-3 py-1.5 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80"
                  >
                    Change
                  </button>
                  <button 
                    onClick={() => handleClearSlot(selectedIndex!)}
                    className="px-3 py-1.5 text-sm bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 border border-destructive/20"
                    title="Remove from team"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <PokemonDetailPanel 
                pokemon={team[selectedIndex]} 
                onUpdate={handleUpdatePokemon} 
              />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed border-border rounded-lg">
              Select a slot to edit Pokémon details.
            </div>
          )}
        </div>
      </div>

      <PokemonSearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        onSelect={handleSelectPokemon} 
      />
    </div>
  );
}
