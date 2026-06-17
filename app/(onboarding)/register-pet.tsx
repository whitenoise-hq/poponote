import { useState } from 'react'
import { View, ScrollView, Pressable, TextInput, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, Button, DatePickerModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import * as ImagePicker from 'expo-image-picker'

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

export default function RegisterPetScreen() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [birthday, setBirthday] = useState('')
  const [datePickerVisible, setDatePickerVisible] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const canSubmit = name.trim().length > 0

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

  function handleComplete() {
    if (!canSubmit) return
    // 펫 정보를 닉네임 화면으로 넘기고, 거기서 가족 생성
    router.push({
      pathname: '/(onboarding)/nickname',
      params: {
        flow: 'create',
        petName: name.trim(),
        species: species.trim(),
        birthday: birthday.trim(),
      },
    } as never)
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
          반려동물 등록
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Profile photo */}
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
              <View style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                backgroundColor: colors.cream[100],
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 2,
                borderStyle: 'dashed',
                borderColor: colors.cream[200],
              }}>
                <Ionicons name="camera-outline" size={32} color={colors.muted.foreground} />
              </View>
            )}
          </Pressable>
          <Pressable onPress={handlePickImage}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT, marginTop: 8 }}>
              {profileImage ? '사진 변경' : '프로필 사진 (선택)'}
            </Text>
          </Pressable>
        </View>

        {/* Fields */}
        <View style={{ marginTop: 28, gap: 20 }}>
          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>
              이름 <Text variant="caption" style={{ color: colors.primary.DEFAULT }}>*</Text>
            </Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="반려동물 이름"
              placeholderTextColor={colors.ink[300]}
              style={inputStyle}
            />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>종류</Text>
            <TextInput
              value={species}
              onChangeText={setSpecies}
              placeholder="예: 골든 리트리버"
              placeholderTextColor={colors.ink[300]}
              style={inputStyle}
            />
          </View>

          <View>
            <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 6 }}>생일</Text>
            <Pressable onPress={() => setDatePickerVisible(true)} style={inputStyle}>
              <Text variant="body" style={{ color: birthday ? colors.ink.DEFAULT : colors.ink[300] }}>
                {birthday || '날짜를 선택하세요'}
              </Text>
            </Pressable>
          </View>
        </View>

        <Button
          label="다음"
          style={{ marginTop: 32, opacity: canSubmit ? 1 : 0.4 }}
          disabled={!canSubmit}
          onPress={handleComplete}
        />
      </ScrollView>

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