import { useEffect } from 'react'

interface XpPopProps {
  amount: number
  onDone: () => void
  className?: string
}

const SAFETY_TIMEOUT_MS = 1200

/**
 * Etichetta "+N XP" animata. Con "riduci movimento" l'animazione è azzerata e
 * `animationend` non scatta: il timeout garantisce che resti leggibile un istante e poi sparisca.
 */
export function XpPop({ amount, onDone, className = '' }: XpPopProps) {
  useEffect(() => {
    const timeout = setTimeout(onDone, SAFETY_TIMEOUT_MS)
    return () => clearTimeout(timeout)
  }, [onDone])

  return (
    <span
      role="status"
      aria-live="polite"
      onAnimationEnd={onDone}
      className={`pointer-events-none animate-xp-float rounded-full bg-accent px-3 py-1 font-display text-lg font-bold tabular-nums text-accent-contrast shadow-glow ${className}`}
    >
      +{amount} XP
    </span>
  )
}
