import { View, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'

const SECTIONS = [
  {
    title: '1. 개인정보의 수집 및 이용 목적',
    body: '포포노트는 서비스 제공을 위해 최소한의 개인정보를 수집합니다. 수집된 정보는 서비스 이용, 계정 관리, 고객 지원 목적으로만 사용됩니다.',
  },
  {
    title: '2. 수집하는 개인정보 항목',
    body: '필수: 이메일 주소, 닉네임, 로그인 식별자(카카오/구글 OAuth)\n선택: 반려동물 정보(이름, 종류, 생년월일, 사진)',
  },
  {
    title: '3. 개인정보의 보유 및 이용 기간',
    body: '회원 탈퇴 시 즉시 삭제합니다. 단, 관계 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.',
  },
  {
    title: '4. 개인정보의 파기',
    body: '보유 기간이 만료되거나 처리 목적이 달성된 경우 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제합니다.',
  },
  {
    title: '5. 이용자의 권리',
    body: '이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있으며, 회원 탈퇴를 통해 처리 정지를 요청할 수 있습니다.',
  },
]

export default function PrivacyScreen() {
  const router = useRouter()

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
          개인정보처리방침
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 16 }}>
          시행일: 2026년 1월 1일
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={{ marginBottom: 20 }}>
            <Text variant="label" style={{ color: colors.ink.DEFAULT, marginBottom: 6 }}>
              {section.title}
            </Text>
            <Text variant="body" style={{ color: colors.ink[700], lineHeight: 22 }}>
              {section.body}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}