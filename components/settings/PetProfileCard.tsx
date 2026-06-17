import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useDiaryEntries } from '@/hooks/use-diary'
import type { Pet } from '@/types'

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

export function PetProfileCard({ pet, onEdit }: PetProfileCardProps) {
  const { data: entries } = useDiaryEntries()
  const daysRecorded = new Set((entries ?? []).map((e) => e.date)).size
  const sexLabel = pet.sex === 'male' ? '수컷' : pet.sex === 'female' ? '암컷' : null
  const neuteredLabel = pet.neutered ? '중성화 완료' : null

  return (
    <Card style={{ padding: 16 }}>
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
            <Text variant="caption" style={{ color: colors.ink.DEFAULT }}>수정</Text>
          </Pressable>
        </View>
      )}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
        {pet.profile_url ? (
          <Image
            source={{ uri: pet.profile_url }}
            style={{ width: 80, height: 80, borderRadius: 40 }}
          />
        ) : (
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.cream.DEFAULT, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="paw" size={36} color={colors.primary.DEFAULT} />
          </View>
        )}
        <View style={{ flex: 1 }}>
          <Text variant="title" style={{ color: colors.ink.DEFAULT }}>
            {pet.name}
          </Text>
          <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>
            {[pet.species, formatBirthday(pet.birthday)].filter(Boolean).join(' · ')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            {sexLabel && (
              <View style={{ backgroundColor: colors.secondary, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text variant="caption" style={{ color: colors.primary.DEFAULT }}>
                  {sexLabel}
                </Text>
              </View>
            )}
            {neuteredLabel && (
              <View style={{ backgroundColor: colors.treat.bg, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                <Text variant="caption" style={{ color: colors.treat.DEFAULT }}>
                  {neuteredLabel}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Stats row */}
      <View style={{ flexDirection: 'row', marginTop: 16, justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.cream[200], paddingTop: 12 }}>
        <View style={{ alignItems: 'center' }}>
          <Text variant="caption" style={{ color: colors.muted.foreground }}>나이</Text>
          <Text variant="label" style={{ color: colors.ink.DEFAULT, marginTop: 2 }}>{getAge(pet.birthday)}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="caption" style={{ color: colors.muted.foreground }}>체중</Text>
          <Text variant="label" style={{ color: colors.ink.DEFAULT, marginTop: 2 }}>{pet.weight ? `${pet.weight}kg` : '-'}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text variant="caption" style={{ color: colors.muted.foreground }}>기록</Text>
          <Text variant="label" style={{ color: colors.ink.DEFAULT, marginTop: 2 }}>{daysRecorded}일</Text>
        </View>
      </View>
    </Card>
  )
}