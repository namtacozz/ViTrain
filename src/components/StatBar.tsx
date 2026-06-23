export function StatBar({ label, value, max = 255, colorClass = "bg-blue-500" }: { label: string, value: number, max?: number, colorClass?: string }) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="flex items-center gap-2 text-xs">
      <span className="w-8 font-semibold text-muted-foreground uppercase">{label}</span>
      <span className="w-8 text-right font-mono">{value}</span>
      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
