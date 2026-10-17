import type { InputHTMLAttributes } from 'react'

export const inputClass =
  'min-h-11 w-full rounded-xl border border-border bg-surface px-3 text-base text-text placeholder:text-text-muted/60 focus:border-accent focus:outline-none'

export function TextField({
  label,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <input type="text" className={`${inputClass} ${className}`} {...rest} />
    </label>
  )
}

export function NumberField({
  label,
  className = '',
  ...rest
}: InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wider text-text-muted">
        {label}
      </span>
      <input
        type="number"
        inputMode="decimal"
        className={`${inputClass} text-center font-display text-xl font-semibold tabular-nums ${className}`}
        {...rest}
      />
    </label>
  )
}
