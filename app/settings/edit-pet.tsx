import { useState, useEffect } from 'react'
import { View, ScrollView, Pressable, Image, TextInput, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, AlertModal, DatePickerModal } from '@/components/ui'
import { usePet, useUpdatePet } from '@/hooks/use-pet'
import { colors } from '@/theme/colors'
import * as ImagePicker from 'expo-image-picker'

const SEX_OPTIONS = [
  { value: 'male' as const, label: '수컷', icon: 'male' as const, color: '#4A90D9', bgColor: '#EBF3FC' },
  { value: 'female' as const, label: '암컷', icon: 'female' as const, color: '#D94A6B', bgColor: '#FCEBF0' },
]

const INPUT_HEIGHT = 48

const inputStyle = {
  height: INPUT_HEIGHT,
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.cream[200],
  borderRadius: 12,
  paddingHorizontal: 14,
  justifyContent: 'center' as const,
  fontSize: 15,
  color: colors.ink.DEFAULT,
}

export default function EditPetScreen() {
  const router = useRouter()
  const { data: pet, isLoading } = usePet()
  const updatePet = useUpdatePet()

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [birthday, setBirthday] = useState('')
  const [weight, setWeight] = useState('')
  const [sex, setSex] = useState<'male' | 'female' | null>(null)
  const [neutered, setNeutered] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)
  const [savedVisible, setSavedVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [datePickerVisible, setDatePickerVisible] = useState(false)

  useEffect(() => {
    if (pet && !initialized) {
      setName(pet.name ?? '')
      setSpecies(pet.species ?? '')
      setBirthday(pet.birthday ?? '')
      setWeight(pet.weight?.toString() ?? '')
      setSex(pet.sex ?? null)
      setNeutered(pet.neutered ?? false)
      setProfileImage(pet.profile_url ?? null)
      setInitialized(true)
    }
  }, [pet, initialized])

  const isSaving = updatePet.isPending
  const canSave = name.trim().length > 0 && species.trim().length > 0 && birthday.trim().length > 0 && !isSaving

  if (isLoading || !pet) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT, alignItems: 'center', justifyContent: 'center' }} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    )
  }

  async function handlePickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    })
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri)
    }
  }

  function handleSave() {
    if (!canSave || !pet) return

    updatePet.mutate(
      {
        petId: pet.id,
        name: name.trim(),
        species: species.trim(),
        birthday: birthday.trim(),
        weight: weight.trim() ? parseFloat(weight.trim()) : null,
        sex,
        neutered,
        profileImageUri: profileImage,
      },
      {
        onSuccess: () => setSavedVisible(true),
        onError: (err) => {
          setErrorMessage(err instanceof Error ? err.message : '저장에 실패했습니다.')
          setErrorVisible(true)
        },
      },
    )
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
        <Pressable onPress={handleSave} disabled={!canSave} style={{ paddingHorizontal: 4, opacity: canSave ? 1 : 0.35 }}>
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
          <Pressable onPress={handlePickImage}>
            {profileImage ? (
              <View>
                <Image
                  source={{ uri: profileImage }}
                  style={{ width: 96, height: 96, borderRadius: 48 }}
                />
                <View style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white }}>
                  <Ionicons name="camera" size={14} color={colors.white} />
                </View>
              </View>
            ) : (
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: colors.cream[100], alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="camera-outline" size={32} color={colors.muted.foreground} />
              </View>
            )}
          </Pressable>
          <Pressable onPress={handlePickImage} style={{ marginTop: 8 }}>
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
            <Pressable onPress={() => setDatePickerVisible(true)} style={inputStyle}>
              <Text variant="body" style={{ color: birthday ? colors.ink.DEFAULT : colors.ink[300] }}>
                {birthday || '날짜를 선택하세요'}
              </Text>
            </Pressable>
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

      <AlertModal
        visible={savedVisible}
        title="저장 완료"
        message="반려동물 프로필이 수정되었습니다."
        onConfirm={() => { setSavedVisible(false); router.back() }}
      />

      <AlertModal
        visible={errorVisible}
        title="오류"
        message={errorMessage}
        onConfirm={() => setErrorVisible(false)}
      />

      <DatePickerModal
        visible={datePickerVisible}
        value={birthday ? new Date(birthday) : new Date()}
        maximumDate={new Date()}
        onConfirm={(date) => {
          const y = date.getFullYear()
          const m = String(date.getMonth() + 1).padStart(2, '0')
          const d = String(date.getDate()).padStart(2, '0')
          setBirthday(`${y}-${m}-${d}`)
          setDatePickerVisible(false)
        }}
        onCancel={() => setDatePickerVisible(false)}
      />
    </SafeAreaView>
  )
}