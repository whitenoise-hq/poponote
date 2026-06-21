import { useCallback } from 'react'
import { useFocusEffect } from 'expo-router'
import { useQueryClient, type QueryKey } from '@tanstack/react-query'

/**
 * 화면이 포커스를 받을 때(탭 전환·스택 복귀) 지정한 쿼리들을 무효화한다.
 * Realtime의 백업 — 소켓이 끊겼거나 이벤트를 놓친 경우에도 재진입 시 최신화된다.
 *
 * invalidateQueries는 기본 refetchType:'active'라 화면에 떠 있는 쿼리만 실제 refetch되어
 * 과도한 네트워크 호출을 막는다.
 *
 * 주의: queryKeys는 호출부에서 안정적인 참조로 전달해야 매 포커스마다 effect가 재생성되지 않는다.
 */
export function useRefetchOnFocus(queryKeys: QueryKey[]) {
  const qc = useQueryClient()
  const serialized = JSON.stringify(queryKeys)

  useFocusEffect(
    useCallback(() => {
      for (const queryKey of queryKeys) {
        qc.invalidateQueries({ queryKey })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [qc, serialized])
  )
}