import { useEffect, useRef, useState } from 'react'
import restCompleteSound from '../../assets/sounds/rest-complete.wav'

interface RestTimerProps {
  targetSeconds: number
  onFinish: () => void
}

export function RestTimer({ targetSeconds, onFinish }: RestTimerProps) {
  const [remaining, setRemaining] = useState(targetSeconds)
  const onFinishRef = useRef(onFinish)
  const finishedRef = useRef(false)
  onFinishRef.current = onFinish

  useEffect(() => {
    setRemaining(targetSeconds)
    finishedRef.current = false
  }, [targetSeconds])

  useEffect(() => {
    if (remaining <= 0) {
      if (!finishedRef.current) {
        finishedRef.current = true
        const audio = new Audio(restCompleteSound)
        audio.play().catch(() => {
          // Autoplay può essere bloccato dal browser prima di un'interazione utente: non bloccante.
        })

        if (typeof navigator.vibrate === 'function') {
          navigator.vibrate(400)
        }

        onFinishRef.current()
      }
      return
    }

    const timeout = setTimeout(() => setRemaining((current) => current - 1), 1000)
    return () => clearTimeout(timeout)
  }, [remaining])

  function handleSkip() {
    finishedRef.current = true
    setRemaining(0)
    onFinishRef.current()
  }

  return (
    <div className="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-4 py-2">
      <span className="text-2xl font-semibold tabular-nums text-blue-700">
        {Math.max(0, remaining)}s
      </span>
      <span className="text-sm text-blue-600">Recupero</span>
      <button
        type="button"
        onClick={handleSkip}
        className="ml-auto rounded-md border border-blue-300 px-3 py-1 text-xs font-medium text-blue-700"
      >
        Salta
      </button>
    </div>
  )
}
