import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from './use-current-user'
import type { Family, Member } from '@/types'

export function useFamily() {
  const { data: member } = useCurrentUser()

  return useQuery<Family | null>({
    queryKey: ['family', member?.family_id],
    queryFn: async () => {
      if (!member) return null
      const { data, error } = await supabase
        .from('families')
        .select('*')
        .eq('id', member.family_id)
        .single()
      if (error) return null
      return data
    },
    enabled: !!member,
  })
}

export function useMembers() {
  const { data: member } = useCurrentUser()

  return useQuery<Member[]>({
    queryKey: ['members', member?.family_id],
    queryFn: async () => {
      if (!member) return []
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('family_id', member.family_id)
        .order('joined_at')
      if (error) return []
      return data ?? []
    },
    enabled: !!member,
  })
}