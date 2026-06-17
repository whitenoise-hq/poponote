import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useCurrentUser } from './use-current-user'
import { usePet } from './use-pet'
import { uploadDiaryPhoto } from '@/lib/storage'
import type { DiaryEntry } from '@/types'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function useDiaryEntries() {
  const { data: member } = useCurrentUser()

  return useQuery<DiaryEntry[]>({
    queryKey: ['diaryEntries', member?.family_id],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('family_id', member.family_id)
        .order('date', { ascending: false })
      if (error) return []
      return data ?? []
    },
    enabled: !!member,
  })
}

export function useDiaryEntry(date: string) {
  const { data: member } = useCurrentUser()

  return useQuery<DiaryEntry | null>({
    queryKey: ['diaryEntry', member?.family_id, date],
    queryFn: async () => {
      if (!member) return null
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('family_id', member.family_id)
        .eq('date', date)
        .limit(1)
        .maybeSingle()
      if (error) return null
      return data
    },
    enabled: !!member,
  })
}

export function useTodayEntry() {
  return useDiaryEntry(todayStr())
}

export function useAddDiaryEntry() {
  const qc = useQueryClient()
  const { user } = useAuth()
  const { data: member } = useCurrentUser()
  const { data: pet } = usePet()

  return useMutation({
    mutationFn: async ({
      title,
      body,
      photoUrl,
    }: {
      title: string | null
      body: string
      photoUrl: string | null
    }) => {
      if (!user || !member || !pet) throw new Error('데이터 로딩 중')

      let finalPhotoUrl = photoUrl
      // 로컬 파일이면 업로드
      if (photoUrl && (photoUrl.startsWith('file://') || photoUrl.startsWith('ph://'))) {
        const result = await uploadDiaryPhoto(photoUrl, member.family_id)
        finalPhotoUrl = result.photoUrl
      }

      const { error } = await supabase.from('diary_entries').insert({
        family_id: member.family_id,
        pet_id: pet.id,
        date: todayStr(),
        author_id: user.id,
        title,
        body,
        photo_url: finalPhotoUrl,
      })
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
    },
  })
}