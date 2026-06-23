const fs = require('fs');
const path = require('path');

const baseNames = [
  // Gen 1
  "Venusaur", "Charizard", "Blastoise", "Beedrill", "Pidgeot", "Arbok", "Pikachu", "Raichu", "Clefable", "Ninetales", "Vileplume", "Arcanine", "Alakazam", "Machamp", "Victreebel", "Slowbro", "Gengar", "Kangaskhan", "Starmie", "Pinsir", "Tauros", "Gyarados", "Ditto", "Vaporeon", "Jolteon", "Flareon", "Aerodactyl", "Snorlax", "Dragonite",
  // Gen 2
  "Meganium", "Typhlosion", "Feraligatr", "Ariados", "Ampharos", "Azumarill", "Politoed", "Espeon", "Umbreon", "Slowking", "Forretress", "Steelix", "Qwilfish", "Scizor", "Heracross", "Skarmory", "Houndoom", "Tyranitar",
  // Gen 3
  "Sceptile", "Blaziken", "Swampert", "Pelipper", "Gardevoir", "Sableye", "Mawile", "Aggron", "Medicham", "Manectric", "Sharpedo", "Camerupt", "Torkoal", "Altaria", "Milotic", "Castform", "Banette", "Chimecho", "Absol", "Glalie", "Metagross",
  // Gen 4
  "Torterra", "Infernape", "Empoleon", "Staraptor", "Luxray", "Roserade", "Rampardos", "Bastiodon", "Lopunny", "Spiritomb", "Garchomp", "Lucario", "Hippowdon", "Toxicroak", "Abomasnow", "Weavile", "Rhyperior", "Leafeon", "Glaceon", "Gliscor", "Mamoswine", "Gallade", "Froslass", "Rotom",
  // Gen 5
  "Serperior", "Emboar", "Samurott", "Watchog", "Liepard", "Simisage", "Simisear", "Simipour", "Musharna", "Excadrill", "Audino", "Conkeldurr", "Scolipede", "Whimsicott", "Krookodile", "Scrafty", "Cofagrigus", "Garbodor", "Zoroark", "Reuniclus", "Vanilluxe", "Emolga", "Eelektross", "Chandelure", "Beartic", "Stunfisk", "Golurk", "Hydreigon", "Volcarona", "Amoonguss", "Tornadus", "Thundurus", "Landorus",
  // Gen 6
  "Chesnaught", "Delphox", "Greninja", "Diggersby", "Talonflame", "Vivillon", "Pyroar", "Floette", "Florges", "Pangoro", "Furfrou", "Meowstic", "Aegislash", "Aromatisse", "Slurpuff", "Malamar", "Barbaracle", "Dragalge", "Clawitzer", "Heliolisk", "Tyrantrum", "Aurorus", "Sylveon", "Hawlucha", "Dedenne", "Goodra", "Klefki", "Trevenant", "Gourgeist", "Avalugg", "Noivern", "Volcanion",
  // Gen 7
  "Decidueye", "Incineroar", "Primarina", "Toucannon", "Crabominable", "Lycanroc", "Toxapex", "Mudsdale", "Araquanid", "Salazzle", "Tsareena", "Oranguru", "Passimian", "Mimikyu", "Drampa", "Kommo-o", "Tapu Koko", "Tapu Lele", "Tapu Bulu", "Tapu Fini",
  // Gen 8
  "Corviknight", "Flapple", "Appletun", "Sandaconda", "Polteageist", "Hatterene", "Grimmsnarl", "Mr. Rime", "Runerigus", "Alcremie", "Falinks", "Morpeko", "Dragapult", "Wyrdeer", "Kleavor", "Basculegion", "Sneasler", "Overqwil", "Rillaboom", "Cinderace", "Inteleon", "Urshifu", "Regieleki", "Regidrago", "Glastrier", "Spectrier", "Calyrex", "Ursaluna", "Enamorus",
  // Gen 9
  "Meowscarada", "Skeledirge", "Quaquaval", "Maushold", "Garganacl", "Armarouge", "Ceruledge", "Bellibolt", "Scovillain", "Espathra", "Tinkaton", "Palafin", "Orthworm", "Glimmora", "Houndstone", "Annihilape", "Farigiraf", "Kingambit", "Gholdengo", "Sinistcha", "Archaludon", "Hydrapple", "Baxcalibur", "Flutter Mane", "Iron Hands", "Iron Bundle", "Iron Crown", "Raging Bolt", "Gouging Fire", "Ogerpon", "Chi-Yu", "Chien-Pao", "Ting-Lu", "Wo-Chien", "Terapagos"
];

