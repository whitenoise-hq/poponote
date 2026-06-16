import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getComments, addComment, deleteComment } from '@/lib/mock-data'
import type { Comment } from '@/types'

export function useComments(entryId: string | null) {
  return useQuery<Comment[]>({
    queryKey: ['comments', entryId],
    queryFn: () =>
      entryId
        ? getComments().filter((c) => c.entry_id === entryId)
        : [],
    enabled: !!entryId,
  })
}

export function useAddComment(entryId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (body: string) => Promise.resolve(addComment(entryId, body)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', entryId] })
    },
  })
}

export function useDeleteComment(entryId: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (commentId: string) =>
      Promise.resolve(deleteComment(commentId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['comments', entryId] })
    },
  })
}