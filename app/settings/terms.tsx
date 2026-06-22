import { View, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { POLICY_EFFECTIVE_DATE } from '@/lib/constants'

const SECTIONS = [
  {
    title: '제1조 (목적)',
    body: '이 약관은 포포노트(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (정의)',
    body: '① "서비스"란 포포노트가 제공하는 반려동물 다이어리 및 관련 부가 서비스를 말합니다.\n② "이용자"란 이 약관에 따라 서비스를 이용하는 자를 말합니다.\n③ "가족 그룹"이란 초대 코드를 통해 연결된 이용자 그룹을 말합니다.',
  },
  {
    title: '제3조 (약관의 효력 및 변경)',
    body: '① 이 약관은 서비스 내에 게시하여 공지함으로써 효력이 발생합니다.\n② 서비스 제공자는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 7일 전부터 서비스 내에 공지합니다.',
  },
  {
    title: '제4조 (회원 가입 및 탈퇴)',
    body: '① 이용자는 카카오 계정 또는 Apple 계정을 통해 회원 가입할 수 있습니다.\n② 회원은 언제든지 서비스 내 설정에서 탈퇴를 요청할 수 있으며, 탈퇴 즉시 개인정보와 기록이 삭제됩니다.\n③ 그룹 생성자(보호자)가 탈퇴하면 해당 가족 그룹과 모든 기록이 함께 삭제됩니다.',
  },
  {
    title: '제5조 (서비스의 내용)',
    body: '서비스는 다음의 기능을 제공합니다.\n① 반려동물 일기 작성 (AI 자동 작성 포함)\n② 케어 기록 (밥, 간식, 산책)\n③ 가족 그룹 공유 (초대 코드)\n④ 댓글 및 좋아요\n⑤ 사진 앨범',
  },
  {
    title: '제6조 (AI 기능)',
    body: '① 서비스는 사진을 분석하여 일기 내용을 자동 생성하는 AI 기능을 제공합니다.\n② AI가 생성한 내용은 참고용이며, 이용자가 자유롭게 수정할 수 있습니다.\n③ AI 기능의 품질은 보장되지 않으며, 서비스 제공자는 AI 생성 결과에 대해 책임을 지지 않습니다.',
  },
  {
    title: '제7조 (이용자의 의무)',
    body: '이용자는 다음 행위를 하여서는 안 됩니다.\n① 타인의 정보를 도용하거나 허위 정보를 등록하는 행위\n② 서비스를 이용하여 법령 또는 공서양속에 반하는 행위\n③ 서비스의 정상적인 운영을 방해하는 행위\n④ 다른 이용자의 개인정보를 수집하는 행위',
  },
  {
    title: '제8조 (콘텐츠의 권리)',
    body: '① 이용자가 작성한 일기, 사진, 댓글 등의 콘텐츠에 대한 저작권은 이용자에게 있습니다.\n② 서비스 제공자는 서비스 운영 목적 범위 내에서 이용자의 콘텐츠를 저장, 전송할 수 있습니다.',
  },
  {
    title: '제9조 (서비스의 중단)',
    body: '서비스 제공자는 시스템 점검, 설비 교체 등 부득이한 사유가 있는 경우 서비스 제공을 일시 중단할 수 있으며, 사전에 공지합니다.',
  },
  {
    title: '제10조 (면책)',
    body: '① 서비스 제공자는 천재지변, 불가항력적 사유로 서비스를 제공할 수 없는 경우 책임이 면제됩니다.\n② 이용자의 귀책사유로 인한 서비스 이용 장애에 대해 서비스 제공자는 책임을 지지 않습니다.',
  },
  {
    title: '제11조 (분쟁 해결)',
    body: '서비스 이용과 관련한 분쟁은 대한민국 법률에 따르며, 관할 법원은 서비스 제공자의 소재지를 관할하는 법원으로 합니다.',
  },
]

export default function TermsScreen() {
  const router = useRouter()

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
          이용약관
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