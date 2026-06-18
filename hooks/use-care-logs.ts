import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useCurrentUser } from './use-current-user'
import { usePet } from './use-pet'
import type { CareLog, CareKind } from '@/types'

/**
 * 전체 케어 로그 조회 (캘린더 점 표시용)
 */
export function useAllCareLogs() {
  const { data: member } = useCurrentUser()

  return useQuery<CareLog[]>({
    queryKey: ['allCareLogs', member?.family_id],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('care_logs')
        .select('*')
        .eq('family_id', member.family_id)
        .order('logged_at', { ascending: false })
      if (error) return []
      return data ?? []
    },
    enabled: !!member,
  })
}

export function useCareLogs(date: string) {
  const { data: member } = useCurrentUser()

  return useQuery<CareLog[]>({
    queryKey: ['careLogs', member?.family_id, date],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('care_logs')
        .select('*')
        .eq('family_id', member.family_id)
        .eq('date', date)
        .order('logged_at')
      if (error) return []
      return data ?? []
    },
    enabled: !!member,
  })
}

export function useAddCareLog(date: string) {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { data: member } = useCurrentUser()
  const { data: pet } = usePet()

  return useMutation({
    mutationFn: async ({ kind, memo }: { kind: CareKind; memo: string | null }) => {
      if (!user || !member || !pet) throw new Error('데이터 로딩 중')
      const { error } = await supabase.from('care_logs').insert({
        family_id: member.family_id,
        pet_id: pet.id,
        date,
        kind,
        author_id: user.id,
        memo,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['careLogs'] })
      qc.invalidateQueries({ queryKey: ['allCareLogs'] })
    },
  })
}

export function useDeleteCareLog() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (careLogId: string) => {
      const { error } = await supabase.from('care_logs').delete().eq('id', careLogId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['careLogs'] })
      qc.invalidateQueries({ queryKey: ['allCareLogs'] })
    },
  })
}