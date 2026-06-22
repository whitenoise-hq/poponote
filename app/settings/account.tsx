import { useState } from 'react'
import { View, Pressable, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { Text, Card, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { useCurrentUser } from '@/hooks/use-current-user'
import { supabase } from '@/lib/supabase'

const PROVIDER_LABELS: Record<string, string> = { kakao: '카카오', apple: 'Apple' }

export default function AccountScreen() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const { data: member } = useCurrentUser()
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

  // 이름: 카카오는 프로필명이 user_metadata에 오지만, Apple은 이름을 안 주거나 최초 1회뿐 →
  // 둘 다 없으면 온보딩에서 정한 가족 닉네임으로 폴백(항상 존재).
  const name = user?.user_metadata?.name || user?.user_metadata?.full_name || member?.nickname || '-'
  const email = user?.email || user?.user_metadata?.email || '-'
  const rawAvatarUrl: string | null = user?.user_metadata?.avatar_url || null
  const avatarUrl = rawAvatarUrl?.replace('http://', 'https://') ?? null

  // 로그인 방식: 하드코딩 대신 실제 연결된 provider에서 도출(이메일 일치 시 카카오+Apple 동시 연결 가능).
  const providerLabel =
    user?.identities && user.identities.length > 0
      ? Array.from(new Set(user.identities.map((i) => PROVIDER_LABELS[i.provider] ?? i.provider))).join(', ')
      : '-'

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
        <Card style={{ padding: 16, gap: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            {avatarUrl ? (
              <Image source={{ uri: avatarUrl }} style={{ width: 44, height: 44, borderRadius: 22 }} />
            ) : (
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="person" size={22} color={colors.primary.DEFAULT} />
              </View>
            )}
            <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, flex: 1 }}>{name}</Text>
          </View>

          <View style={{ gap: 10, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.cream[200] }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>이메일</Text>
              <Text variant="body" style={{ color: colors.ink.DEFAULT }}>{email}</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>로그인 방식</Text>
              <Text variant="body" style={{ color: colors.ink.DEFAULT }}>{providerLabel}</Text>
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