import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useCurrentUser } from './use-current-user'

type Row = Record<string, unknown>

/**
 * 가족 단위 Realtime 구독. 다른 구성원이 추가/수정/삭제한 데이터를
 * 현재 기기의 React Query 캐시에 실시간으로 반영(invalidate)한다.
 *
 * - diary_entries / care_logs / pets: family_id 서버 필터로 자기 가족만 수신
 * - comments / reactions: family_id 컬럼이 없어 RLS(+setAuth)로 자기 가족 entry만 수신
 *
 * 탭 레이아웃 등 로그인 이후 공통 지점에서 한 번 호출한다.
 */
export function useRealtimeSync() {
  const qc = useQueryClient()
  const { session } = useAuth()
  const { data: member } = useCurrentUser()
  const familyId = member?.family_id

  useEffect(() => {
    if (!session || !familyId) return

    const familyFilter = `family_id=eq.${familyId}`

    function entryIdOf(payload: RealtimePostgresChangesPayload<Row>): string | undefined {
      const next = payload.new as Row | undefined
      const prev = payload.old as Row | undefined
      return (next?.entry_id as string | undefined) ?? (prev?.entry_id as string | undefined)
    }

    const channel = supabase
      .channel(`family:${familyId}`)
      // 일기
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'diary_entries', filter: familyFilter },
        () => {
          qc.invalidateQueries({ queryKey: ['diaryEntries'] })
          qc.invalidateQueries({ queryKey: ['diaryEntry'] })
          qc.invalidateQueries({ queryKey: ['albumMonths'] })
          qc.invalidateQueries({ queryKey: ['albumMonth'] })
        }
      )
      // 케어 로그
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'care_logs', filter: familyFilter },
        () => {
          qc.invalidateQueries({ queryKey: ['careLogs'] })
          qc.invalidateQueries({ queryKey: ['allCareLogs'] })
        }
      )
      // 펫 프로필
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pets', filter: familyFilter },
        () => {
          qc.invalidateQueries({ queryKey: ['pet'] })
        }
      )
      // 댓글 (family_id 없음 → RLS로 자기 가족만 수신)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'comments' },
        (payload) => {
          const entryId = entryIdOf(payload)
          if (entryId) qc.invalidateQueries({ queryKey: ['comments', entryId] })
          else qc.invalidateQueries({ queryKey: ['comments'] })
        }
      )
      // 반응 (family_id 없음 → RLS로 자기 가족만 수신)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reactions' },
        (payload) => {
          const entryId = entryIdOf(payload)
          if (entryId) qc.invalidateQueries({ queryKey: ['reactions', entryId] })
          else qc.invalidateQueries({ queryKey: ['reactions'] })
        }
      )
      .subscribe((status) => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          console.warn(`[realtime] family:${familyId} 구독 상태: ${status}`)
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [qc, session, familyId])
}