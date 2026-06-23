import Dexie, { type Table } from 'dexie';
import type { Team } from '../../types/pokemon';

export class TeamDatabase extends Dexie {
  teams!: Table<Team, string>;

  constructor() {
    super('PokemonChampionsDB');
    this.version(1).stores({
      teams: 'id, name, format, createdAt' // Primary key and indexed props
    });
  }
}

export const db = new TeamDatabase();

export async function saveTeam(team: Team) {
  return await db.teams.put(team);
}

export async function getTeams() {
  return await db.teams.orderBy('createdAt').reverse().toArray();
}

export async function getTeam(id: string) {
  return await db.teams.get(id);
}

export async function deleteTeam(id: string) {
  return await db.teams.delete(id);
}
