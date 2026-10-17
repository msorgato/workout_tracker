import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'
import restCompleteSound from '../../assets/sounds/rest-complete.wav'

interface RestTimerProps {
  targetSeconds: number
  exerciseName?: string
  onFinish: () => void
}

export function RestTimer({ targetSeconds, exerciseName, onFinish }: RestTimerProps) {
  const [remaining, setRemaining] = useState(targetSeconds)
  const onFinishRef = useRef(onFinish)
  const finishedRef = useRef(false)
  // Scadenza assoluta (non un contatore a scalare): un setTimeout/setInterval
  // viene fortemente rallentato o sospeso quando la tab è in background o lo
  // schermo è bloccato. Calcolare il tempo restante da Date.now() ad ogni tick
  // — e soprattutto al rientro in foreground (`visibilitychange`) — permette
  // di recuperare suono e vibrazione subito quando l'utente torna sulla tab,
  // anche se il countdown sarebbe già scaduto nel frattempo.
  const deadlineRef = useRef(Date.now() + targetSeconds * 1000)
  onFinishRef.current = onFinish

  useEffect(() => {
    function tick() {
      if (finishedRef.current) return
      const secondsLeft = Math.ceil((deadlineRef.current - Date.now()) / 1000)
      if (secondsLeft <= 0) {
        finishedRef.current = true
        setRemaining(0)

        const audio = new Audio(restCompleteSound)
        audio.play().catch(() => {
          // Autoplay può essere bloccato dal browser prima di un'interazione utente: non bloccante.
        })

        if (typeof navigator.vibrate === 'function') {
          navigator.vibrate([300, 100, 300])
        }

        onFinishRef.current()
      } else {
        setRemaining(secondsLeft)
      }
    }

    const interval = setInterval(tick, 1000)
    document.addEventListener('visibilitychange', tick)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', tick)
    }
  }, [])

  function handleSkip() {
    finishedRef.current = true
    setRemaining(0)
    onFinishRef.current()
  }

  const radius = 22
  const circumference = 2 * Math.PI * radius
  const progress = targetSeconds > 0 ? Math.min(1, Math.max(0, remaining / targetSeconds)) : 0

  return (
    <div className="flex animate-fade-up items-center gap-3 rounded-card border border-accent/50 bg-surface-raised/95 px-4 py-3 shadow-glow backdrop-blur">
      <div className="relative size-14 shrink-0">
        <svg viewBox="0 0 56 56" className="size-14 -rotate-90" aria-hidden="true">
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            strokeWidth="4"
            className="stroke-border"
          />
          <circle
            cx="28"
            cy="28"
            r={radius}
            fill="none"
            strokeWidth="4"
            strokeLinecap="round"
            className="stroke-accent transition-[stroke-dashoffset] duration-1000 ease-linear"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold tabular-nums text-accent">
          {Math.max(0, remaining)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-display text-xl font-bold uppercase leading-none tracking-wide text-accent">
          Recupero
        </p>
        {exerciseName && <p className="truncate text-sm text-text-muted">{exerciseName}</p>}
      </div>
      <Button onClick={handleSkip}>Salta</Button>
    </div>
  )
}
