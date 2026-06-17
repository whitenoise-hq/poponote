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
              style={{ width: 70, height: 70, borderRadius: 40, borderWidth: 1, borderColor: colors.white }}
            />
          ) : (
            <View style={{ width: 70, height: 70, borderRadius: 40, backgroundColor: colors.cream[100], borderWidth: 1, borderColor: colors.cream[200], alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="paw" size={32} color={colors.primary.DEFAULT} />
            </View>
          )}
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4 }}>
            <Text variant="title" style={{ color: colors.ink.DEFAULT, fontFamily: 'Jua_400Regular' }}>
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