import { useMemo, useState } from 'react'
import { useExerciseLibrary } from '../features/exercise-library/useExerciseLibrary'
import type { ExerciseOption } from '../lib/types'

interface ExerciseAutocompleteProps {
  uid: string | undefined
  onSelect: (exercise: ExerciseOption) => void
  placeholder?: string
}

export function ExerciseAutocomplete({
  uid,
  onSelect,
  placeholder = 'Cerca esercizio...',
}: ExerciseAutocompleteProps) {
  const { options, addCustomExercise } = useExerciseLibrary(uid)
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)

  const matches = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []
    return options.filter((option) => option.name.toLowerCase().includes(trimmed)).slice(0, 8)
  }, [options, query])

  const hasExactMatch = options.some(
    (option) => option.name.toLowerCase() === query.trim().toLowerCase(),
  )

  function handleSelect(option: ExerciseOption) {
    onSelect(option)
    setQuery('')
    setIsOpen(false)
  }

  async function handleCreateCustom() {
    const name = query.trim()
    if (!name) return
    const created = await addCustomExercise({ name })
    handleSelect(created)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        placeholder={placeholder}
        onChange={(event) => {
          setQuery(event.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      />
      {isOpen && query.trim() && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg">
          {matches.map((option) => (
            <li key={option.id}>
              <button
                type="button"
                onMouseDown={() => handleSelect(option)}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-gray-100"
              >
                <span>{option.name}</span>
                {option.muscleGroup && (
                  <span className="text-xs text-gray-400">{option.muscleGroup}</span>
                )}
              </button>
            </li>
          ))}
          {!hasExactMatch && (
            <li>
              <button
                type="button"
                onMouseDown={handleCreateCustom}
                className="w-full px-3 py-2 text-left text-sm text-blue-600 hover:bg-gray-100"
              >
                + Crea esercizio "{query.trim()}"
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}
