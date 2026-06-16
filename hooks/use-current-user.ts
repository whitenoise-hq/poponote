import { useQuery } from '@tanstack/react-query'
import { CURRENT_USER_ID, mockMembers } from '@/lib/mock-data'
import type { Member } from '@/types'

export function useCurrentUser() {
  return useQuery<Member>({
    queryKey: ['currentUser'],
    queryFn: () => {
      const member = mockMembers.find((m) => m.user_id === CURRENT_USER_ID)
      if (!member) throw new Error('Current user not found')
      return member
    },
  })
}