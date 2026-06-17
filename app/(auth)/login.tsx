import { useState } from 'react'
import { View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'

import { Text, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { SocialButton } from '@/components/auth/SocialButton'
import { KakaoIcon } from '@/components/auth/KakaoIcon'

export default function LoginScreen() {
  const { signInWithKakao } = useAuth()
  const [errorVisible, setErrorVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleKakao() {
    try {
      setLoading(true)
      await signInWithKakao()
    } catch {
      setErrorVisible(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        {/* Logo */}
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <View style={{
            width: 88,
            height: 88,
            borderRadius: 44,
            backgroundColor: colors.primary[50],
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 16,
          }}>
            <Ionicons name="paw" size={44} color={colors.primary.DEFAULT} />
          </View>
          <Text variant="display" style={{ color: colors.ink.DEFAULT }}>
            포포노트
          </Text>
          <Text variant="body" style={{ color: colors.muted.foreground, marginTop: 8, textAlign: 'center' }}>
            가족이 함께 쓰는 반려동물 다이어리
          </Text>
        </View>

        {/* Social login buttons */}
        <View style={{ width: '100%', gap: 12 }}>
          <SocialButton
            label={loading ? '로그인 중...' : '카카오로 시작하기'}
            icon={<KakaoIcon size={18} color="#191919" />}
            backgroundColor="#FEE500"
            textColor="#191919"
            onPress={handleKakao}
          />
        </View>
      </View>

      {/* Footer */}
      <View style={{ alignItems: 'center', paddingBottom: 16 }}>
        <Text variant="caption" style={{ color: colors.ink[300], textAlign: 'center', lineHeight: 18 }}>
          로그인 시 이용약관 및 개인정보처리방침에{'\n'}동의하는 것으로 간주합니다.
        </Text>
      </View>

      <AlertModal
        visible={errorVisible}
        title="로그인 실패"
        message="카카오 로그인에 실패했습니다. 다시 시도해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}