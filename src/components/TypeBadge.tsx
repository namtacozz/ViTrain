import { TYPE_COLORS } from '../lib/utils/typeColors';

export function TypeBadge({ type, size = 'sm' }: { type: string; size?: 'xs' | 'sm' | 'md' }) {
  const colors = TYPE_COLORS[type] || { bg: 'bg-gray-500', text: 'text-white', border: 'border-gray-500' };
  const sizeClass = {
    xs: 'text-[9px] px-1.5 py-0.5',
    sm: 'text-[10px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
  }[size];
  return (
    <span className={`${colors.bg} ${colors.text} ${sizeClass} rounded-full font-bold uppercase tracking-wide inline-block`}>
      {type}
    </span>
  );
}
