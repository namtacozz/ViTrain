import type { Team, TeamMember } from '../../types/pokemon';

export function parseShowdownTeam(text: string): Team {
  const blocks = text.trim().split(/\n\s*\n/);
  
  const members: TeamMember[] = blocks.map((block) => {
    const lines = block.split('\n').map(l => l.trim());
    const firstLine = lines[0] || '';
    
    // Parse "Species @ Item" or just "Species"
    let speciesName = firstLine;
    let item = undefined;
    if (firstLine.includes('@')) {
      const parts = firstLine.split('@');
      speciesName = parts[0]!.trim();
      item = parts[1]!.trim();
    }
    
    // Also handle Gender/Level in first line if present, but MVP just takes first word or until (
    // Example: "Incineroar (M) @ Figy Berry" -> speciesName should be Incineroar
    if (speciesName.includes(' (')) {
      speciesName = speciesName.substring(0, speciesName.indexOf(' (')).trim();
    }
    
    let ability = undefined;
    let nature = undefined;
    const moves: string[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i]!;
      if (line.startsWith('Ability:')) {
        ability = line.replace('Ability:', '').trim();
      } else if (line.endsWith('Nature')) {
        nature = line.replace('Nature', '').trim();
      } else if (line.startsWith('-')) {
        moves.push(line.replace('-', '').trim());
      }
    }
    
    return {
      id: crypto.randomUUID(),
      speciesId: speciesName.toLowerCase().replace(/[^a-z0-9]/g, ''),
      name: speciesName,
      item,
      ability,
      nature,
      moves: moves.slice(0, 4), // max 4 moves
    };
  });

  return {
    id: crypto.randomUUID(),
    name: `Imported Team ${new Date().toLocaleDateString()}`,
    format: 'vgc',
    pokemon: members.slice(0, 6), // max 6 pokemon
    createdAt: Date.now(),
  };
}
