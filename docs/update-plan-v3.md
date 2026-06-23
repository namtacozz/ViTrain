# Update Plan V3 — Fixes, Edit Team, Battle UX, Pokémon Data

> **Created**: 2026-06-23  
> **Status**: Ready for execution  
> **Priority**: High

---

## Summary

This plan covers 4 areas of improvement requested by the user:

1. **Edit Saved Teams** — Ability to edit existing teams from Home page
2. **Battle UI Fixes** — Field Conditions bar overlapping + item record input z-index
3. **Battle Entry Flow** — Opponent slots should start empty (unknown Pokémon)
4. **Pokémon Data Update** — Add missing Mega evolutions and sync with op.gg pokedex

---

## Module 1: Edit Existing Saved Teams

### Problem
Home page (`/`) shows saved teams as cards, but clicking a team links to `/team/:id` which does **NOT exist** as a route (currently gives "No routes matched"). Users cannot edit or manage teams after saving.

### Solution

#### 1.1 Add `/builder/:teamId` route for editing

**File**: [App.tsx](file:///d:/ViTrain/pokemon-champions-app/src/App.tsx)

Add a new route:
```tsx
<Route path="/builder/:teamId" element={<Builder />} />
```

#### 1.2 Update Builder.tsx to load existing team

**File**: [Builder.tsx](file:///d:/ViTrain/pokemon-champions-app/src/pages/Builder.tsx)

Changes:
- Import `useParams` from `react-router-dom`
- On mount, if `teamId` param exists, load team from IndexedDB via `getTeam(teamId)`
- Populate `team` state and `teamName` with loaded data
- When saving, use the existing `teamId` instead of generating a new one (so it **updates** rather than duplicates)
- Add a `teamId` state variable to track whether we're editing or creating

```tsx
const { teamId: editTeamId } = useParams();
const [teamId, setTeamId] = useState<string | null>(editTeamId || null);

useEffect(() => {
  if (editTeamId) {
    getTeam(editTeamId).then(team => {
      if (team) {
        setTeam(team.pokemon);
        setTeamName(team.name);
        setTeamId(team.id);
      }
    });
  }
}, [editTeamId]);
```

In `handleSaveTeam`, use `teamId ?? crypto.randomUUID()` instead of always generating new:
```tsx
const id = teamId ?? crypto.randomUUID();
```

#### 1.3 Update Home.tsx team card links

**File**: [Home.tsx](file:///d:/ViTrain/pokemon-champions-app/src/pages/Home.tsx)

Change team card link from:
```tsx
<Link to={`/team/${team.id}`}>
```
To:
```tsx
<Link to={`/builder/${team.id}`}>
```

Also add an "Edit" button and a "Delete" button on each team card. The delete button should call `deleteTeam(team.id)` and refresh the list.

#### 1.4 Add "Battle with this team" button to team card

Each team card should also have a small "⚔️ Battle" button that navigates to:
```
/battle?teamId={team.id}
```

---

## Module 2: Fix Battle Field Conditions Bar Overlapping

### Problem
The `FieldConditionBar` (Weather, Tailwind, Trick Room) is positioned as `absolute` in the center of the battle board, using `top-1/2 -translate-y-1/2`. This causes it to **overlap** with opponent BattleSlot cards, particularly the new "Record item" input and predicted moves section.

### Solution

#### 2.1 Move FieldConditionBar out of the battle board

**File**: [Battle.tsx](file:///d:/ViTrain/pokemon-champions-app/src/pages/Battle.tsx) — Lines ~239-249

Instead of `absolute` positioning inside the battle card, move the `FieldConditionBar` to be a **normal flow element** between opponent and player sides:

Replace:
```tsx
{/* Field Conditions Bar */}
<div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 flex justify-center z-10 pointer-events-auto">
  <FieldConditionBar ... />
</div>
```

With:
```tsx
{/* Opponent Side */}
<div>...</div>

{/* Field Conditions - In-flow between sides */}
<div className="flex justify-center z-10 my-4">
  <FieldConditionBar ... />
</div>

{/* My Side */}
<div>...</div>
```

This removes the `absolute` positioning entirely and places the bar as a natural divider between the two sides.

#### 2.2 Improve FieldConditionBar responsiveness

**File**: [FieldConditionBar.tsx](file:///d:/ViTrain/pokemon-champions-app/src/components/battle/FieldConditionBar.tsx)

- Make the bar `flex-wrap` friendly for mobile
- Add Terrain buttons (Electric/Grassy/Psychic/Misty) which are currently missing
- Compact the text for small screens

---

## Module 3: Battle Entry — Opponent Slots Start Empty

### Problem
Currently, Battle page requires `?opponent=pokemon1,pokemon2` in the URL to pre-fill opponent slots. In the real game, you **don't know** what the opponent will bring until they appear on the field. Slots should start empty and let the user add opponent Pokémon as they're revealed.

### Solution

#### 3.1 Make opponent team optional

**File**: [Battle.tsx](file:///d:/ViTrain/pokemon-champions-app/src/pages/Battle.tsx) — `initBattleState` call (line ~51)

Change the flow:
- `oppTeam` should default to empty `[]`
- `initBattleState` should handle empty opponent gracefully (it already does — oppSlots will just be empty)
- Remove any hard requirement on `?opponent=` param

#### 3.2 Add "Add Opponent Pokémon" button to empty opponent slots

**File**: [BattleSlot.tsx](file:///d:/ViTrain/pokemon-champions-app/src/components/battle/BattleSlot.tsx)

When `slotState.pokemon === null` and `side === 'opponent'`:
- Show a "➕ Add Pokémon" button instead of just "Empty Slot"  
- Clicking it opens a `PokemonSearchModal` (reuse from builder)
- After selecting, the opponent slot is populated

#### 3.3 Add handler in Battle.tsx for adding opponent to slot

**File**: [Battle.tsx](file:///d:/ViTrain/pokemon-champions-app/src/pages/Battle.tsx)

Add a `handleAddOpponent(slotIndex: 0 | 1, pokemon: PokemonSpecies)` function that:
1. Sets the oppSlot's pokemon
2. Runs prediction engine for this newly added Pokémon
3. Logs it in turnLog

Also add a way to populate the entire opponent bench (by adding more than 2 opponent Pokémon to show who's on their team in the back).

---

## Module 4: Update Pokémon Data — Add Missing Mega Evolutions

### Problem
The current `pokemon.json` is missing Mega evolutions and possibly some newly released Pokémon that are available in Pokémon Champions. Data needs to be synced from the definitive source: https://op.gg/pokemon-champions/pokedex

### Solution

#### 4.1 Scrape data from op.gg

The op.gg pokedex is a client-rendered Next.js app. The actual Pokémon data is loaded via an API. 

**Approach**: Use browser subagent to:
1. Navigate to https://op.gg/pokemon-champions/pokedex
2. Scroll through the grid to load all Pokémon
3. Extract: name, types, base stats, abilities, moves from individual detail pages
4. Or, find the underlying API endpoint from the Network tab (likely something like `https://op.gg/api/pokemon-champions/pokedex?page=...`)

#### 4.2 Known missing Pokémon to add

Based on Pokémon Champions meta, these Mega evolutions and forms are likely missing:

| Pokémon | Types | Notes |
|---------|-------|-------|
| Mega Charizard X | Fire/Dragon | New Mega |
| Mega Charizard Y | Fire/Flying | New Mega |
| Mega Venusaur | Grass/Poison | New Mega |
| Mega Blastoise | Water | New Mega |
| Mega Gengar | Ghost/Poison | New Mega |
| Mega Kangaskhan | Normal | New Mega (Parental Bond) |
| Mega Gardevoir | Psychic/Fairy | New Mega |
| Mega Salamence | Dragon/Flying | New Mega (Aerilate) |
| Mega Metagross | Steel/Psychic | New Mega |
| Mega Lucario | Fighting/Steel | New Mega |
| Mega Scizor | Bug/Steel | New Mega |
| Mega Blaziken | Fire/Fighting | New Mega |
| Mega Swampert | Water/Ground | New Mega |
| Mega Sceptile | Grass/Dragon | New Mega |
| Mega Tyranitar | Rock/Dark | New Mega |
| Mega Garchomp | Dragon/Ground | New Mega |
| Mega Rayquaza | Dragon/Flying | New Mega |
| Mega Mewtwo X | Psychic/Fighting | New Mega |
| Mega Mewtwo Y | Psychic | New Mega |
| Mega Gyarados | Water/Dark | New Mega |

#### 4.3 Update `generate-db.cjs` or `pokemon.json` directly

**File**: [generate-db.cjs](file:///d:/ViTrain/pokemon-champions-app/src/data/generate-db.cjs)  
**File**: [pokemon.json](file:///d:/ViTrain/pokemon-champions-app/src/data/pokemon.json)

Two approaches:
1. **Preferred**: Update `generate-db.cjs` to include Mega forms as additional entries with correct stats, types, and abilities. Then re-run the script.
2. **Alternative**: Manually add entries to `pokemon.json` for each Mega form.

Each Mega entry should follow the existing schema:
```json
{
  "id": "charizard-mega-x",
  "name": "Mega Charizard X",
  "dexNumber": 6,
  "aliases": ["mega zard x", "mcharizardx"],
  "types": ["Fire", "Dragon"],
  "baseStats": { "hp": 78, "atk": 130, "def": 111, "spa": 130, "spd": 85, "spe": 100 },
  "abilities": ["Tough Claws"],
  "legalMoves": ["Flare Blitz", "Dragon Claw", "Earthquake", "Protect", ...],
  "roleTags": ["Physical Sweeper"]
}
```

> [!IMPORTANT]
> The exact stats and move lists **MUST** be verified from op.gg or official Pokémon Champions data. Do not guess stats. Use the browser subagent to scrape individual Pokémon detail pages from `https://op.gg/pokemon-champions/pokedex/{pokemonName}` for each Mega.

#### 4.4 Update `metaPresets.ts` for new Megas

**File**: [metaPresets.ts](file:///d:/ViTrain/pokemon-champions-app/src/lib/data/metaPresets.ts)

Add meta presets for the most commonly used Mega evolutions with typical items, natures, and movesets.

---

## Execution Order

1. **Module 2** (Battle UI Fix) — Quick fix, unblocks other work
2. **Module 3** (Empty Opponent Slots) — Important gameplay fix
3. **Module 1** (Edit Teams) — Core feature
4. **Module 4** (Pokémon Data) — Research-heavy, do last

---

## Verification

- [ ] Can edit a saved team from Home page via `/builder/:teamId`
- [ ] Saving an edited team updates the same entry (no duplicates)
- [ ] Delete team from Home page works
- [ ] Field Conditions bar does NOT overlap opponent cards
- [ ] Terrain buttons are available in FieldConditionBar
- [ ] Battle can start with no opponent Pokémon
- [ ] Can add opponent Pokémon dynamically during battle
- [ ] Mega evolutions appear in Pokémon search and Database
- [ ] Mega stats are accurate per op.gg data
- [ ] No Vite build errors after all changes
