import { useQuery } from '@tanstack/react-query'
import { mockFamily, mockMembers } from '@/lib/mock-data'
import type { Family, Member } from '@/types'

export function useFamily() {
  return useQuery<Family>({
    queryKey: ['family'],
    queryFn: () => mockFamily,
  })
}

export function useMembers() {
  return useQuery<Member[]>({
    queryKey: ['members'],
    queryFn: () => mockMembers,
  })
}