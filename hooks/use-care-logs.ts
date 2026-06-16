import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getCareLogs, addCareLog } from '@/lib/mock-data'
import type { CareLog, CareKind } from '@/types'

export function useCareLogs(date: string) {
  return useQuery<CareLog[]>({
    queryKey: ['careLogs', date],
    queryFn: () => getCareLogs().filter((log) => log.date === date),
  })
}

export function useAddCareLog(date: string) {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ kind, memo }: { kind: CareKind; memo: string | null }) =>
      Promise.resolve(addCareLog(kind, memo)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['careLogs', date] })
    },
  })
}