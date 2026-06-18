import { useState } from 'react'
import { View, ScrollView, Pressable, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text, Card, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { useCurrentUser } from '@/hooks/use-current-user'
import { supabase } from '@/lib/supabase'

const FAQ = [
  {
    q: '가족을 초대하려면 어떻게 하나요?',
    a: '설정 탭에서 초대 코드를 복사해 가족에게 공유하세요. 가족이 앱을 설치하고 코드를 입력하면 같은 그룹에 참여할 수 있습니다.',
  },
  {
    q: 'AI 일기 작성은 어떻게 되나요?',
    a: '사진을 올리면 AI가 사진을 분석해서 일기 제목과 내용을 자동으로 작성해줍니다. 작성된 내용은 자유롭게 수정한 뒤 저장할 수 있습니다.',
  },
  {
    q: '하루에 일기를 여러 개 쓸 수 있나요?',
    a: '메인 기록은 하루에 1개만 작성할 수 있습니다. 추가로 남기고 싶은 이야기는 댓글로 남겨보세요.',
  },
  {
    q: '일기를 수정하거나 삭제하려면 어떻게 하나요?',
    a: '다이어리 상세 화면에서 본인이 작성한 일기의 수정(연필) 또는 삭제(휴지통) 아이콘을 탭하세요. 삭제 시 댓글과 좋아요도 함께 삭제됩니다.',
  },
  {
    q: '케어 기록은 어떻게 삭제하나요?',
    a: '홈 화면에서 본인이 등록한 케어 기록을 길게 누르면 삭제할 수 있습니다.',
  },
  {
    q: '반려동물 프로필은 어떻게 수정하나요?',
    a: '설정 탭 > 반려동물 프로필 카드의 "수정" 버튼을 탭하면 이름, 종류, 생일, 체중, 성별 등을 변경할 수 있습니다.',
  },
  {
    q: '보호자가 탈퇴하면 어떻게 되나요?',
    a: '그룹을 만든 보호자가 탈퇴하면 해당 가족 그룹과 모든 기록이 함께 삭제됩니다. 다른 가족 멤버가 탈퇴하면 본인만 그룹에서 나가게 됩니다.',
  },
  {
    q: '앨범의 사진을 저장하거나 공유할 수 있나요?',
    a: '앨범에서 사진을 탭해 상세 화면으로 이동한 뒤 "저장하기" 또는 "공유하기" 버튼을 이용하세요.',
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
  const { user } = useAuth()
  const { data: member } = useCurrentUser()

  const [inquiryOpen, setInquiryOpen] = useState(false)
  const [inquiryText, setInquiryText] = useState('')
  const [sending, setSending] = useState(false)
  const [sentVisible, setSentVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  async function handleSendInquiry() {
    if (!inquiryText.trim() || sending) return

    setSending(true)
    try {
      const response = await supabase.functions.invoke('send-inquiry', {
        body: {
          message: inquiryText.trim(),
          userName: user?.user_metadata?.name || null,
          nickname: member?.nickname || null,
          userEmail: user?.email || user?.user_metadata?.email || null,
        },
      })

      if (response.error) throw response.error

      setInquiryText('')
      setInquiryOpen(false)
      setSentVisible(true)
    } catch {
      setErrorVisible(true)
    } finally {
      setSending(false)
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
          도움말 & 피드백
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 24, marginBottom: 8 }}>
          문의하기
        </Text>

        {inquiryOpen ? (
          <Card style={{ gap: 12 }}>
            <TextInput
              value={inquiryText}
              onChangeText={setInquiryText}
              placeholder="문의 내용을 입력해주세요"
              placeholderTextColor={colors.muted.foreground}
              multiline
              textAlignVertical="top"
              autoFocus
              style={{
                minHeight: 120,
                paddingHorizontal: 14,
                paddingVertical: 12,
                backgroundColor: colors.cream[100],
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.cream[200],
                fontSize: 14,
                fontFamily: 'Pretendard-Regular',
                color: colors.ink.DEFAULT,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Pressable
                onPress={() => { setInquiryOpen(false); setInquiryText('') }}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.cream[200], alignItems: 'center' }}
              >
                <Text variant="label" style={{ color: colors.muted.foreground }}>취소</Text>
              </Pressable>
              <Pressable
                onPress={handleSendInquiry}
                disabled={!inquiryText.trim() || sending}
                style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', opacity: inquiryText.trim() && !sending ? 1 : 0.4 }}
              >
                <Text variant="label" style={{ color: colors.white }}>{sending ? '전송 중...' : '문의하기'}</Text>
              </Pressable>
            </View>
          </Card>
        ) : (
          <Pressable
            onPress={() => setInquiryOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
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
        )}
      </ScrollView>

      <AlertModal
        visible={sentVisible}
        title="문의 완료"
        message="문의가 접수되었습니다. 빠르게 답변드리겠습니다."
        onConfirm={() => setSentVisible(false)}
      />

      <AlertModal
        visible={errorVisible}
        title="전송 실패"
        message="문의 전송에 실패했습니다. 다시 시도해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}