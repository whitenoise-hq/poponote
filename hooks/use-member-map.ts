import { useMemo } from 'react'
import { useMembers } from './use-family'

/**
 * author_id → nickname 매핑.
 * 컴포넌트에서 getMemberNickname 대신 사용.
 */
export function useMemberMap() {
  const { data: members } = useMembers()

  return useMemo(() => {
    const map = new Map<string, string>()
    for (const m of members ?? []) {
      map.set(m.user_id, m.nickname)
    }
    return {
      getNickname: (userId: string) => map.get(userId) ?? '멤버',
      members: members ?? [],
    }
  }, [members])
}