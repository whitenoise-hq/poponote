import { View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
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
    <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 }}>
      <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 12 }}>
        {formatToday()}
      </Text>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        <View>
          {pet.profile_url ? (
            <Image
              source={{ uri: pet.profile_url }}
              style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: colors.white }}
            />
          ) : (
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: colors.cream.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="paw" size={28} color={colors.primary.DEFAULT} />
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text variant="title" style={{ color: colors.ink.DEFAULT }}>
              {pet.name}
            </Text>
            <Text variant="body" style={{ color: colors.muted.foreground }}>
              의 하루
            </Text>
          </View>
          {speciesLabel ? (
            <View style={{ flexDirection: 'row', marginTop: 4 }}>
              <View style={{ backgroundColor: colors.secondary, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text variant="caption" style={{ color: colors.primary.DEFAULT }}>
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