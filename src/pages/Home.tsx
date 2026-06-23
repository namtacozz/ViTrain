import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getTeams } from '../lib/db/localTeams';
import type { Team } from '../types/pokemon';
import { Plus, BookOpen, Search } from 'lucide-react';
import { PokemonSprite } from '../components/PokemonSprite';
import pokemonData from '../data/pokemon.json';

export default function Home() {
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    getTeams().then(setTeams);
  }, []);

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center pt-8 pb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-500/20 px-3 py-1 text-xs font-semibold text-blue-500 mb-4">
          Regulation M-B — Active Format
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
          Pokémon <span className="text-red-500">Champions Meta</span>
        </h1>
        <p className="mt-3 text-lg text-muted-foreground max-w-xl mx-auto">
          Analyze type coverage, test matchups, and build your champion squad with the most up-to-date meta data.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/team/new" className="rounded-lg bg-red-600 px-5 py-2.5 font-semibold text-white transition-opacity hover:opacity-90">
            Build Team
          </Link>
          <Link to="/advisor" className="rounded-lg border border-border bg-card px-5 py-2.5 font-semibold transition-colors hover:bg-secondary">
            Open Advisor
          </Link>
          <Link to="/typechart" className="rounded-lg border border-blue-500/30 bg-blue-500/10 px-5 py-2.5 font-semibold text-blue-400 transition-colors hover:bg-blue-500/20">
            Type Chart
          </Link>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/team/new" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-blue-500/50 hover:bg-secondary transition-colors">
          <div className="bg-red-500/20 p-2 rounded-lg text-red-500"><Plus size={20} /></div>
          <div className="font-semibold">Import Team</div>
        </Link>
        <Link to="/database" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 hover:border-blue-500/50 hover:bg-secondary transition-colors">
          <div className="bg-blue-500/20 p-2 rounded-lg text-blue-500"><Search size={20} /></div>
          <div className="font-semibold">Pokémon Database</div>
        </Link>
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 opacity-50 cursor-not-allowed">
          <div className="bg-green-500/20 p-2 rounded-lg text-green-500"><BookOpen size={20} /></div>
          <div className="font-semibold">Matchup Notes (Soon)</div>
        </div>
      </section>

      {/* My Teams */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">My Teams</h2>
        </div>
        
        {teams.length === 0 ? (
          <div className="p-12 text-center border rounded-2xl border-dashed bg-card/50 text-muted-foreground">
            No teams found. Create or import a team to get started.
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {teams.map(team => (
              <Link key={team.id} to={`/team/${team.id}`} className="border rounded-2xl p-4 bg-card shadow-sm hover:border-blue-500/50 transition-colors group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg group-hover:text-blue-500 transition-colors">{team.name}</h3>
                  <span className="text-xs text-muted-foreground">{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {team.pokemon.map((p, i) => {
                    const spec = pokemonData.find(s => s.id === p.speciesId);
                    return (
                      <div key={i} className="flex flex-col items-center">
                        <div className="bg-secondary/50 rounded-lg p-1 w-full aspect-square flex items-center justify-center">
                          {spec ? (
                            <PokemonSprite dexNumber={spec.dexNumber} name={p.name} size="md" />
                          ) : (
                            <span className="text-[10px] text-muted-foreground truncate max-w-full px-1">{p.name}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {Array.from({ length: 6 - team.pokemon.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-background border border-dashed rounded-lg w-full aspect-square opacity-50"></div>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
