import { useEffect, useState } from 'react';
import { getTeams } from '../lib/db/localTeams';
import type { Team, PokemonSpecies } from '../types/pokemon';
import PokemonAutocomplete from '../components/PokemonAutocomplete';
import { advisePick, analyzeOpponent, type Recommendation, type OpponentAnalysis } from '../lib/advisor/advisorEngine';
import { Trash2, ShieldAlert, Zap, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Advisor() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [opponentTeam, setOpponentTeam] = useState<PokemonSpecies[]>([]);
  const [analysis, setAnalysis] = useState<OpponentAnalysis | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    getTeams().then(res => {
      setTeams(res);
      if (res.length > 0) {
        setSelectedTeam(res[0]!);
      }
    });
  }, []);

  useEffect(() => {
    if (opponentTeam.length > 0) {
      setAnalysis(analyzeOpponent(opponentTeam));
    } else {
      setAnalysis(null);
    }
  }, [opponentTeam]);

  useEffect(() => {
    if (selectedTeam && opponentTeam.length >= 4) {
      const recs = advisePick(selectedTeam.pokemon, opponentTeam);
      setRecommendations(recs);
    } else {
      setRecommendations([]);
    }
  }, [selectedTeam, opponentTeam]);

  const handleAddOpponent = (pokemon: PokemonSpecies) => {
    if (opponentTeam.length >= 6) return;
    if (opponentTeam.some(p => p.id === pokemon.id)) return;
    setOpponentTeam([...opponentTeam, pokemon]);
  };

  const handleRemoveOpponent = (id: string) => {
    setOpponentTeam(opponentTeam.filter(p => p.id !== id));
  };

  const handleClearOpponent = () => {
    setOpponentTeam([]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pick 4 Advisor</h2>
        <p className="text-muted-foreground text-sm">Analyze matchups and get team preview recommendations within seconds.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Setup */}
        <div className="lg:col-span-1 space-y-4">
          <div className="border border-border rounded-2xl p-5 bg-card space-y-4">
            <h3 className="font-bold text-sm">1. Select Your Team</h3>
            {teams.length === 0 ? (
              <p className="text-xs text-muted-foreground">No teams saved. Go to Home to create a team.</p>
            ) : (
              <select
                className="w-full bg-background border rounded px-3 py-2 text-sm focus:outline-none"
                value={selectedTeam?.id || ''}
                onChange={(e) => setSelectedTeam(teams.find(t => t.id === e.target.value) || null)}
              >
                {teams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
            
            {selectedTeam && (
              <div className="grid grid-cols-3 gap-1 pt-2">
                {selectedTeam.pokemon.map(p => (
                  <div key={p.id} className="text-[10px] bg-secondary p-1 rounded text-center truncate" title={p.name}>
                    {p.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border rounded-lg p-4 bg-card space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-sm">2. Input Opponent Team</h3>
              {opponentTeam.length > 0 && (
                <button onClick={handleClearOpponent} className="text-xs text-red-400 hover:underline">Clear all</button>
              )}
            </div>
            
            {opponentTeam.length < 6 && (
              <PokemonAutocomplete onSelect={handleAddOpponent} placeholder="Type opponent species..." />
            )}

            <div className="space-y-2 pt-2">
              {opponentTeam.map(p => (
                <div key={p.id} className="flex justify-between items-center bg-secondary px-3 py-2 rounded-md text-sm">
                  <span>{p.name}</span>
                  <button onClick={() => handleRemoveOpponent(p.id)} className="text-red-400 hover:text-red-300">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
              {opponentTeam.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">Add up to 6 opponent Pokémon to begin analysis.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Results */}
        <div className="md:col-span-2 space-y-4">
          {analysis && (
            <div className="border border-yellow-500/30 rounded-lg p-4 bg-yellow-950/20 space-y-2">
              <div className="flex items-center gap-2 text-yellow-500 font-semibold text-sm">
                <ShieldAlert size={16} /> Opponent Archetype: {analysis.archetype.toUpperCase()}
              </div>
              {analysis.reasons.map((r, i) => (
                <p key={i} className="text-xs text-muted-foreground">{r}</p>
              ))}
              {analysis.threats.length > 0 && (
                <div className="pt-2 border-t border-yellow-500/20 space-y-1">
                  <h4 className="text-xs font-semibold text-yellow-400">Key Threats:</h4>
                  {analysis.threats.map((t, i) => (
                    <li key={i} className="text-xs text-muted-foreground list-disc ml-4">{t}</li>
                  ))}
                </div>
              )}
            </div>
          )}

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-md flex items-center gap-2">
                <Zap size={18} className="text-green-500" /> Recommended Picks
              </h3>
              
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div key={idx} className={`border rounded-lg p-4 bg-card ${idx === 0 ? 'ring-2 ring-green-500/50' : ''}`}>
                    <div className="flex justify-between items-center mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded font-semibold ${
                        idx === 0 ? 'bg-green-500/20 text-green-400' : 'bg-secondary text-muted-foreground'
                      }`}>
                        {idx === 0 ? 'Primary Recommendation' : `Alternative Recommendation #${idx}`}
                      </span>
                      <span className="text-xs text-muted-foreground">Score: {rec.score}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Lead Pair</h4>
                        <div className="flex gap-2">
                          {rec.lead.map(p => (
                            <div key={p.id} className="flex-1 bg-secondary p-2 rounded text-center font-bold text-xs truncate">
                              {p.name}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-1">Backline</h4>
                        <div className="flex gap-2">
                          {rec.back.map(p => (
                            <div key={p.id} className="flex-1 bg-secondary p-2 rounded text-center font-bold text-xs truncate">
                              {p.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t space-y-2">
                      <div className="text-xs">
                        <span className="font-semibold text-blue-400">Game Plan: </span>
                        <span className="text-muted-foreground">{rec.turnOnePlan}</span>
                      </div>
                      <div className="space-y-1">
                        {rec.reasons.map((r, i) => (
                          <div key={i} className="text-xs text-muted-foreground flex gap-1.5 items-start">
                            <span className="text-green-400">•</span>
                            <span>{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {idx === 0 && (
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={`/battle?teamId=${selectedTeam?.id}&lead=${rec.lead.map(p=>p.speciesId).join(',')}&back=${rec.back.map(p=>p.speciesId).join(',')}&opponent=${opponentTeam.map(p=>p.id).join(',')}`}
                          className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-blue-500"
                        >
                          <BookOpen size={14} /> Go to Battle Board
                        </Link>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            selectedTeam && opponentTeam.length < 4 && (
              <div className="border rounded-lg p-12 text-center bg-card text-muted-foreground">
                Enter at least 4 opponent Pokémon to generate recommendations.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
