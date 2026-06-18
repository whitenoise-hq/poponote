import { useState } from 'react'
import { View, ScrollView, Pressable, Linking } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'

const FAQ = [
  {
    q: '가족을 초대하려면 어떻게 하나요?',
    a: '설정 탭에서 초대 코드를 복사해 가족에게 공유하세요. 가족이 앱을 설치하고 코드를 입력하면 같은 그룹에 참여할 수 있습니다.',
  },
  {
    q: '하루에 일기를 여러 개 쓸 수 있나요?',
    a: '메인 기록은 하루에 1개만 작성할 수 있습니다. 추가로 남기고 싶은 이야기는 댓글로 남겨보세요.',
  },
  {
    q: '케어 기록은 어떻게 수정하나요?',
    a: '본인이 등록한 케어 기록만 길게 눌러 수정하거나 삭제할 수 있습니다.',
  },
  {
    q: 'AI 일기 작성은 어떻게 되나요?',
    a: '사진을 올리면 AI가 사진을 분석해서 일기 제목과 내용을 자동으로 작성해줍니다. 작성된 내용은 자유롭게 수정할 수 있습니다.',
  },
]

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)

  return (
    <Pressable
      onPress={() => setOpen(!open)}
      style={{
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.cream[200],
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text variant="body" style={{ color: colors.ink.DEFAULT, flex: 1, paddingRight: 8 }}>
          {q}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={colors.ink[300]}
        />
      </View>
      {open && (
        <Text variant="caption" style={{ color: colors.ink[500], marginTop: 8, lineHeight: 20 }}>
          {a}
        </Text>
      )}
    </Pressable>
  )
}

export default function HelpScreen() {
  const router = useRouter()

  function handleContact() {
    Linking.openURL('mailto:help@poponote.app?subject=포포노트 문의')
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
          도움말 & 피드백
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* FAQ */}
        <Text variant="caption" style={{ color: colors.muted.foreground, marginBottom: 8 }}>
          자주 묻는 질문
        </Text>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          {FAQ.map((item) => (
            <FaqItem key={item.q} q={item.q} a={item.a} />
          ))}
        </Card>

        {/* 문의하기 */}
        <Pressable
          onPress={handleContact}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            marginTop: 24,
            paddingVertical: 14,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.cream[200],
            backgroundColor: colors.white,
          }}
        >
          <Ionicons name="mail-outline" size={18} color={colors.primary.DEFAULT} />
          <Text variant="label" style={{ color: colors.primary.DEFAULT }}>이메일로 문의하기</Text>
        </Pressable>

        <Text variant="caption" style={{ color: colors.muted.foreground, textAlign: 'center', marginTop: 8 }}>
          help@poponote.app
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}