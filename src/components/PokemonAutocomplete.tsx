import { useState, useEffect, useRef, useMemo } from 'react';
import Fuse from 'fuse.js';
import pokemonData from '../data/pokemon.json';
import type { PokemonSpecies } from '../types/pokemon';

interface Props {
  onSelect: (pokemon: PokemonSpecies) => void;
  placeholder?: string;
  className?: string;
}

export default function PokemonAutocomplete({ onSelect, placeholder = "Search Pokémon...", className }: Props) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PokemonSpecies[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize Fuse.js for search (memoized to prevent recreation)
  const fuse = useMemo(() => new Fuse(pokemonData as PokemonSpecies[], {
    keys: ['name', 'aliases'],
    threshold: 0.4,
  }), []);

  useEffect(() => {
    if (query.trim() === '') {
      setSuggestions([]);
      return;
    }
    const results = fuse.search(query).map(r => r.item);
    setSuggestions(results.slice(0, 5));
    setSelectedIndex(0);
  }, [query, fuse]);

  // Handle clicking outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions[selectedIndex]) {
        handleSelect(suggestions[selectedIndex]!);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (pokemon: PokemonSpecies) => {
    onSelect(pokemon);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-background border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-60 overflow-auto">
          {suggestions.map((p, idx) => (
            <li
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`px-3 py-2 text-sm cursor-pointer hover:bg-secondary flex justify-between items-center ${
                idx === selectedIndex ? 'bg-secondary' : ''
              }`}
            >
              <span className="font-medium">{p.name}</span>
              <div className="flex gap-1">
                {p.types.map(t => (
                  <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-muted font-semibold">
                    {t}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
