import { getAvatar } from './avatars'

interface AvatarBadgeProps {
  avatarId: string | undefined
  /** Lato in px. */
  size?: number
  className?: string
}

/** Il badge SVG ha già sfondo verde squircle e icona nera: si mostra così com'è. */
export function AvatarBadge({ avatarId, size = 104, className = '' }: AvatarBadgeProps) {
  const avatar = getAvatar(avatarId)
  return (
    <img
      src={avatar.src}
      alt={`Avatar ${avatar.label}`}
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      style={{ width: size, height: size }}
    />
  )
}
