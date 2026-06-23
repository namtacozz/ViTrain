import type { TeamMember, PokemonSpecies, StatusCondition, Weather, Terrain, StatBoosts } from '../../types/pokemon';
import pokemonData from '../../data/pokemon.json';

const pokemonDb = pokemonData as PokemonSpecies[];

export interface BattleSlotState {
  pokemon: TeamMember | PokemonSpecies | null;
  currentHpPercent: number;      // 0-100
  status: StatusCondition | null;
  boosts: StatBoosts;
  isProtected: boolean;
  isFainted: boolean;
  usedMoves: string[];
  turnsOnField: number;
}

export interface FieldState {
  weather: Weather;
  weatherTurns: number;
  terrain: Terrain;
  terrainTurns: number;
  myTailwind: boolean;
  myTailwindTurns: number;
  oppTailwind: boolean;
  oppTailwindTurns: number;
  trickRoom: boolean;
  trickRoomTurns: number;
}

export interface TurnLogEntry {
  turnNumber: number;
  timestamp: number;
  action: 'attack' | 'switch' | 'faint' | 'status' | 'boost' | 'weather' | 'field' | 'protect';
  actor: string;
  target?: string;
  detail: string;
  side: 'mine' | 'opponent' | 'field';
}

export interface BattleState {
  mySlots: [BattleSlotState, BattleSlotState];
  oppSlots: [BattleSlotState, BattleSlotState];
  field: FieldState;
  turnNumber: number;
  turnLog: TurnLogEntry[];
  myBench: TeamMember[];
  oppBench: PokemonSpecies[];
  myFainted: TeamMember[];
  oppFainted: PokemonSpecies[];
  oppMemory: {
    revealedMoves: Record<string, string[]>;
    revealedItem: Record<string, string>;
    revealedAbility: Record<string, string>;
  };
}

export const initialStatBoosts = (): StatBoosts => ({
  atk: 0, def: 0, spa: 0, spd: 0, spe: 0, accuracy: 0, evasion: 0
});

export const createEmptySlot = (): BattleSlotState => ({
  pokemon: null,
  currentHpPercent: 100,
  status: null,
  boosts: initialStatBoosts(),
  isProtected: false,
  isFainted: false,
  usedMoves: [],
  turnsOnField: 0
});

export function initBattleState(myTeam: TeamMember[], oppTeam: PokemonSpecies[], myLeads: string[], oppLeads: string[]): BattleState {
  const state: BattleState = {
    mySlots: [createEmptySlot(), createEmptySlot()],
    oppSlots: [createEmptySlot(), createEmptySlot()],
    field: {
      weather: 'none', weatherTurns: 0,
      terrain: 'none', terrainTurns: 0,
      myTailwind: false, myTailwindTurns: 0,
      oppTailwind: false, oppTailwindTurns: 0,
      trickRoom: false, trickRoomTurns: 0
    },
    turnNumber: 1,
    turnLog: [],
    myBench: [],
    oppBench: [],
    myFainted: [],
    oppFainted: [],
    oppMemory: {
      revealedMoves: {},
      revealedItem: {},
      revealedAbility: {}
    }
  };

  // Populate My Team
  const myLeadPokemon = myTeam.filter(p => myLeads.includes(p.speciesId));
  if (myLeadPokemon[0]) state.mySlots[0].pokemon = myLeadPokemon[0];
  if (myLeadPokemon[1]) state.mySlots[1].pokemon = myLeadPokemon[1];
  state.myBench = myTeam.filter(p => !myLeads.includes(p.speciesId));

  // Populate Opponent Team
  const oppLeadPokemon = oppTeam.filter(p => oppLeads.includes(p.id));
  if (oppLeadPokemon[0]) state.oppSlots[0].pokemon = oppLeadPokemon[0];
  if (oppLeadPokemon[1]) state.oppSlots[1].pokemon = oppLeadPokemon[1];
  state.oppBench = oppTeam.filter(p => !oppLeads.includes(p.id));

  // Auto-detect starting weather from abilities
  const allLeads = [...myLeadPokemon.map(p => {
    const spec = pokemonDb.find(s => s.id === p.speciesId);
    return spec?.abilities.includes('Drizzle') || p.ability === 'Drizzle' ? 'Drizzle' :
           spec?.abilities.includes('Drought') || p.ability === 'Drought' ? 'Drought' :
           spec?.abilities.includes('Sand Stream') || p.ability === 'Sand Stream' ? 'Sand Stream' :
           spec?.abilities.includes('Snow Warning') || p.ability === 'Snow Warning' ? 'Snow Warning' : null;
  }), ...oppLeadPokemon.map(p => p.abilities.includes('Drizzle') ? 'Drizzle' : p.abilities.includes('Drought') ? 'Drought' : null)];
  
  if (allLeads.includes('Drizzle')) {
    state.field.weather = 'rain';
    state.field.weatherTurns = 5;
  } else if (allLeads.includes('Drought')) {
    state.field.weather = 'sun';
    state.field.weatherTurns = 5;
  } else if (allLeads.includes('Sand Stream')) {
    state.field.weather = 'sand';
    state.field.weatherTurns = 5;
  } else if (allLeads.includes('Snow Warning')) {
    state.field.weather = 'snow';
    state.field.weatherTurns = 5;
  }

  return state;
}

export function advanceTurn(state: BattleState): BattleState {
  const newState = { ...state };
  newState.turnNumber += 1;

  // Decrease field condition turns
  if (newState.field.weather !== 'none') {
    newState.field.weatherTurns -= 1;
    if (newState.field.weatherTurns <= 0) newState.field.weather = 'none';
  }
  if (newState.field.terrain !== 'none') {
    newState.field.terrainTurns -= 1;
    if (newState.field.terrainTurns <= 0) newState.field.terrain = 'none';
  }
  if (newState.field.myTailwind) {
    newState.field.myTailwindTurns -= 1;
    if (newState.field.myTailwindTurns <= 0) newState.field.myTailwind = false;
  }
  if (newState.field.oppTailwind) {
    newState.field.oppTailwindTurns -= 1;
    if (newState.field.oppTailwindTurns <= 0) newState.field.oppTailwind = false;
  }
  if (newState.field.trickRoom) {
    newState.field.trickRoomTurns -= 1;
    if (newState.field.trickRoomTurns <= 0) newState.field.trickRoom = false;
  }

  // Update slot turns and reset protect
  const updateSlot = (slot: BattleSlotState) => {
    if (slot.pokemon && !slot.isFainted) {
      slot.turnsOnField += 1;
    }
    slot.isProtected = false;
  };

  updateSlot(newState.mySlots[0]);
  updateSlot(newState.mySlots[1]);
  updateSlot(newState.oppSlots[0]);
  updateSlot(newState.oppSlots[1]);

  return newState;
}
