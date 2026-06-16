import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDiaryEntries, addDiaryEntry, TODAY } from '@/lib/mock-data'
import type { DiaryEntry } from '@/types'

export function useDiaryEntries() {
  return useQuery<DiaryEntry[]>({
    queryKey: ['diaryEntries'],
    queryFn: () => getDiaryEntries(),
  })
}

export function useDiaryEntry(date: string) {
  return useQuery<DiaryEntry | null>({
    queryKey: ['diaryEntry', date],
    queryFn: () => getDiaryEntries().find((e) => e.date === date) ?? null,
  })
}

export function useTodayEntry() {
  return useDiaryEntry(TODAY)
}

export function useAddDiaryEntry() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({
      title,
      body,
      photoUrl,
    }: {
      title: string | null
      body: string
      photoUrl: string | null
    }) => Promise.resolve(addDiaryEntry(title, body, photoUrl)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
    },
  })
}