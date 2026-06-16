import { useQuery } from '@tanstack/react-query'
import { mockPet } from '@/lib/mock-data'
import type { Pet } from '@/types'

export function usePet() {
  return useQuery<Pet>({
    queryKey: ['pet'],
    queryFn: () => mockPet,
  })
}