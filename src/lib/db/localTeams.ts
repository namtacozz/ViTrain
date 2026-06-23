import Dexie, { type Table } from 'dexie';
import type { Team } from '../../types/pokemon';

export class TeamDatabase extends Dexie {
  teams!: Table<Team, string>;

  constructor() {
    super('PokemonChampionsDB');

    // Version 1: Initial schema
    this.version(1).stores({
      teams: 'id, createdAt' // Only index what we actually query
    });

    // Version 2: Add updatedAt field for future use
    this.version(2).stores({
      teams: 'id, createdAt, updatedAt'
    }).upgrade(tx => {
      // Migrate existing teams to add updatedAt
      return tx.table('teams').toCollection().modify(team => {
        if (!team.updatedAt) {
          team.updatedAt = team.createdAt;
        }
      });
    });
  }
}

export const db = new TeamDatabase();

export async function saveTeam(team: Team) {
  const teamWithTimestamp = {
    ...team,
    updatedAt: Date.now()
  };
  return await db.teams.put(teamWithTimestamp);
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
