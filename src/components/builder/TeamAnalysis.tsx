import React, { useMemo } from 'react';
import type { TeamMember, PokemonType } from '../../types/pokemon';
import { analyzeTeam } from '../../lib/builder/teamAnalyzer';
import { AlertTriangle, Lightbulb, ShieldAlert, ShieldCheck } from 'lucide-react';
import typeChartData from '../../data/type-chart.json';

interface TeamAnalysisProps {
  team: TeamMember[];
}

const ALL_TYPES = Object.keys(typeChartData) as PokemonType[];

export default function TeamAnalysis({ team }: TeamAnalysisProps) {
  const analysis = useMemo(() => analyzeTeam(team), [team]);

  const activeMembers = team.filter(m => m !== null);
  
  if (activeMembers.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
        Add Pokémon to your team to see analysis.
      </div>
    );
  }

  const typeColors: Record<string, string> = {
    Normal: 'bg-gray-400 text-white',
    Fire: 'bg-red-500 text-white',
    Water: 'bg-blue-500 text-white',
    Electric: 'bg-yellow-400 text-black',
    Grass: 'bg-green-500 text-white',
    Ice: 'bg-cyan-300 text-black',
    Fighting: 'bg-orange-600 text-white',
    Poison: 'bg-purple-500 text-white',
    Ground: 'bg-yellow-600 text-white',
    Flying: 'bg-indigo-300 text-black',
    Psychic: 'bg-pink-500 text-white',
    Bug: 'bg-lime-500 text-black',
    Rock: 'bg-yellow-700 text-white',
    Ghost: 'bg-purple-700 text-white',
    Dragon: 'bg-indigo-600 text-white',
    Dark: 'bg-gray-800 text-white',
    Steel: 'bg-gray-500 text-white',
    Fairy: 'bg-pink-300 text-black',
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Type Defenses Summary */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ShieldAlert size={16} className="text-destructive" /> 
          Major Weaknesses (3+ weak)
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.filter(t => analysis.weaknesses[t] >= 3).length > 0 ? (
            ALL_TYPES.filter(t => analysis.weaknesses[t] >= 3).map(type => (
              <span key={type} className={`px-2 py-1 rounded text-xs font-medium ${typeColors[type] || 'bg-gray-500 text-white'}`}>
                {type} ({analysis.weaknesses[type]})
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">No major shared weaknesses! Great job!</span>
          )}
        </div>
      </div>

      {/* Type Resistances Summary */}
      <div>
        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-500" /> 
          Strong Resistances (3+ resist/immune)
        </h3>
        <div className="flex flex-wrap gap-2">
          {ALL_TYPES.filter(t => analysis.resistances[t] >= 3).length > 0 ? (
            ALL_TYPES.filter(t => analysis.resistances[t] >= 3).map(type => (
              <span key={type} className={`px-2 py-1 rounded text-xs font-medium ${typeColors[type] || 'bg-gray-500 text-white'}`}>
                {type} ({analysis.resistances[type]})
              </span>
            ))
          ) : (
            <span className="text-sm text-muted-foreground">None</span>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Warnings */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          <h3 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
            <AlertTriangle size={16} /> Warnings
          </h3>
          {analysis.warnings.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-destructive/90 space-y-1">
              {analysis.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          ) : (
            <span className="text-sm text-destructive/80">No warnings. Looks solid!</span>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <h3 className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
            <Lightbulb size={16} /> Suggestions
          </h3>
          {analysis.suggestions.length > 0 ? (
            <ul className="list-disc list-inside text-sm text-primary/90 space-y-1">
              {analysis.suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ul>
          ) : (
            <span className="text-sm text-primary/80">No immediate suggestions.</span>
          )}
        </div>
      </div>
    </div>
  );
}
