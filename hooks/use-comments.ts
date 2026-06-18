import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import type { Comment } from '@/types'

export function useComments(entryId: string | null) {
  return useQuery<Comment[]>({
    queryKey: ['comments', entryId],
    queryFn: async () => {
      if (!entryId) return []
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('entry_id', entryId)
        .order('created_at')
      if (error) return []
      return data ?? []
    },
    enabled: !!entryId,
  })
}

export function useAddComment(entryId: string) {
  const qc = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: async (body: string) => {
      if (!user) throw new Error('로그인 필요')
      const { error } = await supabase.from('comments').insert({
        entry_id: entryId,
        author_id: user.id,
        body,
      })
      if (error) throw error
    },
    onMutate: async (body) => {
      if (!user) return

      const optimistic: Comment = {
        id: `temp-${Date.now()}`,
        entry_id: entryId,
        author_id: user.id,
        body,
        created_at: new Date().toISOString(),
      }

      await qc.cancelQueries({ queryKey: ['comments', entryId] })
      const prev = qc.getQueryData<Comment[]>(['comments', entryId])
      qc.setQueryData<Comment[]>(['comments', entryId], (old) => [...(old ?? []), optimistic])

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(['comments', entryId], context.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments', entryId] })
    },
  })
}

export function useDeleteComment(entryId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from('comments').delete().eq('id', commentId)
      if (error) throw error
    },
    onMutate: async (commentId) => {
      await qc.cancelQueries({ queryKey: ['comments', entryId] })
      const prev = qc.getQueryData<Comment[]>(['comments', entryId])
      qc.setQueryData<Comment[]>(['comments', entryId], (old) =>
        (old ?? []).filter((c) => c.id !== commentId)
      )

      return { prev }
    },
    onError: (_err, _vars, context) => {
      if (context?.prev) {
        qc.setQueryData(['comments', entryId], context.prev)
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['comments', entryId] })
    },
  })
}