import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useCurrentUser } from './use-current-user'
import { usePet } from './use-pet'
import { uploadDiaryPhoto, deleteDiaryPhoto } from '@/lib/storage'
import { generateDiary } from '@/lib/generate-diary'
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

/**
 * 사진 업로드 + AI 일기 텍스트 생성 (생성 단계)
 */
export function useGenerateDiaryText() {
  const { data: member } = useCurrentUser()

  return useMutation({
    mutationFn: async ({
      photoUrl,
      onProgress,
    }: {
      photoUrl: string
      onProgress?: (step: string) => void
    }): Promise<{
      photoUrl: string
      storagePath: string | null
      title: string
      body: string
    }> => {
      if (!member) throw new Error('데이터 로딩 중')

      // 1. 사진 업로드
      onProgress?.('사진 업로드 중...')
      let finalPhotoUrl = photoUrl
      let storagePath: string | null = null
      if (photoUrl.startsWith('file://') || photoUrl.startsWith('ph://')) {
        const result = await uploadDiaryPhoto(photoUrl, member.family_id)
        finalPhotoUrl = result.photoUrl
        storagePath = result.storagePath
      }

      // 2. AI 일기 생성
      onProgress?.('AI가 일기 작성 중...')
      try {
        const generated = await generateDiary(finalPhotoUrl)
        return {
          photoUrl: finalPhotoUrl,
          storagePath,
          title: generated.title,
          body: generated.body,
        }
      } catch (err) {
        if (storagePath) await deleteDiaryPhoto(storagePath)
        throw new Error('AI 일기 생성에 실패했습니다. 다시 시도해주세요.')
      }
    },
  })
}

/**
 * 일기 저장 (저장 단계만)
 */
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
      title: string
      body: string
      photoUrl: string
    }) => {
      if (!user || !member || !pet) throw new Error('데이터 로딩 중')

      const { error } = await supabase.from('diary_entries').insert({
        family_id: member.family_id,
        pet_id: pet.id,
        date: todayStr(),
        author_id: user.id,
        title,
        body,
        photo_url: photoUrl,
      })

      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
    },
  })
}

/**
 * 일기 수정 (제목·내용만)
 */
export function useUpdateDiaryEntry() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      entryId,
      title,
      body,
    }: {
      entryId: string
      title: string
      body: string
    }) => {
      const { error } = await supabase
        .from('diary_entries')
        .update({ title, body })
        .eq('id', entryId)

      if (error) throw error
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
      // 1. 삭제 전 사진 경로 조회
      const { data: entry } = await supabase
        .from('diary_entries')
        .select('photo_url')
        .eq('id', entryId)
        .single()

      // 2. DB 삭제 (cascade: comments, reactions 자동 삭제)
      const { error } = await supabase.from('diary_entries').delete().eq('id', entryId)
      if (error) throw error

      // 3. Storage 사진 삭제 (signed URL에서 path 추출)
      if (entry?.photo_url) {
        try {
          const url = new URL(entry.photo_url)
          const match = url.pathname.match(/\/photos\/(.+)$/)
          if (match) {
            const storagePath = decodeURIComponent(match[1].split('?')[0])
            await deleteDiaryPhoto(storagePath)
          }
        } catch {
          // 사진 삭제 실패해도 DB 삭제는 완료된 상태이므로 무시
        }
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['diaryEntries'] })
      qc.invalidateQueries({ queryKey: ['diaryEntry'] })
      qc.invalidateQueries({ queryKey: ['comments'] })
      qc.invalidateQueries({ queryKey: ['reactions'] })
    },
  })
}