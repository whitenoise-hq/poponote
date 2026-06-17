import { ScrollView, View, Pressable, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text } from '@/components/ui'
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
  const { data: pet } = usePet()
  const { data: family } = useFamily()
  const { data: members } = useMembers()

  function showMock(msg: string) {
    Alert.alert('알림', `${msg} (mock)`)
  }

  function handleLogout() {
    Alert.alert('로그아웃', '정말 로그아웃하시겠어요?', [
      { text: '취소', style: 'cancel' },
      { text: '로그아웃', style: 'destructive' },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text variant="title" className="text-ink">
          설정
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-10"
        showsVerticalScrollIndicator={false}
      >
        {/* 반려동물 프로필 */}
        <Text variant="caption" className="text-muted-foreground" style={{ marginTop: 8, marginBottom: 8 }}>
          반려동물 프로필
        </Text>
        <View style={sectionBorder}>
          {pet && <PetProfileCard pet={pet} onEdit={() => router.push('/settings/edit-pet' as never)} />}
        </View>

        {/* 가족 초대 */}
        <Text variant="caption" className="text-muted-foreground" style={{ marginTop: 18, marginBottom: 8 }}>
          가족 초대
        </Text>
        <View style={sectionBorder}>
          {family && <InviteCodeCard code={family.invite_code} />}
        </View>

        {/* 가족 멤버 */}
        <Text variant="caption" className="text-muted-foreground" style={{ marginTop: 18, marginBottom: 8 }}>
          가족 멤버
        </Text>
        <View style={sectionBorder}>
          {members && <MemberList members={members} />}
        </View>

        {/* 계정 & 기타 */}
        <Text variant="caption" className="text-muted-foreground" style={{ marginTop: 18, marginBottom: 8 }}>
          계정 & 기타
        </Text>
        <View style={sectionBorder}>
          <SettingsMenuGroup
            items={[
              {
                icon: 'person-outline',
                label: '내 계정',
                subtitle: 'mom@example.com',
                onPress: () => showMock('계정 정보'),
              },
              {
                icon: 'notifications-outline',
                label: '알림 설정',
                subtitle: '케어 알림 켜짐',
                onPress: () => showMock('알림 설정'),
              },
              {
                icon: 'paw-outline',
                label: '반려동물 추가',
                subtitle: '최대 3마리',
                onPress: () => showMock('반려동물 추가는 2차 기능입니다'),
              },
              {
                icon: 'lock-closed-outline',
                label: '개인정보처리방침',
                onPress: () => showMock('개인정보처리방침'),
              },
              {
                icon: 'help-circle-outline',
                label: '도움말 & 피드백',
                onPress: () => showMock('도움말 & 피드백'),
              },
            ]}
          />
        </View>

        {/* 로그아웃 */}
        <Pressable
          onPress={handleLogout}
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
          <Text variant="label" className="text-primary">로그아웃</Text>
        </Pressable>

        {/* 버전 */}
        <View className="items-center" style={{ marginTop: 16, marginBottom: 8 }}>
          <View className="flex-row items-center gap-1">
            <Text variant="caption" className="text-muted-foreground">
              포포노트 v1.0.0
            </Text>
            <Ionicons name="paw" size={12} color={colors.ink[300]} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}