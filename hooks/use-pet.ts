import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useCurrentUser } from './use-current-user'
import { uploadProfileImage } from '@/lib/storage'
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

export function useUpdatePet() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: async ({
      petId,
      name,
      species,
      birthday,
      weight,
      sex,
      neutered,
      profileImageUri,
    }: {
      petId: string
      name: string
      species: string | null
      birthday: string | null
      weight: number | null
      sex: 'male' | 'female' | null
      neutered: boolean
      profileImageUri: string | null
    }) => {
      let profileUrl: string | undefined

      if (profileImageUri && (profileImageUri.startsWith('file://') || profileImageUri.startsWith('ph://'))) {
        profileUrl = await uploadProfileImage(profileImageUri, petId)
      }

      const updates: Record<string, unknown> = {
        name,
        species,
        birthday,
        weight,
        sex,
        neutered,
      }
      if (profileUrl) {
        updates.profile_url = profileUrl
      }

      const { error } = await supabase
        .from('pets')
        .update(updates)
        .eq('id', petId)

      if (error) throw error
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['pet'] })
    },
  })
}