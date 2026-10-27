// Gli SVG badge (icona nera su squircle verde) sono asset del build; l'id è il nome del file
// ed è ciò che si salva su Firestore: va mantenuto stabile.
const urls = import.meta.glob('../../assets/profile-icons/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const LABELS: Record<string, string> = {
  barbell: 'Bilanciere',
  bolt: 'Fulmine',
  calendar: 'Calendario',
  crown: 'Corona',
  dumbbell: 'Manubrio',
  flame: 'Fiamma',
  heartbeat: 'Battito',
  kettlebell: 'Kettlebell',
  medal: 'Medaglia',
  muscle: 'Muscolo',
  shaker: 'Shaker',
  sneaker: 'Scarpa',
  star: 'Stella',
  stopwatch: 'Cronometro',
  target: 'Bersaglio',
  trophy: 'Trofeo',
}

export interface Avatar {
  id: string
  label: string
  src: string
}

export const DEFAULT_AVATAR_ID = 'muscle'

export const AVATARS: Avatar[] = Object.entries(urls)
  .map(([path, src]) => {
    const id = path.split('/').pop()!.replace('.svg', '')
    return { id, label: LABELS[id] ?? id, src }
  })
  .sort((a, b) => a.label.localeCompare(b.label, 'it'))

/** Avatar per id; id mancante o non più nel preset → predefinito. */
export function getAvatar(id: string | undefined | null): Avatar {
  return (
    AVATARS.find((avatar) => avatar.id === id) ??
    AVATARS.find((avatar) => avatar.id === DEFAULT_AVATAR_ID)!
  )
}
