import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { parseShowdownTeam } from '../lib/parser/parseTeam';
import { exportShowdownTeam } from '../lib/parser/exportTeam';
import { saveTeam } from '../lib/db/localTeams';
import type { Team } from '../types/pokemon';
import { PokemonCard } from '../components/PokemonCard';
import { EmptySlot } from '../components/EmptySlot';
import { TeamWeaknessChart } from '../components/TeamWeaknessChart';
import { SpeedTierChart } from '../components/SpeedTierChart';
import { Download, Copy, Check } from 'lucide-react';

export default function TeamBuilder() {
  const navigate = useNavigate();
  const [paste, setPaste] = useState('');
  const [parsedTeam, setParsedTeam] = useState<Team | null>(null);
  const [activeTab, setActiveTab] = useState<'weakness' | 'speed' | 'export'>('weakness');
  const [copied, setCopied] = useState(false);

  const handleParse = () => {
    if (!paste.trim()) return;
    const team = parseShowdownTeam(paste);
    setParsedTeam(team);
  };

  const handleSave = async () => {
    if (!parsedTeam) return;
    await saveTeam(parsedTeam);
    navigate('/');
  };

  const handleCopy = () => {
    if (!parsedTeam) return;
    const text = exportShowdownTeam(parsedTeam);
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Builder</h2>
        {parsedTeam && (
          <div className="flex gap-2">
            <button 
              onClick={() => setParsedTeam(null)}
              className="bg-secondary text-foreground px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button 
              onClick={handleSave}
              className="bg-green-600 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} /> Save Team
            </button>
          </div>
        )}
      </div>
      
      {!parsedTeam ? (
        <div className="grid lg:grid-cols-2 gap-6 animate-fade-in">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Import from Showdown</h3>
            <p className="text-sm text-muted-foreground">Paste your Showdown format team below:</p>
            <textarea 
              className="w-full h-64 p-4 rounded-xl border border-border bg-card font-mono text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
              placeholder="Incineroar @ Sitrus Berry&#10;Ability: Intimidate&#10;Level: 50&#10;- Fake Out&#10;- Parting Shot&#10;- Flare Blitz&#10;- Knock Off"
              value={paste}
              onChange={(e) => setPaste(e.target.value)}
            />
            <button 
              onClick={handleParse}
              className="w-full bg-red-600 text-white px-4 py-3 rounded-xl font-bold hover:bg-red-700 transition-colors"
            >
              Import Team
            </button>
          </div>
          <div className="hidden lg:flex flex-col justify-center items-center p-8 border-2 border-dashed border-border rounded-2xl bg-card/50">
            <div className="text-center space-y-2">
              <div className="text-muted-foreground text-sm max-w-sm">
                Imported teams will appear here with type coverage analysis and visual previews.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex gap-2 items-center">
            <input 
              className="border border-border bg-card px-4 py-2 rounded-xl text-lg font-bold w-full max-w-sm focus:ring-1 focus:ring-blue-500 outline-none"
              value={parsedTeam.name}
              onChange={(e) => setParsedTeam({...parsedTeam, name: e.target.value})}
              placeholder="Team Name"
            />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => {
              const pokemon = parsedTeam.pokemon[i];
              return pokemon ? (
                <PokemonCard key={i} pokemon={pokemon} />
              ) : (
                <EmptySlot key={i} slotNumber={i + 1} />
              );
            })}
          </div>

          <div className="mt-8 border border-border rounded-2xl bg-card p-6 shadow-sm">
            <div className="flex flex-wrap gap-2 sm:gap-4 border-b border-border mb-6">
              <button 
                onClick={() => setActiveTab('weakness')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'weakness' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Type Weaknesses
              </button>
              <button 
                onClick={() => setActiveTab('speed')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'speed' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Speed Tiers
              </button>
              <button 
                onClick={() => setActiveTab('export')}
                className={`px-4 py-2 font-medium border-b-2 transition-colors ${activeTab === 'export' ? 'border-blue-500 text-blue-500' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
              >
                Export / Edit
              </button>
            </div>
            
            <div className="min-h-[300px]">
              {activeTab === 'weakness' && <TeamWeaknessChart team={parsedTeam} />}
              {activeTab === 'speed' && <SpeedTierChart team={parsedTeam} />}
              {activeTab === 'export' && (
                <div className="space-y-4 animate-fade-in max-w-2xl mx-auto">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-lg">Showdown Format</h3>
                    <button 
                      onClick={handleCopy}
                      className="flex items-center gap-2 bg-secondary hover:bg-secondary/80 text-foreground px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                    >
                      {copied ? <><Check size={16} className="text-green-500" /> Copied!</> : <><Copy size={16} /> Copy to Clipboard</>}
                    </button>
                  </div>
                  <pre className="p-4 bg-background border border-border rounded-xl text-xs font-mono overflow-auto max-h-[400px]">
                    {exportShowdownTeam(parsedTeam)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
