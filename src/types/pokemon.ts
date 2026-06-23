export type PokemonType = 'Normal' | 'Fire' | 'Water' | 'Electric' | 'Grass' | 'Ice' | 'Fighting' | 'Poison' | 'Ground' | 'Flying' | 'Psychic' | 'Bug' | 'Rock' | 'Ghost' | 'Dragon' | 'Dark' | 'Steel' | 'Fairy';

export interface PokemonSpecies {
  id: string;
  name: string;
  dexNumber: number;
  aliases: string[];
  types: PokemonType[];
  baseStats: {
    hp: number;
    atk: number;
    def: number;
    spa: number;
    spd: number;
    spe: number;
  };
  abilities: string[];
  legalMoves: string[];
  roleTags: string[];
}

export interface Move {
  id: string;
  name: string;
  type: PokemonType;
  category: 'physical' | 'special' | 'status';
  power?: number;
  accuracy?: number;
  priority?: number;
  target: string;
  flags: string[];
}

export interface Item {
  id: string;
  name: string;
  tags: string[];
  description: string;
}

export interface TeamMember {
  id: string; // unique instance id
  speciesId: string;
  name: string; // display name
  item?: string;
  ability?: string;
  nature?: string;
  evs?: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  ivs?: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
  teraType?: PokemonType;
  moves: string[];
  roleTag?: string;
}

export interface Team {
  id: string;
  name: string;
  format: string;
  pokemon: TeamMember[];
  createdAt: number;
}

export type StatusCondition = 'burn' | 'paralysis' | 'sleep' | 'freeze' | 'poison' | 'toxic';
export type Weather = 'none' | 'rain' | 'sun' | 'sand' | 'snow';
export type Terrain = 'none' | 'electric' | 'grassy' | 'psychic' | 'misty';

export interface StatBoosts {
  atk: number;
  def: number;
  spa: number;
  spd: number;
  spe: number;
  accuracy: number;
  evasion: number;
}
