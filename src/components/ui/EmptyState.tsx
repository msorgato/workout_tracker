import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

interface EmptyStateProps {
  icon: IconName
  message: string
  children?: ReactNode
}

export function EmptyState({ icon, message, children }: EmptyStateProps) {
  return (
    <div className="flex animate-fade-up flex-col items-center gap-4 rounded-card border border-dashed border-border px-6 py-10 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-accent/10 text-accent">
        <Icon name={icon} size={32} />
      </span>
      <p className="max-w-xs text-sm text-text-muted">{message}</p>
      {children}
    </div>
  )
}
