import { useQuery } from '@tanstack/react-query'
import { getDiaryEntries } from '@/lib/mock-data'

export interface AlbumMonth {
  month: string // YYYY-MM
  count: number
  coverUrl: string
}

export interface AlbumPhoto {
  id: string
  date: string
  illustrationUrl: string
}

export function useAlbumMonths() {
  return useQuery<AlbumMonth[]>({
    queryKey: ['albumMonths'],
    queryFn: () => {
      const entries = getDiaryEntries().filter((e) => e.illustration_url)
      const monthMap = new Map<
        string,
        { count: number; coverUrl: string }
      >()

      for (const entry of entries) {
        const month = entry.date.slice(0, 7)
        const existing = monthMap.get(month)
        if (existing) {
          monthMap.set(month, {
            count: existing.count + 1,
            coverUrl: existing.coverUrl,
          })
        } else {
          monthMap.set(month, {
            count: 1,
            coverUrl: entry.illustration_url!,
          })
        }
      }

      return Array.from(monthMap.entries())
        .map(([month, data]) => ({ month, ...data }))
        .sort((a, b) => b.month.localeCompare(a.month))
    },
  })
}

export function useAlbumMonth(month: string) {
  return useQuery<AlbumPhoto[]>({
    queryKey: ['albumMonth', month],
    queryFn: () =>
      getDiaryEntries()
        .filter((e) => e.date.startsWith(month) && e.illustration_url)
        .sort((a, b) => b.date.localeCompare(a.date))
        .map((e) => ({
          id: e.id,
          date: e.date,
          illustrationUrl: e.illustration_url!,
        })),
  })
}