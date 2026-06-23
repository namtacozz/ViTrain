export function EmptySlot({ slotNumber, onClick }: { slotNumber: number, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-background hover:border-blue-500 hover:bg-secondary transition-all h-36 w-full group"
    >
      <span className="text-3xl text-muted-foreground group-hover:text-blue-500 transition-colors">+</span>
      <span className="text-[11px] text-muted-foreground mt-1">Slot {slotNumber}</span>
    </button>
  );
}
