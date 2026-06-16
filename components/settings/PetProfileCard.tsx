import { View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import type { Pet } from '@/types'
import { getDiaryEntries } from '@/lib/mock-data'

interface PetProfileCardProps {
  pet: Pet
}

function getAge(birthday: string | null): string {
  if (!birthday) return '-'
  const birth = new Date(birthday)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  return `${years}살`
}

function getDaysRecorded(): number {
  const dates = new Set(getDiaryEntries().map((e) => e.date))
  return dates.size
}

export function PetProfileCard({ pet }: PetProfileCardProps) {
  const sexLabel = pet.sex === 'male' ? '수컷' : pet.sex === 'female' ? '암컷' : null
  const neuteredLabel = pet.neutered ? '중성화' : null

  return (
    <Card className="p-4">
      <View className="flex-row items-center gap-4">
        {pet.profile_url ? (
          <Image
            source={{ uri: pet.profile_url }}
            className="w-20 h-20 rounded-full"
          />
        ) : (
          <View className="w-20 h-20 rounded-full bg-cream items-center justify-center">
            <Ionicons name="paw" size={36} color={colors.primary.DEFAULT} />
          </View>
        )}
        <View className="flex-1">
          <Text variant="title" className="text-ink">
            {pet.name}
          </Text>
          {pet.species && (
            <Text variant="caption" className="text-muted-foreground mt-0.5">
              {pet.species}
            </Text>
          )}
          <View className="flex-row gap-1.5 mt-2 flex-wrap">
            {sexLabel && (
              <View className="bg-secondary rounded-full px-2 py-0.5">
                <Text variant="caption" className="text-primary">
                  {sexLabel}
                </Text>
              </View>
            )}
            {neuteredLabel && (
              <View className="bg-treat-bg rounded-full px-2 py-0.5">
                <Text variant="caption" className="text-treat">
                  {neuteredLabel}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Stats row */}
      <View className="flex-row mt-4 justify-around">
        <View className="items-center">
          <Text variant="caption" className="text-muted-foreground">
            나이
          </Text>
          <Text variant="label" className="text-ink mt-0.5">
            {getAge(pet.birthday)}
          </Text>
        </View>
        <View className="items-center">
          <Text variant="caption" className="text-muted-foreground">
            체중
          </Text>
          <Text variant="label" className="text-ink mt-0.5">
            {pet.weight ? `${pet.weight}kg` : '-'}
          </Text>
        </View>
        <View className="items-center">
          <Text variant="caption" className="text-muted-foreground">
            기록
          </Text>
          <Text variant="label" className="text-ink mt-0.5">
            {getDaysRecorded()}일
          </Text>
        </View>
      </View>
    </Card>
  )
}
