import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from './use-current-user'

export interface AlbumMonth {
  month: string // YYYY-MM
  count: number
  coverUrls: string[] // 최신순 최대 3장
}

export interface AlbumPhoto {
  id: string
  date: string
  illustrationUrl: string
}

export function useAlbumMonths() {
  const { data: member } = useCurrentUser()

  return useQuery<AlbumMonth[]>({
    queryKey: ['albumMonths', member?.family_id],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('diary_entries')
        .select('id, date, illustration_url')
        .eq('family_id', member.family_id)
        .not('illustration_url', 'is', null)
        .order('date', { ascending: false })
      if (error) return []

      const monthMap = new Map<string, string[]>()
      for (const entry of data ?? []) {
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
    enabled: !!member,
  })
}

export function useAlbumMonth(month: string) {
  const { data: member } = useCurrentUser()

  return useQuery<AlbumPhoto[]>({
    queryKey: ['albumMonth', member?.family_id, month],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('diary_entries')
        .select('id, date, illustration_url')
        .eq('family_id', member.family_id)
        .like('date', `${month}%`)
        .not('illustration_url', 'is', null)
        .order('date', { ascending: false })
      if (error) return []
      return (data ?? []).map((e) => ({
        id: e.id,
        date: e.date,
        illustrationUrl: e.illustration_url!,
      }))
    },
    enabled: !!member,
  })
}