const regionalForms = [
  { name: "Alolan Ninetales", apiName: "ninetales-alola", baseName: "Ninetales" },
  { name: "Alolan Raichu", apiName: "raichu-alola", baseName: "Raichu" },
  { name: "Galarian Slowbro", apiName: "slowbro-galar", baseName: "Slowbro" },
  { name: "Hisuian Arcanine", apiName: "arcanine-hisui", baseName: "Arcanine" },
  { name: "Hisuian Typhlosion", apiName: "typhlosion-hisui", baseName: "Typhlosion" },
  { name: "Paldean Tauros", apiName: "tauros-paldea-combat-breed", baseName: "Tauros" },
  { name: "Rapid Strike Urshifu", apiName: "urshifu-rapid-strike", baseName: "Urshifu" },
  { name: "Single Strike Urshifu", apiName: "urshifu-single-strike", baseName: "Urshifu" },
  { name: "Incarnate Tornadus", apiName: "tornadus-incarnate", baseName: "Tornadus" },
  { name: "Therian Landorus", apiName: "landorus-therian", baseName: "Landorus" },
  { name: "Incarnate Landorus", apiName: "landorus-incarnate", baseName: "Landorus" },
  { name: "Incarnate Thundurus", apiName: "thundurus-incarnate", baseName: "Thundurus" },
  { name: "Bloodmoon Ursaluna", apiName: "ursaluna-bloodmoon", baseName: "Ursaluna" },
  { name: "Wellspring Ogerpon", apiName: "ogerpon-wellspring-mask", baseName: "Ogerpon" },
  { name: "Hearthflame Ogerpon", apiName: "ogerpon-hearthflame-mask", baseName: "Ogerpon" },
  { name: "Cornerstone Ogerpon", apiName: "ogerpon-cornerstone-mask", baseName: "Ogerpon" }
];

const officialMegas = [
  { name: "Mega Venusaur", apiName: "venusaur-mega", baseName: "Venusaur" },
  { name: "Mega Charizard X", apiName: "charizard-mega-x", baseName: "Charizard" },
  { name: "Mega Charizard Y", apiName: "charizard-mega-y", baseName: "Charizard" },
  { name: "Mega Blastoise", apiName: "blastoise-mega", baseName: "Blastoise" },
  { name: "Mega Beedrill", apiName: "beedrill-mega", baseName: "Beedrill" },
  { name: "Mega Pidgeot", apiName: "pidgeot-mega", baseName: "Pidgeot" },
  { name: "Mega Alakazam", apiName: "alakazam-mega", baseName: "Alakazam" },
  { name: "Mega Slowbro", apiName: "slowbro-mega", baseName: "Slowbro" },
  { name: "Mega Gengar", apiName: "gengar-mega", baseName: "Gengar" },
  { name: "Mega Kangaskhan", apiName: "kangaskhan-mega", baseName: "Kangaskhan" },
  { name: "Mega Pinsir", apiName: "pinsir-mega", baseName: "Pinsir" },
  { name: "Mega Gyarados", apiName: "gyarados-mega", baseName: "Gyarados" },
  { name: "Mega Aerodactyl", apiName: "aerodactyl-mega", baseName: "Aerodactyl" },
  { name: "Mega Ampharos", apiName: "ampharos-mega", baseName: "Ampharos" },
  { name: "Mega Steelix", apiName: "steelix-mega", baseName: "Steelix" },
  { name: "Mega Scizor", apiName: "scizor-mega", baseName: "Scizor" },
  { name: "Mega Heracross", apiName: "heracross-mega", baseName: "Heracross" },
  { name: "Mega Houndoom", apiName: "houndoom-mega", baseName: "Houndoom" },
  { name: "Mega Tyranitar", apiName: "tyranitar-mega", baseName: "Tyranitar" },
  { name: "Mega Sceptile", apiName: "sceptile-mega", baseName: "Sceptile" },
  { name: "Mega Blaziken", apiName: "blaziken-mega", baseName: "Blaziken" },
  { name: "Mega Swampert", apiName: "swampert-mega", baseName: "Swampert" },
  { name: "Mega Gardevoir", apiName: "gardevoir-mega", baseName: "Gardevoir" },
  { name: "Mega Sableye", apiName: "sableye-mega", baseName: "Sableye" },
  { name: "Mega Mawile", apiName: "mawile-mega", baseName: "Mawile" },
  { name: "Mega Aggron", apiName: "aggron-mega", baseName: "Aggron" },
  { name: "Mega Medicham", apiName: "medicham-mega", baseName: "Medicham" },
  { name: "Mega Manectric", apiName: "manectric-mega", baseName: "Manectric" },
  { name: "Mega Sharpedo", apiName: "sharpedo-mega", baseName: "Sharpedo" },
  { name: "Mega Camerupt", apiName: "camerupt-mega", baseName: "Camerupt" },
  { name: "Mega Altaria", apiName: "altaria-mega", baseName: "Altaria" },
  { name: "Mega Banette", apiName: "banette-mega", baseName: "Banette" },
  { name: "Mega Absol", apiName: "absol-mega", baseName: "Absol" },
  { name: "Mega Glalie", apiName: "glalie-mega", baseName: "Glalie" },
  { name: "Mega Metagross", apiName: "metagross-mega", baseName: "Metagross" },
  { name: "Mega Lopunny", apiName: "lopunny-mega", baseName: "Lopunny" },
  { name: "Mega Garchomp", apiName: "garchomp-mega", baseName: "Garchomp" },
  { name: "Mega Lucario", apiName: "lucario-mega", baseName: "Lucario" },
  { name: "Mega Abomasnow", apiName: "abomasnow-mega", baseName: "Abomasnow" },
  { name: "Mega Gallade", apiName: "gallade-mega", baseName: "Gallade" },
  { name: "Mega Audino", apiName: "audino-mega", baseName: "Audino" }
];

