import type { Team } from '../../types/pokemon';

export function exportShowdownTeam(team: Team): string {
  return team.pokemon.map(p => {
    const lines = [];
    lines.push(`${p.name}${p.item ? ` @ ${p.item}` : ''}`);
    if (p.ability) lines.push(`Ability: ${p.ability}`);
    // MVP: assume default nature/evs if not present in our simple model
    p.moves.forEach(m => lines.push(`- ${m}`));
    return lines.join('\n');
  }).join('\n\n');
}
