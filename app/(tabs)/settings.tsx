import { useState } from 'react'
import { ScrollView, View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text, AlertModal } from '@/components/ui'
import { useAuth } from '@/hooks/use-auth'
import { PetProfileCard } from '@/components/settings/PetProfileCard'
import { InviteCodeCard } from '@/components/settings/InviteCodeCard'
import { MemberList } from '@/components/settings/MemberList'
import { SettingsMenuGroup } from '@/components/settings/SettingsMenuGroup'
import { usePet } from '@/hooks/use-pet'
import { useFamily, useMembers } from '@/hooks/use-family'
import { colors } from '@/theme/colors'

const sectionBorder = {
  borderWidth: 1,
  borderColor: colors.cream[200],
  borderRadius: 16,
  overflow: 'hidden' as const,
}

export default function SettingsScreen() {
  const router = useRouter()
  const auth = useAuth()
  const { data: pet } = usePet()
  const { data: family } = useFamily()
  const { data: members } = useMembers()
  const [logoutVisible, setLogoutVisible] = useState(false)

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text variant="title" style={{ color: colors.ink.DEFAULT }}>
          설정
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 반려동물 프로필 */}
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 8, marginBottom: 8 }}>
          반려동물 프로필
        </Text>
        <View style={sectionBorder}>
          {pet && <PetProfileCard pet={pet} onEdit={() => router.push('/settings/edit-pet' as never)} />}
        </View>

        {/* 가족 초대 */}
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 18, marginBottom: 8 }}>
          가족 초대
        </Text>
        <View style={sectionBorder}>
          {family && <InviteCodeCard code={family.invite_code} />}
        </View>

        {/* 가족 멤버 */}
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 18, marginBottom: 8 }}>
          가족 멤버
        </Text>
        <View style={sectionBorder}>
          {members && <MemberList members={members} />}
        </View>

        {/* 계정 & 기타 */}
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 18, marginBottom: 8 }}>
          계정 & 기타
        </Text>
        <View style={sectionBorder}>
          <SettingsMenuGroup
            items={[
              {
                icon: 'person-outline',
                label: '내 계정',
                subtitle: auth.user?.email || auth.user?.user_metadata?.email || '',
                onPress: () => router.push('/settings/account' as never),
              },
              // [2차] 알림 설정 — MVP 이후 구현
              // {
              //   icon: 'notifications-outline',
              //   label: '알림 설정',
              //   subtitle: '케어 알림 켜짐',
              //   onPress: () => router.push('/settings/notifications' as never),
              // },
              // [2차] 반려동물 추가 — MVP 이후 구현
              // {
              //   icon: 'paw-outline',
              //   label: '반려동물 추가',
              //   subtitle: '최대 3마리',
              //   onPress: () => {},
              // },
              {
                icon: 'document-text-outline',
                label: '이용약관',
                onPress: () => router.push('/settings/terms' as never),
              },
              {
                icon: 'lock-closed-outline',
                label: '개인정보처리방침',
                onPress: () => router.push('/settings/privacy' as never),
              },
              {
                icon: 'help-circle-outline',
                label: '도움말 & 피드백',
                onPress: () => router.push('/settings/help' as never),
              },
            ]}
          />
        </View>

        {/* 로그아웃 */}
        <Pressable
          onPress={() => setLogoutVisible(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginTop: 20,
            paddingVertical: 14,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: colors.cream[200],
            backgroundColor: colors.cream[100],
          }}
        >
          <Ionicons name="log-out-outline" size={18} color={colors.primary.DEFAULT} />
          <Text variant="label" style={{ color: colors.primary.DEFAULT }}>로그아웃</Text>
        </Pressable>

        {/* 버전 */}
        <View style={{ alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              포포노트 v1.0.0
            </Text>
            <Ionicons name="paw" size={12} color={colors.ink[300]} />
          </View>
        </View>
      </ScrollView>

      {/* 로그아웃 확인 모달 */}
      <AlertModal
        visible={logoutVisible}
        title="로그아웃"
        message="정말 로그아웃하시겠어요?"
        confirmLabel="로그아웃"
        destructive
        onConfirm={() => { setLogoutVisible(false); auth.signOut() }}
        onCancel={() => setLogoutVisible(false)}
      />
    </SafeAreaView>
  )
}