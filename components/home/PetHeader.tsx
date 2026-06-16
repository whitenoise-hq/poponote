import { View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import type { Pet } from '@/types'

interface PetHeaderProps {
  pet: Pet
}

function getAge(birthday: string | null): string {
  if (!birthday) return ''
  const birth = new Date(birthday)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  return `${years}살`
}

function formatToday(): string {
  const d = new Date()
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export function PetHeader({ pet }: PetHeaderProps) {
  const age = getAge(pet.birthday)
  const speciesLabel = [pet.species, age].filter(Boolean).join(' · ')

  return (
    <View className="px-5 pt-4 pb-5">
      <Text variant="caption" className="text-muted-foreground mb-3">
        {formatToday()}
      </Text>

      <View className="flex-row items-center gap-4">
        <View className="relative">
          {pet.profile_url ? (
            <Image
              source={{ uri: pet.profile_url }}
              className="w-16 h-16 rounded-full"
              style={{
                borderWidth: 3,
                borderColor: '#fff',
              }}
            />
          ) : (
            <View className="w-16 h-16 rounded-full bg-cream items-center justify-center">
              <Ionicons name="paw" size={28} color="#F2724A" />
            </View>
          )}
        </View>

        <View className="flex-1">
          <View className="flex-row items-baseline gap-1">
            <Text variant="title" className="text-ink">
              {pet.name}
            </Text>
            <Text variant="body" className="text-muted-foreground">
              의 하루
            </Text>
          </View>
          {speciesLabel ? (
            <View className="flex-row mt-1">
              <View className="bg-secondary rounded-full px-2 py-0.5">
                <Text variant="caption" className="text-primary">
                  {speciesLabel}
                </Text>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  )
}