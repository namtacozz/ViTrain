import type { TurnLogEntry } from './battleState';

export function createLogEntry(
  turnNumber: number,
  action: TurnLogEntry['action'],
  actor: string,
  detail: string,
  side: TurnLogEntry['side'],
  target?: string
): TurnLogEntry {
  return {
    turnNumber,
    timestamp: Date.now(),
    action,
    actor,
    detail,
    side,
    target
  };
}

export function filterLogsByTurn(logs: TurnLogEntry[], turnNumber: number): TurnLogEntry[] {
  return logs.filter(l => l.turnNumber === turnNumber);
}
