import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import type { Reaction } from '@/types'

export function useReactions(entryId: string | null) {
  return useQuery<Reaction[]>({
    queryKey: ['reactions', entryId],
    queryFn: async () => {
      if (!entryId) return []
      const { data, error } = await supabase
        .from('reactions')
        .select('*')
        .eq('entry_id', entryId)
      if (error) return []
      return data ?? []
    },
    enabled: !!entryId,
  })
}

export function useToggleReaction(entryId: string) {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('로그인 필요')

      const { data: existing } = await supabase
        .from('reactions')
        .select('id')
        .eq('entry_id', entryId)
        .eq('author_id', user.id)
        .eq('kind', 'heart')
        .maybeSingle()

      if (existing) {
        await supabase.from('reactions').delete().eq('id', existing.id)
      } else {
        await supabase.from('reactions').insert({
          entry_id: entryId,
          author_id: user.id,
          kind: 'heart',
        })
      }
    },
    onMutate: async () => {
      if (!user) return

      await qc.cancelQueries({ queryKey: ['reactions', entryId] })
      const prev = qc.getQueryData<Reaction[]>(['reactions', entryId])
      const old = prev ?? []
      const mine = old.find((r) => r.author_id === user.id && r.kind === 'heart')

      const next = mine
        ? old.filter((r) => r.id !== mine.id)
        : [...old, { id: `temp-${Date.now()}`, entry_id: entryId, author_id: user.id, kind: 'heart' as const }]

      qc.setQueryData<Reaction[]>(['reactions', entryId], next)

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(['reactions', entryId], context.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['reactions', entryId] })
    },
  })
}