const customMegas = {
  "Mega Glimmora": {
    baseName: "Glimmora",
    statsDiff: { hp: 0, atk: 10, def: 30, spa: 35, spd: 30, spe: 0 },
    abilities: ["Toxic Debris", "Corrosion"],
    types: ["Rock", "Poison"],
    roleTags: ["attacker special", "support"]
  },
  "Mega Baxcalibur": {
    baseName: "Baxcalibur",
    statsDiff: { hp: 0, atk: 40, def: 20, spa: 10, spd: 20, spe: 10 },
    abilities: ["Thermal Exchange"],
    types: ["Dragon", "Ice"],
    roleTags: ["attacker physical"]
  },
  "Mega Pyroar": {
    baseName: "Pyroar",
    statsDiff: { hp: 0, atk: 0, def: 20, spa: 40, spd: 20, spe: 20 },
    abilities: ["Royal Presence", "Adaptability"],
    types: ["Fire", "Normal"],
    roleTags: ["attacker special"]
  },
  "Mega Scovillain": {
    baseName: "Scovillain",
    statsDiff: { hp: 0, atk: 20, def: 20, spa: 40, spd: 20, spe: 0 },
    abilities: ["Chlorophyll", "Moody"],
    types: ["Grass", "Fire"],
    roleTags: ["attacker special", "attacker physical"]
  },
  "Mega Eelektross": {
    baseName: "Eelektross",
    statsDiff: { hp: 0, atk: 20, def: 20, spa: 20, spd: 20, spe: 20 },
    abilities: ["Levitate"],
    types: ["Electric"],
    roleTags: ["attacker physical", "attacker special"]
  },
  "Mega Floette": {
    baseName: "Floette",
    statsDiff: { hp: 20, atk: 20, def: 20, spa: 50, spd: 30, spe: 40 },
    abilities: ["Flower Veil", "Light Shield"],
    types: ["Fairy"],
    roleTags: ["attacker special", "support"]
  },
  "Mega Dragalge": {
    baseName: "Dragalge",
    statsDiff: { hp: 0, atk: 0, def: 30, spa: 40, spd: 30, spe: 0 },
    abilities: ["Adaptability", "Poison Touch"],
    types: ["Poison", "Dragon"],
    roleTags: ["attacker special"]
  }
};

