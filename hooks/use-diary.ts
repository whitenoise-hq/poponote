import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useCurrentUser } from './use-current-user'
import { usePet } from './use-pet'
import { uploadDiaryPhoto, deleteDiaryPhoto } from '@/lib/storage'
import { transformToIllustration, deleteIllustration } from '@/lib/transform'
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
      onProgress,
    }: {
      title: string | null
      body: string
      photoUrl: string | null
      onProgress?: (step: string) => void
    }) => {
      if (!user || !member || !pet) throw new Error('데이터 로딩 중')

      // 1. 사진 업로드
      onProgress?.('사진 업로드 중...')
      let finalPhotoUrl = photoUrl
      let storagePath: string | null = null
      if (photoUrl && (photoUrl.startsWith('file://') || photoUrl.startsWith('ph://'))) {
        const result = await uploadDiaryPhoto(photoUrl, member.family_id)
        finalPhotoUrl = result.photoUrl
        storagePath = result.storagePath
      }

      // 2. 일러스트 변환 (완료 대기)
      let illustrationUrl: string | null = null
      let illustrationPath: string | null = null
      if (finalPhotoUrl) {
        onProgress?.('일러스트로 변환 중...')
        try {
          const result = await transformToIllustration({
            photoUrl: finalPhotoUrl,
            familyId: member.family_id,
          })
          illustrationUrl = result.illustrationUrl
          illustrationPath = result.illustrationPath
        } catch {
          if (storagePath) await deleteDiaryPhoto(storagePath)
          throw new Error('일러스트 변환에 실패했습니다. 다시 시도해주세요.')
        }
      }

      // 3. 일기 저장 (사진 + 일러스트 URL 함께)
      onProgress?.('일기 저장 중...')
      const { error } = await supabase.from('diary_entries').insert({
        family_id: member.family_id,
        pet_id: pet.id,
        date: todayStr(),
        author_id: user.id,
        title,
        body,
        photo_url: finalPhotoUrl,
        illustration_url: illustrationUrl,
      })

      if (error) {
        // 저장 실패 → 사진 + 일러스트 모두 정리
        if (storagePath) await deleteDiaryPhoto(storagePath)
        if (illustrationPath) await deleteIllustration(illustrationPath)
        throw error
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
    },
  })
}

export function useDeleteDiaryEntry() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async (entryId: string) => {
      // cascade: comments, reactions는 FK ON DELETE CASCADE로 자동 삭제
      const { error } = await supabase.from('diary_entries').delete().eq('id', entryId)
      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
      qc.invalidateQueries({ queryKey: ['comments'] })
      qc.invalidateQueries({ queryKey: ['reactions'] })
    },
  })
}