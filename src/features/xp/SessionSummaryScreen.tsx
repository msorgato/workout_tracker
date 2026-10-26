import { useEffect, useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { LevelUpBanner } from './LevelUpBanner'
import { useCountUp } from './useCountUp'
import { XpBar } from './XpBar'
import { levelProgress } from './xp'

export interface SessionSummaryData {
  xpGained: number
  setCount: number
  volumeKg: number
  /** XP totali prima / dopo la sessione; null se lo storico non era leggibile. */
  before: number | null
  after: number | null
}

const BAR_START_DELAY_MS = 150
const LEVEL_FILL_MS = 800

function reducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function SessionSummaryScreen({
  summary,
  onClose,
}: {
  summary: SessionSummaryData
  onClose: () => void
}) {
  const xp = useCountUp(summary.xpGained)
  const hasLevel = summary.before !== null && summary.after !== null
  const from = levelProgress(summary.before ?? 0)
  const to = levelProgress(summary.after ?? 0)
  const leveledUp = hasLevel && to.level > from.level

  const [animated] = useState(() => !reducedMotion())
  const [shownLevel, setShownLevel] = useState(animated ? from.level : to.level)
  const [fraction, setFraction] = useState(animated ? from.fraction : to.fraction)
  const [instant, setInstant] = useState(false)
  const [showBanner, setShowBanner] = useState(!animated && leveledUp)

  useEffect(() => {
    if (!hasLevel || !animated) return
    const timers: ReturnType<typeof setTimeout>[] = []
    timers.push(setTimeout(() => setFraction(leveledUp ? 1 : to.fraction), BAR_START_DELAY_MS))
    if (leveledUp) {
      timers.push(
        setTimeout(() => {
          setShowBanner(true)
          setShownLevel(to.level)
          setInstant(true)
          setFraction(0)
        }, BAR_START_DELAY_MS + LEVEL_FILL_MS),
      )
      timers.push(
        setTimeout(
          () => {
            setInstant(false)
            setFraction(to.fraction)
          },
          BAR_START_DELAY_MS + LEVEL_FILL_MS + 60,
        ),
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [hasLevel, animated, leveledUp, to.fraction, to.level])

  return (
    <div className="flex min-h-[70dvh] flex-col justify-center gap-4 pt-[env(safe-area-inset-top)]">
      <div className="flex animate-fade-up flex-col items-center gap-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-wider text-text-muted">
          Sessione conclusa
        </p>
        <p className="font-display text-7xl font-bold tabular-nums text-accent">+{xp} XP</p>
      </div>

      {showBanner && <LevelUpBanner level={to.level} />}

      {hasLevel && (
        <Card className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-2xl font-bold uppercase tracking-wide text-text">
              Livello {shownLevel}
            </span>
            <span className="text-xs tabular-nums text-text-muted">
              {to.xpIntoLevel} / {to.xpForNext} XP
            </span>
          </div>
          <XpBar fraction={fraction} instant={instant} />
        </Card>
      )}

      <Card className="grid grid-cols-2 gap-3 text-center">
        <div>
          <p className="font-display text-3xl font-bold tabular-nums text-text">
            {summary.setCount}
          </p>
          <p className="text-xs text-text-muted">serie</p>
        </div>
        <div>
          <p className="font-display text-3xl font-bold tabular-nums text-text">
            {summary.volumeKg.toLocaleString('it-IT')} kg
          </p>
          <p className="text-xs text-text-muted">volume</p>
        </div>
      </Card>

      <Button variant="primary" size="lg" fullWidth onClick={onClose}>
        Vai allo storico
      </Button>
    </div>
  )
}
