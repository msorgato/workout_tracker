import type { SessionSummary } from './sessionSummary'

export function SummaryStats({ summary }: { summary: SessionSummary }) {
  const stats: { label: string; value: string }[] = [
    ...(summary.durationMinutes !== null
      ? [{ label: 'durata', value: `${summary.durationMinutes} min` }]
      : []),
    { label: 'esercizi', value: String(summary.exerciseCount) },
    { label: 'serie', value: String(summary.setCount) },
    { label: 'volume', value: `${summary.volumeKg.toLocaleString('it-IT')} kg` },
  ]
  return (
    <dl className="flex flex-wrap gap-x-5 gap-y-2">
      {stats.map((stat) => (
        <div key={stat.label}>
          <dd className="font-display text-2xl font-bold leading-none tabular-nums text-accent">
            {stat.value}
          </dd>
          <dt className="text-xs text-text-muted">{stat.label}</dt>
        </div>
      ))}
    </dl>
  )
}
