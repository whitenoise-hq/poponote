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
    onSuccess: () => {
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
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', entryId] })
    },
  })
}