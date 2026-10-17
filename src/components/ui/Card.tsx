import type { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glow?: boolean
}

export function Card({ glow, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`animate-fade-up rounded-card border bg-surface-raised p-4 shadow-card ${
        glow ? 'border-accent/50 shadow-glow' : 'border-border'
      } ${className}`}
      {...rest}
    />
  )
}
