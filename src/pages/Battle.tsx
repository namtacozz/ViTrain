import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getTeam } from '../lib/db/localTeams';
import pokemonData from '../data/pokemon.json';
import type { PokemonSpecies, TeamMember } from '../types/pokemon';
import { Sparkles, RotateCcw } from 'lucide-react';

import { initBattleState, advanceTurn, type BattleState, type BattleSlotState } from '../lib/battle/battleState';
import { suggestMoves } from '../lib/battle/moveSuggester';
import { guessOpponentBuild, predictNextActions } from '../lib/battle/predictionEngine';
import { createLogEntry } from '../lib/battle/turnLog';

import BattleSlot from '../components/battle/BattleSlot';
import MoveSuggestionPanel from '../components/battle/MoveSuggestionPanel';
import NextTurnPredictions from '../components/battle/NextTurnPredictions';
import TurnLogPanel from '../components/battle/TurnLogPanel';
import KOTracker from '../components/battle/KOTracker';
import FieldConditionBar from '../components/battle/FieldConditionBar';
import OpponentMemoryPanel from '../components/battle/OpponentMemoryPanel';

const pokemonDb = pokemonData as PokemonSpecies[];

export default function Battle() {
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get('teamId');
  const leadParam = searchParams.get('lead');
  const opponentParam = searchParams.get('opponent');

  const [myTeamFull, setMyTeamFull] = useState<TeamMember[]>([]);
  const [oppTeamFull, setOppTeamFull] = useState<PokemonSpecies[]>([]);
  
  const [battleState, setBattleState] = useState<BattleState | null>(null);

  useEffect(() => {
    async function load() {
      let myTeam: TeamMember[] = [];
      let oppTeam: PokemonSpecies[] = [];

      if (teamId) {
        const t = await getTeam(teamId);
        if (t) myTeam = t.pokemon;
      }
      setMyTeamFull(myTeam);

      if (opponentParam) {
        const oppIds = opponentParam.split(',');
        oppTeam = oppIds.map(id => pokemonDb.find(p => p.id === id)).filter(Boolean) as PokemonSpecies[];
      }
      setOppTeamFull(oppTeam);

      if (myTeam.length > 0) {
        const myLeads = leadParam ? leadParam.split(',') : myTeam.slice(0, 2).map(p => p.speciesId);
        const oppLeads = oppTeam.slice(0, 2).map(p => p.id);
        setBattleState(initBattleState(myTeam, oppTeam, myLeads, oppLeads));
      }
    }
    load();
  }, [teamId, leadParam, opponentParam]);

  if (!battleState) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-3">
          <div className="text-4xl animate-bounce">⚔️</div>
          <p className="text-muted-foreground">Loading Battle Board...</p>
          <p className="text-xs text-muted-foreground">No team loaded? Go to <a href="/builder" className="text-blue-400 underline">Team Builder</a> first.</p>
        </div>
      </div>
    );
  }

  const updateSlot = (side: 'mySlots' | 'oppSlots', index: 0 | 1, updates: Partial<BattleSlotState>) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const newState = { ...prev };
      newState[side][index] = { ...newState[side][index], ...updates };
      return newState;
    });
  };

  const handleSwap = (side: 'mine' | 'opp', index: 0 | 1, targetId: string) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const newState = { ...prev };
      const slots = side === 'mine' ? newState.mySlots : newState.oppSlots;
      const bench = side === 'mine' ? newState.myBench : newState.oppBench;
      
      const currentPokemon = slots[index].pokemon;
      
      // Find new pokemon from bench
      const newIdx = bench.findIndex(p => p.id === targetId);
      if (newIdx === -1) return prev;
      
      const newPokemon = bench[newIdx];
      
      // Swap logic
      if (currentPokemon) {
        bench[newIdx] = currentPokemon as any;
      } else {
        bench.splice(newIdx, 1);
      }
      
      slots[index] = {
        ...slots[index],
        pokemon: newPokemon,
        currentHpPercent: 100, // assuming fresh, ideally we track bench HP too, but simplified for now
        status: null,
        boosts: { atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0 },
        isProtected: false,
        isFainted: false,
        turnsOnField: 0
      };

      // Add log
      newState.turnLog = [
        createLogEntry(newState.turnNumber, 'switch', currentPokemon ? currentPokemon.name : 'Empty', `Switched to ${newPokemon!.name}`, side === 'mine' ? 'mine' : 'opponent'),
        ...newState.turnLog
      ];

      return newState;
    });
  };

  const handleFaint = (side: 'mine' | 'opp', index: 0 | 1) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const newState = { ...prev };
      const slot = side === 'mine' ? newState.mySlots[index] : newState.oppSlots[index];
      
      if (!slot.pokemon) return prev;

      slot.isFainted = !slot.isFainted;
      if (slot.isFainted) {
        slot.currentHpPercent = 0;
        slot.status = null;
        if (side === 'mine') {
          newState.myFainted.push(slot.pokemon as TeamMember);
        } else {
          newState.oppFainted.push(slot.pokemon as PokemonSpecies);
        }
        newState.turnLog = [createLogEntry(newState.turnNumber, 'faint', slot.pokemon.name, 'Fainted!', side === 'mine' ? 'mine' : 'opponent'), ...newState.turnLog];
      } else {
        // Revive
        slot.currentHpPercent = 100;
        if (side === 'mine') {
          newState.myFainted = newState.myFainted.filter(p => p.id !== slot.pokemon!.id);
        } else {
          newState.oppFainted = newState.oppFainted.filter(p => p.id !== slot.pokemon!.id);
        }
      }
      return newState;
    });
  };

  const handleAdvanceTurn = () => {
    setBattleState(prev => prev ? advanceTurn(prev) : prev);
  };

  const handleUndo = () => {
    setBattleState(prev => {
      if (!prev || prev.turnLog.length === 0) return prev;
      const newState = { ...prev };
      newState.turnLog = newState.turnLog.slice(1);
      return newState;
    });
  };

  const handleRevealOppMove = (slotIndex: 0 | 1, move: string) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const slot = prev.oppSlots[slotIndex];
      if (!slot.pokemon) return prev;
      const speciesId = slot.pokemon.id;
      const newMemory = { ...prev.oppMemory };
      const existing = newMemory.revealedMoves[speciesId] || [];
      if (!existing.includes(move)) {
        newMemory.revealedMoves = {
          ...newMemory.revealedMoves,
          [speciesId]: [...existing, move]
        };
      }
      // Also update slot usedMoves and log it
      const newSlots = [...prev.oppSlots] as typeof prev.oppSlots;
      if (!newSlots[slotIndex].usedMoves.includes(move)) {
        newSlots[slotIndex] = { ...newSlots[slotIndex], usedMoves: [...newSlots[slotIndex].usedMoves, move] };
      }
      const log = createLogEntry(prev.turnNumber, 'attack', slot.pokemon.name, `Used ${move}`, 'opponent');
      return { ...prev, oppMemory: newMemory, oppSlots: newSlots, turnLog: [log, ...prev.turnLog] };
    });
  };

  // Record opponent item reveal  
  const handleRevealOppItem = (slotIndex: 0 | 1, item: string) => {
    setBattleState(prev => {
      if (!prev) return prev;
      const slot = prev.oppSlots[slotIndex];
      if (!slot.pokemon) return prev;
      const speciesId = slot.pokemon.id;
      const newMemory = { 
        ...prev.oppMemory, 
        revealedItem: { ...prev.oppMemory.revealedItem, [speciesId]: item }
      };
      return { ...prev, oppMemory: newMemory };
    });
  };

  const mySugsA = suggestMoves(0, battleState);
  const mySugsB = suggestMoves(1, battleState);

  // Predictions
  const oppPred0 = battleState.oppSlots[0].pokemon 
    ? guessOpponentBuild(battleState.oppSlots[0].pokemon.id, battleState.oppMemory) 
    : null;
  const oppPred1 = battleState.oppSlots[1].pokemon 
    ? guessOpponentBuild(battleState.oppSlots[1].pokemon.id, battleState.oppMemory) 
    : null;
  const nextActions = predictNextActions(battleState, battleState.oppMemory);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-blue-500" /> Battle Board
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold bg-secondary px-3 py-1.5 rounded-full">
            Turn {battleState.turnNumber}
          </span>
          <button onClick={handleAdvanceTurn} className="bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-semibold hover:opacity-90">
            Next Turn
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Board Area */}
        <div className="lg:col-span-8 space-y-4">
          
          <div className="border rounded-2xl p-4 md:p-6 bg-card relative overflow-hidden flex flex-col justify-between min-h-[400px]">
            {/* Background design */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff05_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            {/* Field Conditions Bar */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center z-10 pointer-events-auto">
              <FieldConditionBar 
                field={battleState.field} 
                onUpdateField={(updates) => setBattleState(prev => prev ? { ...prev, field: { ...prev.field, ...updates } } : prev)} 
              />
            </div>

            {/* Opponent Side */}
            <div className="flex justify-around gap-4 items-start z-10">
              <div className="w-1/2 max-w-[280px]">
                <BattleSlot 
                  slotState={battleState.oppSlots[0]} side="opponent" label="OPP A" bench={battleState.oppBench}
                  onSwap={(id) => handleSwap('opp', 0, id)}
                  onHpChange={(hp) => updateSlot('oppSlots', 0, { currentHpPercent: hp })}
                  onToggleProtect={() => updateSlot('oppSlots', 0, { isProtected: !battleState.oppSlots[0].isProtected })}
                  onStatusChange={(st) => updateSlot('oppSlots', 0, { status: st })}
                  onFaintToggle={() => handleFaint('opp', 0)}
                  predictedItem={oppPred0?.likelyItem}
                  predictedAbility={oppPred0?.likelyAbility}
                  predictedMoves={oppPred0?.likelyMoves}
                  onRevealMove={(m) => handleRevealOppMove(0, m)}
                  onRevealItem={(item) => handleRevealOppItem(0, item)}
                />
                {nextActions.slot0.length > 0 && (
                  <div className="mt-2 text-xs bg-black/20 p-2 rounded border border-orange-500/20">
                    <span className="font-bold text-orange-400">Likely Action:</span> {nextActions.slot0[0].action} <span className="text-muted-foreground">({nextActions.slot0[0].confidence}%)</span>
                  </div>
                )}
              </div>
              <div className="w-1/2 max-w-[280px]">
                <BattleSlot 
                  slotState={battleState.oppSlots[1]} side="opponent" label="OPP B" bench={battleState.oppBench}
                  onSwap={(id) => handleSwap('opp', 1, id)}
                  onHpChange={(hp) => updateSlot('oppSlots', 1, { currentHpPercent: hp })}
                  onToggleProtect={() => updateSlot('oppSlots', 1, { isProtected: !battleState.oppSlots[1].isProtected })}
                  onStatusChange={(st) => updateSlot('oppSlots', 1, { status: st })}
                  onFaintToggle={() => handleFaint('opp', 1)}
                  predictedItem={oppPred1?.likelyItem}
                  predictedAbility={oppPred1?.likelyAbility}
                  predictedMoves={oppPred1?.likelyMoves}
                  onRevealMove={(m) => handleRevealOppMove(1, m)}
                  onRevealItem={(item) => handleRevealOppItem(1, item)}
                />
                {nextActions.slot1.length > 0 && (
                  <div className="mt-2 text-xs bg-black/20 p-2 rounded border border-orange-500/20">
                    <span className="font-bold text-orange-400">Likely Action:</span> {nextActions.slot1[0].action} <span className="text-muted-foreground">({nextActions.slot1[0].confidence}%)</span>
                  </div>
                )}
              </div>
            </div>

            {/* My Side */}
            <div className="flex justify-around gap-4 items-end mt-12 z-10">
              <div className="w-1/2 max-w-[280px]">
                <BattleSlot 
                  slotState={battleState.mySlots[0]} side="mine" label="MY A" bench={battleState.myBench}
                  onSwap={(id) => handleSwap('mine', 0, id)}
                  onHpChange={(hp) => updateSlot('mySlots', 0, { currentHpPercent: hp })}
                  onToggleProtect={() => updateSlot('mySlots', 0, { isProtected: !battleState.mySlots[0].isProtected })}
                  onStatusChange={(st) => updateSlot('mySlots', 0, { status: st })}
                  onFaintToggle={() => handleFaint('mine', 0)}
                />
              </div>
              <div className="w-1/2 max-w-[280px]">
                <BattleSlot 
                  slotState={battleState.mySlots[1]} side="mine" label="MY B" bench={battleState.myBench}
                  onSwap={(id) => handleSwap('mine', 1, id)}
                  onHpChange={(hp) => updateSlot('mySlots', 1, { currentHpPercent: hp })}
                  onToggleProtect={() => updateSlot('mySlots', 1, { isProtected: !battleState.mySlots[1].isProtected })}
                  onStatusChange={(st) => updateSlot('mySlots', 1, { status: st })}
                  onFaintToggle={() => handleFaint('mine', 1)}
                />
              </div>
            </div>
          </div>

          {/* Move Suggestions */}
          <MoveSuggestionPanel 
            suggestionsA={mySugsA} nameA={battleState.mySlots[0].pokemon?.name}
            suggestionsB={mySugsB} nameB={battleState.mySlots[1].pokemon?.name}
          />

          {/* Opponent Predictions Panel */}
          <NextTurnPredictions
            slot0Actions={nextActions.slot0}
            slot1Actions={nextActions.slot1}
            name0={battleState.oppSlots[0].pokemon?.name}
            name1={battleState.oppSlots[1].pokemon?.name}
          />
        </div>

        {/* Right Side Panels */}
        <div className="lg:col-span-4 space-y-4">
          <KOTracker 
            myTeam={myTeamFull} myFainted={battleState.myFainted}
            oppTeam={oppTeamFull} oppFainted={battleState.oppFainted}
          />

          {/* Opponent Intel Memory */}
          <OpponentMemoryPanel
            memory={battleState.oppMemory}
            oppTeamNames={Object.fromEntries(
              [
                ...battleState.oppSlots.map(s => s.pokemon).filter(Boolean),
                ...battleState.oppBench
              ]
                .map(p => [p!.id, p!.name])
            )}
          />

          <TurnLogPanel 
            logs={battleState.turnLog} 
            onUndoLast={handleUndo} 
          />
          
          <button 
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-red-900/30 rounded-lg transition-colors"
          >
            <RotateCcw size={16} /> Reset Battle
          </button>
        </div>
      </div>
    </div>
  );
}
