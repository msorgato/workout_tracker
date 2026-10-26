export function LevelUpBanner({ level }: { level: number }) {
  return (
    <div
      role="status"
      className="animate-level-up flex flex-col items-center gap-1 rounded-card border border-accent bg-accent/15 px-6 py-4 text-center shadow-glow"
    >
      <span className="font-display text-5xl font-bold uppercase tracking-widest text-accent">
        Level up
      </span>
      <span className="font-display text-2xl font-bold uppercase tracking-wide text-text">
        Livello {level}
      </span>
    </div>
  )
}
