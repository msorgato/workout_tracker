import { stepValue } from '../../lib/numberInput'
import { IconButton } from './Button'

interface StepperProps {
  label: string
  unit?: string
  value: string
  step: number
  decimal?: boolean
  onChange: (value: string) => void
}

export function Stepper({ label, unit, value, step, decimal, onChange }: StepperProps) {
  return (
    <div className="flex w-full flex-col items-center gap-1">
      <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
        {unit ? ` (${unit})` : ''}
      </span>
      <div className="flex w-full items-center justify-between gap-1">
        <IconButton
          icon="minus"
          label={`Diminuisci ${label.toLowerCase()}`}
          variant="secondary"
          onClick={() => onChange(stepValue(value, -step))}
        />
        <input
          type="text"
          inputMode={decimal ? 'decimal' : 'numeric'}
          aria-label={label}
          value={value}
          placeholder="0"
          onChange={(event) => onChange(event.target.value)}
          onFocus={(event) => event.target.select()}
          className="w-full min-w-[6ch] bg-transparent text-center font-display text-3xl font-bold tabular-nums text-text focus:outline-none min-[360px]:text-4xl"
        />
        <IconButton
          icon="plus"
          label={`Aumenta ${label.toLowerCase()}`}
          variant="secondary"
          onClick={() => onChange(stepValue(value, step))}
        />
      </div>
    </div>
  )
}
