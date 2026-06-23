import { getSpriteUrl } from '../lib/utils/sprites';

interface PokemonSpriteProps {
  dexNumber: number;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = { sm: 'h-6 w-6', md: 'h-10 w-10', lg: 'h-16 w-16', xl: 'h-24 w-24' };

export function PokemonSprite({ dexNumber, name, size = 'md', className }: PokemonSpriteProps) {
  return (
    <img
      src={getSpriteUrl(dexNumber)}
      alt={name}
      className={`${sizeMap[size]} object-contain ${className ?? ''}`}
      loading="lazy"
    />
  );
}
