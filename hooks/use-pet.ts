import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from './use-current-user'
import type { Pet } from '@/types'

export function usePet() {
  const { data: member } = useCurrentUser()

  return useQuery<Pet | null>({
    queryKey: ['pet', member?.family_id],
    queryFn: async () => {
      if (!member) return null
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('family_id', member.family_id)
        .limit(1)
        .single()
      if (error) return null
      return data
    },
    enabled: !!member,
  })
}