const competitiveMoves = new Set([
  "Protect", "Detect", "Fake Out", "Tailwind", "Trick Room", "Helping Hand", "Rage Powder", "Follow Me", 
  "Spiky Shield", "Baneful Bunker", "Burning Bulwark", "Wide Guard", "Quick Guard", "Ally Switch", 
  "Thunder Wave", "Will-O-Wisp", "Yawn", "Spore", "Sleep Powder", "Taunt", "Encore", "Haze", "Roar", 
  "Whirlwind", "Snarl", "Pollen Puff", "Clear Smog", "U-turn", "Volt Switch", "Flip Turn", "Parting Shot", 
  "Draco Meteor", "Overheat", "Leaf Storm", "Make It Rain", "Blood Moon", "Astral Barrage", "Glacial Lance", 
  "Precipice Blades", "Origin Pulse", "Water Spout", "Collision Course", "Electro Drift", "Ivy Cudgel", 
  "Surging Strikes", "Wicked Blow", "Extreme Speed", "Sucker Punch", "Aqua Jet", "Shadow Sneak", 
  "Mach Punch", "Ice Shard", "Bullet Punch", "Fake Tears", "Sunny Day", "Rain Dance", "Sandstorm", 
  "Snowscape", "Aurora Veil", "Reflect", "Light Screen", "Earthquake", "Earth Power", "Land's Wrath", 
  "High Horsepower", "Stomping Tantrum", "Close Combat", "Drain Punch", "Superpower", "Aura Sphere", 
  "Focus Blast", "Body Press", "Moonblast", "Dazzling Gleam", "Spirit Break", "Play Rough", "Draining Kiss", 
  "Hurricane", "Brave Bird", "Air Slash", "Bleakwind Storm", "Sandsear Storm", "Wildbolt Storm", "Springtide Storm", 
  "Hydro Pump", "Surf", "Muddy Water", "Scald", "Liquidation", "Aqua Step", "Heat Wave", "Flare Blitz", 
  "Fire Blast", "Flamethrower", "Fiery Wrath", "Armor Cannon", "Bitter Blade", "Gigaton Hammer", "Iron Head", 
  "Flash Cannon", "Steel Roller", "Shadow Ball", "Phantom Force", "Shadow Claw", "Hex", "Poltergeist", 
  "Thunderbolt", "Thunder", "Wild Charge", "Electro Shot", "Thunderclap", "Giga Drain", "Wood Hammer", 
  "Horn Leech", "Grassy Glide", "Solar Beam", "Energy Ball", "Frenzy Plant", "Blast Burn", "Hydro Cannon", 
  "Ice Beam", "Blizzard", "Icy Wind", "Freeze-Dry", "Icicle Crash", "Ice Spinner", "Dragon Claw", "Outrage", 
  "Dragon Pulse", "Psychic", "Psyshock", "Expanding Force", "Psychic Noise", "Zen Headbutt", "Rock Slide", 
  "Stone Edge", "Power Gem", "Rock Tomb", "Sludge Bomb", "Sludge Wave", "Gunk Shot", "Poison Jab", 
  "Dire Claw", "Mortal Spin", "Dark Pulse", "Knock Off", "Foul Play", "Ruination", "Bug Buzz", "Lunge", 
  "Swords Dance", "Nasty Plot", "Calm Mind", "Dragon Dance", "Roost", "Recover", "Slack Off", "Wish", "Life Dew"
]);

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
const formatMoveName = (name) => name.split('-').map(capitalize).join(' ');
const formatAbilityName = (name) => name.split('-').map(capitalize).join(' ');

async function fetchWithRetry(url, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) return await res.json();
      if (res.status === 404) return null;
    } catch (e) {
      if (i === retries - 1) throw e;
      await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
    }
  }
  return null;
}

