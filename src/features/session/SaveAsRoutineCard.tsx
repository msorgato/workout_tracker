import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'

/** Proposta di fine sessione libera: trasformare gli esercizi fatti in una routine. */
export function SaveAsRoutineCard({ onSave }: { onSave: () => void }) {
  return (
    <Card className="flex flex-col gap-3">
      <p className="text-sm text-text-muted">
        Vuoi ripetere questa sessione? Salvala come routine con gli esercizi, le serie e i carichi
        di oggi.
      </p>
      <Button icon="list" fullWidth onClick={onSave}>
        Salva come routine
      </Button>
    </Card>
  )
}
