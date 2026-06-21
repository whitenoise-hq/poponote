import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, Button, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { verifyInviteCode } from '@/lib/onboarding'
import { INVITE_CODE_PREFIX } from '@/lib/invite-code'

export default function JoinCodeScreen() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [errorVisible, setErrorVisible] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const canSubmit = code.length === 4 && !verifying

  // 'PPNT-'는 화면에 고정 표시하고 사용자는 뒤 4자리만 입력.
  // 전체 코드(PPNT-XXXX)를 붙여넣으면 접두사를 제거하고 4자리만 남긴다.
  function handleChangeCode(raw: string) {
    let v = raw.toUpperCase()
    if (v.startsWith(INVITE_CODE_PREFIX)) v = v.slice(INVITE_CODE_PREFIX.length)
    v = v.replace(/[^A-Z0-9]/g, '').slice(0, 4)
    setCode(v)
  }

  async function handleVerify() {
    if (!canSubmit) return
    try {
      setVerifying(true)
      const result = await verifyInviteCode(`${INVITE_CODE_PREFIX}${code}`)
      if (result) {
        router.push({
          pathname: '/(onboarding)/nickname',
          params: { familyId: result.familyId, petName: result.petName },
        } as never)
      } else {
        setErrorVisible(true)
      }
    } catch {
      setErrorVisible(true)
    } finally {
      setVerifying(false)
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
          초대 코드 입력
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32 }}>
        <Text variant="body" style={{ color: colors.muted.foreground, textAlign: 'center', marginBottom: 24 }}>
          가족에게 받은 초대 코드를 입력해주세요
        </Text>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            height: 56,
            backgroundColor: colors.white,
            borderWidth: 1.5,
            borderColor: colors.cream[200],
            borderRadius: 14,
            paddingHorizontal: 16,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontFamily: 'Pretendard-SemiBold',
              color: colors.ink.DEFAULT,
              letterSpacing: 3,
            }}
          >
            {INVITE_CODE_PREFIX}
          </Text>
          <TextInput
            value={code}
            onChangeText={handleChangeCode}
            placeholder="7K2X"
            placeholderTextColor={colors.ink[300]}
            autoCapitalize="characters"
            autoCorrect={false}
            style={{
              flex: 1,
              paddingVertical: 0,
              fontSize: 20,
              fontFamily: 'Pretendard-SemiBold',
              color: colors.ink.DEFAULT,
              letterSpacing: 3,
            }}
            onSubmitEditing={handleVerify}
            returnKeyType="done"
            autoFocus
          />
        </View>

        <Button
          label={verifying ? '확인 중...' : '확인'}
          style={{ marginTop: 20, opacity: canSubmit ? 1 : 0.4 }}
          disabled={!canSubmit}
          loading={verifying}
          onPress={handleVerify}
        />
      </View>

      <AlertModal
        visible={errorVisible}
        title="코드 오류"
        message={"유효하지 않은 초대 코드입니다.\n다시 확인해주세요."}
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}