import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import type { Pet } from '@/types'
import { getDiaryEntries } from '@/lib/mock-data'

interface PetProfileCardProps {
  pet: Pet
  onEdit?: () => void
}

function getAge(birthday: string | null): string {
  if (!birthday) return '-'
  const birth = new Date(birthday)
  const now = new Date()
  const years = now.getFullYear() - birth.getFullYear()
  return `${years}살`
}

function formatBirthday(birthday: string | null): string {
  if (!birthday) return ''
  const [y, m, d] = birthday.split('-')
  return `${y}.${m}.${d} 생`
}

function getDaysRecorded(): number {
  const dates = new Set(getDiaryEntries().map((e) => e.date))
  return dates.size
}

export function PetProfileCard({ pet, onEdit }: PetProfileCardProps) {
  const sexLabel = pet.sex === 'male' ? '수컷' : pet.sex === 'female' ? '암컷' : null
  const neuteredLabel = pet.neutered ? '중성화 완료' : null

  return (
    <Card className="p-4">
      {onEdit && (
        <View style={{ position: 'absolute', top: 12, right: 12, zIndex: 1 }}>
          <Pressable
            onPress={onEdit}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 99,
              backgroundColor: colors.cream[100],
              borderWidth: 1,
              borderColor: colors.cream[200],
            }}
          >
            <Text variant="caption" className="text-ink">수정</Text>
          </Pressable>
        </View>
      )}
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
          <Text variant="caption" className="text-muted-foreground mt-0.5">
            {[pet.species, formatBirthday(pet.birthday)].filter(Boolean).join(' · ')}
          </Text>
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
      <View
        className="flex-row mt-4 justify-around"
        style={{ borderTopWidth: 1, borderTopColor: colors.cream[200], paddingTop: 12 }}
      >
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