import { useQuery } from '@tanstack/react-query'
import { getDiaryEntries } from '@/lib/mock-data'

export interface AlbumMonth {
  month: string // YYYY-MM
  count: number
  coverUrls: string[] // 최신순 최대 3장 (겹친 표지용)
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
      const entries = getDiaryEntries()
        .filter((e) => e.illustration_url)
        .sort((a, b) => b.date.localeCompare(a.date)) // 최신순

      const monthMap = new Map<string, string[]>()
      for (const entry of entries) {
        const month = entry.date.slice(0, 7)
        const urls = monthMap.get(month) ?? []
        urls.push(entry.illustration_url!)
        monthMap.set(month, urls)
      }

      return Array.from(monthMap.entries())
        .map(([month, urls]) => ({
          month,
          count: urls.length,
          coverUrls: urls.slice(0, 3),
        }))
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