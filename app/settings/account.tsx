import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text, Card, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'

export default function AccountScreen() {
  const router = useRouter()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [deletedVisible, setDeletedVisible] = useState(false)

  function handleDeleteConfirm() {
    setDeleteVisible(false)
    setDeletedVisible(true)
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
          내 계정
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
        {/* 로그인 정보 */}
        <Card style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={22} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" style={{ color: colors.ink.DEFAULT }}>엄마</Text>
              <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>mom@example.com</Text>
            </View>
          </View>

          <View style={{ borderTopWidth: 1, borderTopColor: colors.cream[200], paddingTop: 12, gap: 8 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>로그인 방식</Text>
              <Text variant="caption" style={{ color: colors.ink.DEFAULT }}>카카오</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>가입일</Text>
              <Text variant="caption" style={{ color: colors.ink.DEFAULT }}>2026.01.15</Text>
            </View>
          </View>
        </Card>

        {/* 회원 탈퇴 */}
        <Pressable
          onPress={() => setDeleteVisible(true)}
          style={{ marginTop: 32, alignItems: 'center', paddingVertical: 12 }}
        >
          <Text variant="caption" style={{ color: colors.danger }}>
            회원 탈퇴
          </Text>
        </Pressable>
      </View>

      {/* 회원 탈퇴 확인 모달 */}
      <AlertModal
        visible={deleteVisible}
        title="회원 탈퇴"
        message="탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠어요?"
        confirmLabel="탈퇴"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
      />

      {/* 탈퇴 완료 안내 모달 */}
      <AlertModal
        visible={deletedVisible}
        title="알림"
        message="회원 탈퇴가 처리되었습니다. (mock)"
        onConfirm={() => setDeletedVisible(false)}
      />
    </SafeAreaView>
  )
}