import { useState, useEffect } from 'react';
import { getSettings, saveSettings, type AppSettings } from '../lib/settings/settingsStore';
import { themes, type AppTheme } from '../lib/settings/themeConfig';
import { Check, Monitor, Zap, Settings as SettingsIcon, Database, Trash2 } from 'lucide-react';
import { getTeams } from '../lib/db/localTeams';

export default function Settings() {
  const [settings, setSettingsState] = useState<AppSettings>(getSettings());
  const [teamCount, setTeamCount] = useState(0);

  useEffect(() => {
    getTeams().then(t => setTeamCount(t.length));
  }, []);

  const updateSetting = (key: keyof AppSettings, value: any) => {
    // Use functional update to prevent race conditions
    setSettingsState(prev => {
      const updated = { ...prev, [key]: value };
      saveSettings(updated);
      return updated;
    });
  };

  const clearData = async () => {
    if (confirm('Are you sure you want to delete all saved teams and settings? This cannot be undone.')) {
      // Only clear app-specific data, not entire localStorage
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('pokemon-champions-') || key === 'PokemonChampionsDB')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear IndexedDB
      const { db } = await import('../lib/db/localTeams');
      await db.delete();

      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 pb-12 animate-fade-in max-w-3xl mx-auto">
      <div className="flex items-center gap-3 border-b border-border pb-4">
        <SettingsIcon className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-muted-foreground text-sm">Customize your experience and manage data.</p>
        </div>
      </div>

      {/* Theme Selection */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold">Appearance</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {(Object.keys(themes) as AppTheme[]).map((theme) => (
            <button
              key={theme}
              onClick={() => updateSetting('theme', theme)}
              className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                settings.theme === theme 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-border bg-card hover:border-muted-foreground'
              }`}
            >
              <div 
                className="w-full h-16 rounded-md shadow-inner border border-black/20"
                style={{ 
                  background: `hsl(${themes[theme].background})`,
                  borderColor: `hsl(${themes[theme].border})` 
                }}
              >
                {/* Preview miniature */}
                <div className="flex gap-2 p-2 h-full">
                  <div className="w-1/3 h-full rounded bg-primary/20" style={{ background: `hsl(${themes[theme].primary})`, opacity: 0.8 }} />
                  <div className="w-2/3 h-full rounded bg-card/50" style={{ background: `hsl(${themes[theme].card})` }} />
                </div>
              </div>
              <span className="font-medium text-sm capitalize">{theme.replace('-', ' ')}</span>
              {settings.theme === theme && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-0.5">
                  <Check size={14} />
                </div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Battle Settings */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xl font-semibold">Battle System</h3>
        </div>

        <div className="space-y-3 bg-card border border-border rounded-xl p-4">
          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <div>
              <div className="font-semibold text-sm">Auto-suggest Moves</div>
              <div className="text-xs text-muted-foreground">AI recommends best actions in Battle Board</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.autoSuggestMoves}
              onChange={(e) => updateSetting('autoSuggestMoves', e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <div>
              <div className="font-semibold text-sm">Opponent Predictions</div>
              <div className="text-xs text-muted-foreground">Show predicted opponent builds and likely next turn actions</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.showOpponentPredictions}
              onChange={(e) => updateSetting('showOpponentPredictions', e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer p-2 hover:bg-secondary/50 rounded-lg transition-colors">
            <div>
              <div className="font-semibold text-sm">Confirm Before KO</div>
              <div className="text-xs text-muted-foreground">Show confirmation prompt before fainting a Pokemon</div>
            </div>
            <input 
              type="checkbox" 
              checked={settings.confirmBeforeKO}
              onChange={(e) => updateSetting('confirmBeforeKO', e.target.checked)}
              className="w-5 h-5 accent-blue-500"
            />
          </label>
          
          <div className="p-2 border-t border-border mt-2 pt-4">
            <div className="font-semibold text-sm mb-2">Sprite Style</div>
            <select 
              className="w-full sm:w-64 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={settings.spriteStyle}
              onChange={(e) => updateSetting('spriteStyle', e.target.value)}
            >
              <option value="3d">Animated 3D (Showdown)</option>
              <option value="2d">Static 2D Art</option>
              <option value="pixel">Classic Pixel Art</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-green-500" />
          <h3 className="text-xl font-semibold">Data Management</h3>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="font-semibold text-sm">Saved Teams: {teamCount}</div>
            <div className="text-xs text-muted-foreground">All teams are saved locally in your browser.</div>
          </div>
          
          <button 
            onClick={clearData}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/30 rounded-lg font-medium text-sm transition-colors w-full sm:w-auto justify-center"
          >
            <Trash2 size={16} /> Clear All Data
          </button>
        </div>
      </section>
    </div>
  );
}
