'use client'

import { useState, useCallback } from 'react'

interface MutationOptions<T> {
  onMutate: (current: T) => T
  mutationFn: () => Promise<void>
}

export function useOptimisticMutation<T>(
  initialState: T
): readonly [T, React.Dispatch<React.SetStateAction<T>>, (opts: MutationOptions<T>) => Promise<void>] {
  const [state, setState] = useState(initialState)

  const mutate = useCallback(
    async (opts: MutationOptions<T>) => {
      const previous = state
      setState(opts.onMutate(previous))
      try {
        await opts.mutationFn()
      } catch (err) {
        setState(previous)
        throw err
      }
    },
    [state]
  )

  return [state, setState, mutate] as const
}
