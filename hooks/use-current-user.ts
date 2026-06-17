import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useAuth } from './use-auth'
import type { Member } from '@/types'

export function useCurrentUser() {
  const { user } = useAuth()

  return useQuery<Member | null>({
    queryKey: ['currentUser', user?.id],
    queryFn: async () => {
      if (!user) return null
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_id', user.id)
        .limit(1)
        .single()
      if (error) return null
      return data
    },
    enabled: !!user,
  })
}