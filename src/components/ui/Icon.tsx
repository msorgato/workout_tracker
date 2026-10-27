import type { SVGProps } from 'react'

const PATHS = {
  dumbbell: 'M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11',
  play: 'M7 4.5v15l12-7.5z',
  timer: 'M10 2h4M12 14l3-3M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  list: 'M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01',
  plus: 'M12 5v14M5 12h14',
  pencil: 'M17 3l4 4L8 20l-5 1 1-5z',
  trash: 'M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6',
  upload: 'M12 16V4M7 9l5-5 5 5M4 20h16',
  'log-out': 'M9 21H5V3h4M16 17l5-5-5-5M21 12H9',
  'chevron-left': 'M15 5l-7 7 7 7',
  check: 'M4 12.5l5 5L20 6.5',
  info: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01',
  lightbulb:
    'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z',
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  minus: 'M5 12h14',
  x: 'M6 6l12 12M18 6L6 18',
  flame:
    'M12 22a7 7 0 0 0 7-7c0-3-2-5-3-7-1 2-2 3-3.5 3.5C13 8 12.5 5 10 2 9 6 5 9 5 15a7 7 0 0 0 7 7z',
} as const

export type IconName = keyof typeof PATHS

interface IconProps extends Omit<SVGProps<SVGSVGElement>, 'name'> {
  name: IconName
  size?: number
}

export function Icon({ name, size = 20, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      <path d={PATHS[name]} />
    </svg>
  )
}
