import { useState } from 'react'
import { View, ScrollView, Pressable, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, Button, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { createFamilyWithPet } from '@/lib/onboarding'

const INPUT_HEIGHT = 48

const inputStyle = {
  height: INPUT_HEIGHT,
  backgroundColor: colors.white,
  borderWidth: 1,
  borderColor: colors.cream[200],
  borderRadius: 12,
  paddingHorizontal: 14,
  fontSize: 15,
  color: colors.ink.DEFAULT,
}

export default function RegisterPetScreen() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [birthday, setBirthday] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  const canSubmit = name.trim().length > 0 && !submitting

  async function handleComplete() {
    if (!canSubmit) return
    try {
      setSubmitting(true)
      const inviteCode = await createFamilyWithPet({
        petName: name.trim(),
        species: species.trim() || undefined,
        birthday: birthday.trim() || undefined,
        nickname: '보호자', // 최초 사용자 기본 닉네임
      })
      router.replace({ pathname: '/(onboarding)/invite-result', params: { code: inviteCode } } as never)
    } catch {
      setErrorVisible(true)
    } finally {
      setSubmitting(false)
    }
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
        {/* Profile photo placeholder */}
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Pressable style={{
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
          </Pressable>
          <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 8 }}>
            프로필 사진 (선택)
          </Text>
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
            <TextInput
              value={birthday}
              onChangeText={setBirthday}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.ink[300]}
              style={inputStyle}
            />
          </View>
        </View>

        <Button
          label={submitting ? '생성 중...' : '완료'}
          style={{ marginTop: 32, opacity: canSubmit ? 1 : 0.4 }}
          disabled={!canSubmit}
          loading={submitting}
          onPress={handleComplete}
        />
      </ScrollView>

      <AlertModal
        visible={errorVisible}
        title="오류"
        message="가족 그룹 생성에 실패했습니다. 다시 시도해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}