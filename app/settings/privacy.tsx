import { View, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { POLICY_EFFECTIVE_DATE } from '@/lib/constants'

const SECTIONS = [
  {
    title: '1. 개인정보의 수집 및 이용 목적',
    body: '포포노트(이하 "서비스")는 다음 목적을 위해 최소한의 개인정보를 수집합니다.\n① 회원 가입 및 계정 관리\n② 반려동물 다이어리 서비스 제공\n③ 가족 그룹 기능 제공\n④ AI 일기 작성 기능 제공\n⑤ 고객 문의 대응',
  },
  {
    title: '2. 수집하는 개인정보 항목',
    body: '필수: 카카오 계정 식별자, 이메일 주소, 닉네임\n선택: 반려동물 정보(이름, 종류, 생년월일, 체중, 성별, 사진), 일기 내용(텍스트, 사진), 케어 기록(밥, 간식, 산책), 댓글',
  },
  {
    title: '3. 개인정보의 제3자 제공',
    body: '서비스는 AI 일기 작성 기능을 위해 이용자가 업로드한 사진을 OpenAI(미국)에 전달합니다. 전달된 사진은 일기 텍스트 생성 목적으로만 사용되며, OpenAI의 API 정책에 따라 처리됩니다. 그 외에는 이용자의 동의 없이 개인정보를 제3자에게 제공하지 않습니다.',
  },
  {
    title: '4. 개인정보 처리 위탁',
    body: '서비스는 안정적인 운영을 위해 다음과 같이 개인정보 처리를 위탁하고 있습니다.\n① Supabase Inc. — 데이터베이스 및 파일 저장소 운영\n② OpenAI — AI 일기 텍스트 생성',
  },
  {
    title: '5. 개인정보의 보유 및 이용 기간',
    body: '회원 탈퇴 시 즉시 삭제합니다. 단, 관계 법령에 따라 일정 기간 보존이 필요한 경우 해당 기간 동안 보관합니다.\n① 전자상거래법에 따른 계약·거래 기록: 5년\n② 통신비밀보호법에 따른 로그인 기록: 3개월',
  },
  {
    title: '6. 개인정보의 파기',
    body: '보유 기간이 만료되거나 처리 목적이 달성된 경우 지체 없이 파기합니다. 전자적 파일은 복구 불가능한 방법으로 삭제하며, 종이 문서는 분쇄 또는 소각합니다.',
  },
  {
    title: '7. 이용자의 권리',
    body: '이용자는 언제든지 다음의 권리를 행사할 수 있습니다.\n① 개인정보 열람, 수정, 삭제 요청\n② 개인정보 처리 정지 요청\n③ 회원 탈퇴 (설정 > 내 계정 > 회원 탈퇴)\n요청은 서비스 내 설정 또는 아래 연락처를 통해 가능합니다.',
  },
  {
    title: '8. 개인정보의 안전성 확보 조치',
    body: '서비스는 개인정보의 안전성 확보를 위해 다음 조치를 취하고 있습니다.\n① 데이터 암호화 전송(SSL/TLS)\n② 접근 권한 관리(Row Level Security)\n③ 비밀번호 및 API 키의 안전한 관리',
  },
  {
    title: '9. 개인정보보호 책임자',
    body: '성명: 유동우\n이메일: ehddl453@naver.com\n개인정보 관련 문의사항은 위 연락처로 문의해주세요.',
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
          시행일: {POLICY_EFFECTIVE_DATE}
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