import { useState } from 'react'
import { View, ScrollView, Pressable, Image, TextInput, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text } from '@/components/ui'
import { usePet } from '@/hooks/use-pet'
import { colors } from '@/theme/colors'

const SEX_OPTIONS = [
  { value: 'male' as const, label: '수컷', icon: 'male' as const, color: '#4A90D9', bgColor: '#EBF3FC' },
  { value: 'female' as const, label: '암컷', icon: 'female' as const, color: '#D94A6B', bgColor: '#FCEBF0' },
]

const inputStyle = {
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.cream[200],
  borderRadius: 12,
  paddingHorizontal: 14,
  paddingVertical: 12,
  fontSize: 15,
  color: colors.ink.DEFAULT,
}

export default function EditPetScreen() {
  const router = useRouter()
  const { data: pet } = usePet()

  const [name, setName] = useState(pet?.name ?? '')
  const [species, setSpecies] = useState(pet?.species ?? '')
  const [birthday, setBirthday] = useState(pet?.birthday ?? '')
  const [weight, setWeight] = useState(pet?.weight?.toString() ?? '')
  const [sex, setSex] = useState<'male' | 'female' | null>(pet?.sex ?? null)
  const [neutered, setNeutered] = useState(pet?.neutered ?? false)

  function handleSave() {
    Alert.alert('저장', '반려동물 프로필이 수정되었습니다. (mock)')
    router.back()
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, height: 52 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={22} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ flex: 1, textAlign: 'center', color: colors.ink.DEFAULT }}>
          반려동물 프로필 수정
        </Text>
        <Pressable onPress={handleSave} style={{ paddingHorizontal: 4 }}>
          <Text variant="label" style={{ color: colors.primary.DEFAULT }}>저장</Text>
        </Pressable>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile image */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          {pet?.profile_url ? (
            <Image
              source={{ uri: pet.profile_url }}
              style={{ width: 96, height: 96, borderRadius: 48 }}
            />
          ) : (
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.cream[100], alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="paw" size={40} color={colors.primary.DEFAULT} />
            </View>
          )}
          <Pressable style={{ marginTop: 8 }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT }}>사진 변경</Text>
          </Pressable>
        </View>

        {/* Fields */}
        <View style={{ marginTop: 28, gap: 20 }}>
          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>이름</Text>
            <TextInput value={name} onChangeText={setName} placeholder="반려동물 이름" placeholderTextColor={colors.ink[300]} style={inputStyle} />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>종류</Text>
            <TextInput value={species} onChangeText={setSpecies} placeholder="예: 골든 리트리버" placeholderTextColor={colors.ink[300]} style={inputStyle} />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>생일</Text>
            <TextInput value={birthday} onChangeText={setBirthday} placeholder="YYYY-MM-DD" placeholderTextColor={colors.ink[300]} style={inputStyle} />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>체중 (kg)</Text>
            <TextInput value={weight} onChangeText={setWeight} placeholder="예: 28.5" placeholderTextColor={colors.ink[300]} keyboardType="decimal-pad" style={inputStyle} />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>성별</Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {SEX_OPTIONS.map((opt) => {
                const selected = sex === opt.value
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => setSex(selected ? null : opt.value)}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 12,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: selected ? opt.color : colors.cream[200],
                      backgroundColor: selected ? opt.bgColor : colors.white,
                    }}
                  >
                    <Ionicons name={opt.icon} size={18} color={selected ? opt.color : colors.ink[300]} />
                    <Text variant="label" style={{ color: selected ? opt.color : colors.ink.DEFAULT }}>
                      {opt.label}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>중성화</Text>
            <Pressable
              onPress={() => setNeutered(!neutered)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 10,
                paddingVertical: 12,
                paddingHorizontal: 14,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: neutered ? colors.primary.DEFAULT : colors.cream[200],
                backgroundColor: neutered ? colors.primary[50] : colors.white,
              }}
            >
              <Ionicons
                name={neutered ? 'checkbox' : 'square-outline'}
                size={20}
                color={neutered ? colors.primary.DEFAULT : colors.ink[300]}
              />
              <Text variant="body" style={{ color: neutered ? colors.primary.DEFAULT : colors.ink.DEFAULT }}>
                중성화 완료
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}