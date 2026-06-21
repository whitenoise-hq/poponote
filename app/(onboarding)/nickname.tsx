import { useState } from 'react'
import { View, TextInput, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useQueryClient } from '@tanstack/react-query'

import { Text, Button, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { createFamilyWithPet, joinFamily } from '@/lib/onboarding'

const NICKNAME_PRESETS = ['엄마', '아빠', '누나', '형', '동생', '할머니', '할아버지']
const ROLE_PRESETS = ['가족', '친구', '이웃']

/** 영어, 숫자, 한글만 허용 */
function sanitize(text: string): string {
  return text.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/g, '')
}

export default function NicknameScreen() {
  const router = useRouter()
  const qc = useQueryClient()
  const params = useLocalSearchParams<{
    flow?: string
    familyId?: string
    petName?: string
    species?: string
    birthday?: string
    profileImageUri?: string
  }>()

  const isCreate = params.flow === 'create'

  const [nickname, setNickname] = useState('')
  const [role, setRole] = useState('')
  const [customNickname, setCustomNickname] = useState('')
  const [customRole, setCustomRole] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  const finalNickname = nickname === '직접입력' ? customNickname.trim() : nickname
  const finalRole = isCreate ? '보호자' : (role === '직접입력' ? customRole.trim() : role)
  const canSubmit = finalNickname.length > 0 && (isCreate || finalRole.length > 0) && !submitting

  async function handleSubmit() {
    if (!canSubmit) return
    try {
      setSubmitting(true)
      if (isCreate) {
        const inviteCode = await createFamilyWithPet({
          petName: params.petName ?? '',
          species: params.species || undefined,
          birthday: params.birthday || undefined,
          nickname: finalNickname,
          role: '보호자',
          profileImageUri: params.profileImageUri || undefined,
        })
        // 가입 전 홈이 잠깐 마운트되며 member/pet 쿼리가 빈 값으로 캐시됐을 수 있다.
        // 가입 직후 무효화해 홈 진입 시 새로 불러오도록 한다.
        await qc.invalidateQueries()
        router.replace({ pathname: '/(onboarding)/invite-result', params: { code: inviteCode } } as never)
      } else {
        if (!params.familyId) throw new Error('familyId 없음')
        await joinFamily({ familyId: params.familyId, nickname: finalNickname, role: finalRole })
        await qc.invalidateQueries()
        router.replace('/(tabs)' as never)
      }
    } catch {
      setErrorVisible(true)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
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
            onChangeText={(t) => setCustomNickname(sanitize(t))}
            placeholder="닉네임 입력 (한글, 영어, 숫자)"
            placeholderTextColor={colors.ink[300]}
            maxLength={10}
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

        {/* Role — 초대받은 사용자만 */}
        {!isCreate && (
          <>
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
                onChangeText={(t) => setCustomRole(sanitize(t))}
                placeholder="관계 입력 (한글, 영어, 숫자)"
                placeholderTextColor={colors.ink[300]}
                maxLength={10}
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
          </>
        )}

        <Button
          label={submitting ? '처리 중...' : isCreate ? '완료' : '참여하기'}
          style={{ marginTop: 36, opacity: canSubmit ? 1 : 0.4 }}
          disabled={!canSubmit}
          loading={submitting}
          onPress={handleSubmit}
        />
      </ScrollView>

      <AlertModal
        visible={errorVisible}
        title="오류"
        message={isCreate ? '가족 그룹 생성에 실패했습니다. 다시 시도해주세요.' : '가족 참여에 실패했습니다. 다시 시도해주세요.'}
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}