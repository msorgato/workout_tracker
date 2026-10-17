import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Icon, type IconName } from './Icon'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'danger-outline'
type Size = 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'bg-gradient-to-b from-accent to-accent-pressed text-accent-contrast shadow-glow hover:from-accent-hover',
  secondary: 'border border-border bg-surface-raised text-text hover:bg-surface-hover',
  ghost: 'text-text-muted hover:bg-surface-hover hover:text-text',
  danger: 'bg-danger text-white hover:bg-danger-hover',
  'danger-outline': 'border border-danger text-danger hover:bg-danger/10',
}

const SIZES: Record<Size, string> = {
  md: 'min-h-11 px-4 text-sm',
  lg: 'min-h-14 px-5 text-base',
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  icon?: IconName
  fullWidth?: boolean
  children: ReactNode
}

export function Button({
  variant = 'secondary',
  size = 'md',
  icon,
  fullWidth,
  className = '',
  type = 'button',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[0.97] motion-reduce:active:scale-100 disabled:opacity-50 disabled:active:scale-100 ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {icon && <Icon name={icon} size={size === 'lg' ? 22 : 18} />}
      {children}
    </button>
  )
}

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName
  label: string
  variant?: 'ghost' | 'secondary' | 'danger-outline'
}

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  className = '',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition active:scale-95 motion-reduce:active:scale-100 disabled:opacity-30 ${VARIANTS[variant]} ${className}`}
      {...rest}
    >
      <Icon name={icon} />
    </button>
  )
}
