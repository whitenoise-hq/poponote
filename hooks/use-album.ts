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
  photoUrl: string // photo_url 기반 (하위 호환을 위해 필드명 유지)
}

export function useAlbumMonths() {
  const { data: member } = useCurrentUser()

  return useQuery<AlbumMonth[]>({
    queryKey: ['albumMonths', member?.family_id],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('diary_entries')
        .select('id, date, photo_url')
        .eq('family_id', member.family_id)
        .not('photo_url', 'is', null)
        .order('date', { ascending: false })
      if (error) return []

      const monthMap = new Map<string, string[]>()
      for (const entry of data ?? []) {
        const month = entry.date.slice(0, 7)
        const urls = monthMap.get(month) ?? []
        urls.push(entry.photo_url!)
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
      const startDate = `${month}-01`
      const [y, m] = month.split('-').map(Number)
      const endDate = m === 12
        ? `${y + 1}-01-01`
        : `${y}-${String(m + 1).padStart(2, '0')}-01`

      const { data, error } = await supabase
        .from('diary_entries')
        .select('id, date, photo_url')
        .eq('family_id', member.family_id)
        .gte('date', startDate)
        .lt('date', endDate)
        .not('photo_url', 'is', null)
        .order('date', { ascending: false })
      if (error) return []
      return (data ?? []).map((e) => ({
        id: e.id,
        date: e.date,
        photoUrl: e.photo_url!,
      }))
    },
    enabled: !!member,
  })
}