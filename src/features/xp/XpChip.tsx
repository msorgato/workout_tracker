import { Icon } from '../../components/ui/Icon'

/** Contatore degli XP della sessione; la key sul valore rilancia l'animazione a ogni variazione. */
export function XpChip({ xp }: { xp: number }) {
  return (
    <span
      key={xp}
      aria-label={`${xp} XP in questa sessione`}
      className="flex shrink-0 animate-xp-bump items-center gap-1 rounded-full bg-accent/15 px-3 py-1.5 font-display max-[359px]:px-2 text-lg font-bold tabular-nums text-accent"
    >
      <Icon name="flame" size={16} />
      {xp} XP
    </span>
  )
}
