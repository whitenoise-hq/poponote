import { useState } from 'react'
import { View, TextInput, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, Button, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { joinFamily } from '@/lib/onboarding'

const NICKNAME_PRESETS = ['엄마', '아빠', '누나', '형', '동생', '할머니', '할아버지']
const ROLE_PRESETS = ['보호자', '가족', '친구', '이웃']

export default function NicknameScreen() {
  const router = useRouter()
  const { familyId } = useLocalSearchParams<{ familyId: string }>()
  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('')
  const [customNickname, setCustomNickname] = useState('')
  const [customRole, setCustomRole] = useState('')

  const finalNickname = nickname === '직접입력' ? customNickname.trim() : nickname
  const finalRole = role === '직접입력' ? customRole.trim() : role
  const canSubmit = finalNickname.length > 0 && finalRole.length > 0

  const [submitting, setSubmitting] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  async function handleJoin() {
    if (!canSubmit || !familyId) return
    try {
      setSubmitting(true)
      await joinFamily({ familyId, nickname: finalNickname, role: finalRole })
      router.replace('/(tabs)' as never)
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
          프로필 설정
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 24 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Nickname */}
        <Text variant="label" style={{ color: colors.ink.DEFAULT, marginBottom: 12 }}>
          닉네임을 선택해주세요
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[...NICKNAME_PRESETS, '직접입력'].map((item) => {
            const selected = nickname === item
            return (
              <Pressable
                key={item}
                onPress={() => setNickname(selected ? '' : item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selected ? colors.primary.DEFAULT : colors.cream[200],
                  backgroundColor: selected ? colors.primary[50] : colors.white,
                }}
              >
                <Text variant="caption" style={{ color: selected ? colors.primary.DEFAULT : colors.ink.DEFAULT }}>
                  {item}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {nickname === '직접입력' && (
          <TextInput
            value={customNickname}
            onChangeText={setCustomNickname}
            placeholder="닉네임 입력"
            placeholderTextColor={colors.ink[300]}
            style={{
              marginTop: 12,
              height: 48,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.cream[200],
              borderRadius: 12,
              paddingHorizontal: 14,
              fontSize: 15,
              color: colors.ink.DEFAULT,
            }}
          />
        )}

        {/* Role */}
        <Text variant="label" style={{ color: colors.ink.DEFAULT, marginTop: 28, marginBottom: 12 }}>
          관계를 선택해주세요
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {[...ROLE_PRESETS, '직접입력'].map((item) => {
            const selected = role === item
            return (
              <Pressable
                key={item}
                onPress={() => setRole(selected ? '' : item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: selected ? colors.primary.DEFAULT : colors.cream[200],
                  backgroundColor: selected ? colors.primary[50] : colors.white,
                }}
              >
                <Text variant="caption" style={{ color: selected ? colors.primary.DEFAULT : colors.ink.DEFAULT }}>
                  {item}
                </Text>
              </Pressable>
            )
          })}
        </View>

        {role === '직접입력' && (
          <TextInput
            value={customRole}
            onChangeText={setCustomRole}
            placeholder="관계 입력"
            placeholderTextColor={colors.ink[300]}
            style={{
              marginTop: 12,
              height: 48,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.cream[200],
              borderRadius: 12,
              paddingHorizontal: 14,
              fontSize: 15,
              color: colors.ink.DEFAULT,
            }}
          />
        )}

        <Button
          label={submitting ? '참여 중...' : '참여하기'}
          style={{ marginTop: 36, opacity: canSubmit && !submitting ? 1 : 0.4 }}
          disabled={!canSubmit || submitting}
          loading={submitting}
          onPress={handleJoin}
        />
      </ScrollView>

      <AlertModal
        visible={errorVisible}
        title="오류"
        message="가족 참여에 실패했습니다. 다시 시도해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}