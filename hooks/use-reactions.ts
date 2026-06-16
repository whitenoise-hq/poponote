import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getReactions, toggleReaction } from '@/lib/mock-data'
import type { Reaction } from '@/types'

export function useReactions(entryId: string | null) {
  return useQuery<Reaction[]>({
    queryKey: ['reactions', entryId],
    queryFn: () =>
      entryId
        ? getReactions().filter((r) => r.entry_id === entryId)
        : [],
    enabled: !!entryId,
  })
}

export function useToggleReaction(entryId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: () => Promise.resolve(toggleReaction(entryId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reactions', entryId] })
    },
  })
}