import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text, Card, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { supabase } from '@/lib/supabase'

export default function AccountScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [deleteVisible, setDeleteVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)

  async function handleDeleteConfirm() {
    setDeleteVisible(false)
    try {
      // DB function으로 owner family cascade 삭제 + 멤버 탈퇴
      const { error } = await supabase.rpc('delete_account')
      if (error) throw error
      await signOut()
    } catch {
      setErrorVisible(true)
    }
  }

  const email = user?.email ?? user?.user_metadata?.email ?? '-'

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
        <Card style={{ padding: 16, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={22} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" style={{ color: colors.ink.DEFAULT }}>{email}</Text>
              <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>카카오 로그인</Text>
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

      <AlertModal
        visible={deleteVisible}
        title="회원 탈퇴"
        message="탈퇴하면 모든 데이터가 삭제되며 복구할 수 없습니다. 정말 탈퇴하시겠어요?"
        confirmLabel="탈퇴"
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteVisible(false)}
      />

      <AlertModal
        visible={errorVisible}
        title="오류"
        message="탈퇴 처리에 실패했습니다. 다시 시도해주세요."
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}