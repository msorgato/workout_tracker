interface XpBarProps {
  /** 0..1 */
  fraction: number
  /** Salta la transizione (reset a 0 dopo un level up). */
  instant?: boolean
}

export function XpBar({ fraction, instant }: XpBarProps) {
  const percent = Math.round(Math.min(1, Math.max(0, fraction)) * 100)
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      className="h-3 w-full overflow-hidden rounded-full bg-surface"
    >
      <div
        className={`h-full rounded-full bg-gradient-to-r from-accent-pressed to-accent shadow-glow ${
          instant ? '' : 'transition-[width] duration-700 ease-out'
        }`}
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