async function fetchPokemonData(name) {
  const slugs = [
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-male',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-shield',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-average',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-midday',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-disguised',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-full-belly',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-zero',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-phony',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-unremarkable',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-family-of-four',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-meadow',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-incarnate',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-single-strike',
    name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-teal-mask',
  ];

  for (const slug of slugs) {
    const data = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${slug}`);
    if (data) return data;
  }
  return null;
}

function determineRoleTags(stats, abilities, legalMoves) {
  const tags = [];
  const movesSet = new Set(legalMoves);

  // Weather Setters
  if (abilities.some(a => ["Drizzle", "Drought", "Sand Stream", "Snow Warning", "Orichalcum Pulse"].includes(a))) {
    tags.push("weather setter");
  }

  // Terrain Setters
  if (abilities.some(a => ["Grassy Surge", "Electric Surge", "Psychic Surge", "Misty Surge", "Hadron Engine"].includes(a))) {
    tags.push("terrain setter");
  }

  // Speed Control
  if (movesSet.has("Tailwind") || movesSet.has("Icy Wind") || movesSet.has("Thunder Wave")) {
    tags.push("speed control");
  }

  // Trick Room
  if (movesSet.has("Trick Room")) {
    tags.push("Trick Room setter");
  }

  // Redirection
  if (movesSet.has("Follow Me") || movesSet.has("Rage Powder")) {
    tags.push("redirection");
  }

  // Support
  if (abilities.some(a => ["Intimidate", "Prankster", "Hospitality", "Friend Guard"].includes(a)) || 
      movesSet.has("Fake Out") || movesSet.has("Parting Shot") || movesSet.has("Helping Hand") || 
      movesSet.has("Reflect") || movesSet.has("Light Screen") || movesSet.has("Taunt") || movesSet.has("Encore") || movesSet.has("Spore")) {
    if (!tags.includes("support")) {
      tags.push("support");
    }
  }

  // Priority
  if (movesSet.has("Extreme Speed") || movesSet.has("Sucker Punch") || movesSet.has("Aqua Jet") || movesSet.has("Shadow Sneak") || movesSet.has("Ice Shard")) {
    tags.push("priority");
  }

  // Pivot
  if (movesSet.has("U-turn") || movesSet.has("Volt Switch") || movesSet.has("Flip Turn") || movesSet.has("Parting Shot")) {
    tags.push("pivot");
  }

  // Attackers
  if (stats.atk >= 95 && stats.atk >= stats.spa) {
    tags.push("attacker physical");
  }
  if (stats.spa >= 95 && stats.spa > stats.atk) {
    tags.push("attacker special");
  }

  // Tank
  if (stats.hp >= 90 && (stats.def >= 90 || stats.spd >= 90)) {
    tags.push("tank");
  }

  // Default cleanup
  if (tags.length === 0) {
    if (stats.atk >= stats.spa) {
      tags.push("attacker physical");
    } else {
      tags.push("attacker special");
    }
  }

  return [...new Set(tags)];
}

async function run() {
  console.log(`Starting database generation for Pokémon Champions roster...`);
  const finalRoster = [];
  const fetchedCache = {};

  // 1. Fetch all Base Species
  console.log(`Fetching ${baseNames.length} base species from PokeAPI...`);
  for (let i = 0; i < baseNames.length; i++) {
    const name = baseNames[i];
    process.stdout.write(`[${i+1}/${baseNames.length}] ${name}... `);
    try {
      const data = await fetchPokemonData(name);
      if (!data) {
        console.log(`❌ Failed (not found)`);
        continue;
      }

      const stats = {
        hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
        atk: data.stats.find(s => s.stat.name === 'attack').base_stat,
        def: data.stats.find(s => s.stat.name === 'defense').base_stat,
        spa: data.stats.find(s => s.stat.name === 'special-attack').base_stat,
        spd: data.stats.find(s => s.stat.name === 'special-defense').base_stat,
        spe: data.stats.find(s => s.stat.name === 'speed').base_stat
      };

      const types = data.types.map(t => capitalize(t.type.name));
      const abilities = data.abilities.map(a => formatAbilityName(a.ability.name));
      
      const allMoves = data.moves.map(m => formatMoveName(m.move.name));
      let legalMoves = allMoves.filter(m => competitiveMoves.has(m));
      if (legalMoves.length < 5) {
        legalMoves = allMoves.slice(0, 12);
      }
      legalMoves = [...new Set(legalMoves)];

      const roleTags = determineRoleTags(stats, abilities, legalMoves);
      
      const entry = {
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: name,
        dexNumber: data.id,
        aliases: [name.toLowerCase().substring(0, 4), name.toLowerCase()],
        types,
        baseStats: stats,
        abilities,
        legalMoves,
        roleTags
      };

      finalRoster.push(entry);
      fetchedCache[name] = entry;
      console.log(`✅ Success`);
    } catch (e) {
      console.log(`❌ Failed with error: ${e.message}`);
    }
  }

  // 2. Fetch Regional Forms
  console.log(`\nFetching ${regionalForms.length} regional forms from PokeAPI...`);
  for (let i = 0; i < regionalForms.length; i++) {
    const form = regionalForms[i];
    process.stdout.write(`[Form ${i+1}/${regionalForms.length}] ${form.name}... `);
    try {
      const data = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${form.apiName}`);
      if (!data) {
        console.log(`❌ Failed (not found)`);
        continue;
      }

      const stats = {
        hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
        atk: data.stats.find(s => s.stat.name === 'attack').base_stat,
        def: data.stats.find(s => s.stat.name === 'defense').base_stat,
        spa: data.stats.find(s => s.stat.name === 'special-attack').base_stat,
        spd: data.stats.find(s => s.stat.name === 'special-defense').base_stat,
        spe: data.stats.find(s => s.stat.name === 'speed').base_stat
      };

      const types = data.types.map(t => capitalize(t.type.name));
      const abilities = data.abilities.map(a => formatAbilityName(a.ability.name));
      
      const allMoves = data.moves.map(m => formatMoveName(m.move.name));
      let legalMoves = allMoves.filter(m => competitiveMoves.has(m));
      if (legalMoves.length < 5) {
        const baseSpec = fetchedCache[form.baseName];
        if (baseSpec) legalMoves = baseSpec.legalMoves;
        else legalMoves = allMoves.slice(0, 12);
      }
      legalMoves = [...new Set(legalMoves)];

      const roleTags = determineRoleTags(stats, abilities, legalMoves);

      finalRoster.push({
        id: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: form.name,
        dexNumber: data.id,
        aliases: [form.name.toLowerCase(), form.apiName],
        types,
        baseStats: stats,
        abilities,
        legalMoves,
        roleTags
      });
      console.log(`✅ Success`);
    } catch (e) {
      console.log(`❌ Failed with error: ${e.message}`);
    }
  }

  // 3. Fetch Official Megas
  console.log(`\nFetching ${officialMegas.length} official Mega Evolutions...`);
  for (let i = 0; i < officialMegas.length; i++) {
    const mega = officialMegas[i];
    process.stdout.write(`[Mega ${i+1}/${officialMegas.length}] ${mega.name}... `);
    try {
      const data = await fetchWithRetry(`https://pokeapi.co/api/v2/pokemon/${mega.apiName}`);
      if (!data) {
        console.log(`❌ Failed (not found)`);
        continue;
      }

      const stats = {
        hp: data.stats.find(s => s.stat.name === 'hp').base_stat,
        atk: data.stats.find(s => s.stat.name === 'attack').base_stat,
        def: data.stats.find(s => s.stat.name === 'defense').base_stat,
        spa: data.stats.find(s => s.stat.name === 'special-attack').base_stat,
        spd: data.stats.find(s => s.stat.name === 'special-defense').base_stat,
        spe: data.stats.find(s => s.stat.name === 'speed').base_stat
      };

      const types = data.types.map(t => capitalize(t.type.name));
      const abilities = data.abilities.map(a => formatAbilityName(a.ability.name));

      let legalMoves = [];
      const baseSpec = fetchedCache[mega.baseName];
      if (baseSpec) {
        legalMoves = baseSpec.legalMoves;
      } else {
        const allMoves = data.moves.map(m => formatMoveName(m.move.name));
        legalMoves = allMoves.filter(m => competitiveMoves.has(m));
      }
      legalMoves = [...new Set(legalMoves)];

      const roleTags = determineRoleTags(stats, abilities, legalMoves);

      finalRoster.push({
        id: mega.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: mega.name,
        dexNumber: data.id,
        aliases: [mega.name.toLowerCase(), mega.apiName],
        types,
        baseStats: stats,
        abilities,
        legalMoves,
        roleTags
      });
      console.log(`✅ Success`);
    } catch (e) {
      console.log(`❌ Failed with error: ${e.message}`);
    }
  }

  // 4. Generate Custom Megas
  console.log(`\nGenerating custom Mega Evolutions...`);
  for (const [megaName, custom] of Object.entries(customMegas)) {
    process.stdout.write(`Custom Mega: ${megaName}... `);
    const baseSpec = fetchedCache[custom.baseName];
    if (!baseSpec) {
      console.log(`❌ Base Pokémon ${custom.baseName} not found in roster!`);
      continue;
    }

    const stats = {
      hp: baseSpec.baseStats.hp + custom.statsDiff.hp,
      atk: baseSpec.baseStats.atk + custom.statsDiff.atk,
      def: baseSpec.baseStats.def + custom.statsDiff.def,
      spa: baseSpec.baseStats.spa + custom.statsDiff.spa,
      spd: baseSpec.baseStats.spd + custom.statsDiff.spd,
      spe: baseSpec.baseStats.spe + custom.statsDiff.spe
    };

    finalRoster.push({
      id: megaName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: megaName,
      dexNumber: baseSpec.dexNumber,
      aliases: [megaName.toLowerCase()],
      types: custom.types,
      baseStats: stats,
      abilities: custom.abilities,
      legalMoves: baseSpec.legalMoves,
      roleTags: custom.roleTags
    });
    console.log(`✅ Success`);
  }

  // 5. Write file
  const outputPath = path.join(__dirname, 'pokemon.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalRoster, null, 2), 'utf8');
  console.log(`\nSuccessfully wrote ${finalRoster.length} entries to ${outputPath}`);
}

run();
