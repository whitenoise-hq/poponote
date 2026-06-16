import { ScrollView, View, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { PetProfileCard } from '@/components/settings/PetProfileCard'
import { InviteCodeCard } from '@/components/settings/InviteCodeCard'
import { MemberList } from '@/components/settings/MemberList'
import { SettingsMenuGroup } from '@/components/settings/SettingsMenuGroup'
import { usePet } from '@/hooks/use-pet'
import { useFamily, useMembers } from '@/hooks/use-family'

export default function SettingsScreen() {
  const { data: pet } = usePet()
  const { data: family } = useFamily()
  const { data: members } = useMembers()

  function showMock(msg: string) {
    Alert.alert('알림', `${msg} (mock)`)
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
        contentContainerClassName="gap-4 pb-8"
        showsVerticalScrollIndicator={false}
      >
        {/* Pet profile */}
        {pet && <PetProfileCard pet={pet} />}

        {/* Invite code */}
        {family && <InviteCodeCard code={family.invite_code} />}

        {/* Family members */}
        {members && <MemberList members={members} />}

        {/* Account & More */}
        <SettingsMenuGroup
          items={[
            {
              icon: 'person-outline',
              label: '계정',
              subtitle: '카카오 로그인',
              onPress: () => showMock('계정 정보'),
            },
            {
              icon: 'paw-outline',
              label: '반려동물 추가',
              subtitle: '2차 기능',
              onPress: () => showMock('반려동물 추가는 2차 기능입니다'),
            },
            {
              icon: 'document-text-outline',
              label: '이용약관',
              onPress: () => showMock('이용약관'),
            },
            {
              icon: 'lock-closed-outline',
              label: '개인정보처리방침',
              onPress: () => showMock('개인정보처리방침'),
            },
            {
              icon: 'chatbubble-outline',
              label: '문의하기',
              onPress: () => showMock('문의하기'),
            },
            {
              icon: 'information-circle-outline',
              label: '앱 버전',
              subtitle: '0.1.0',
            },
          ]}
        />

        {/* Logout */}
        <SettingsMenuGroup
          items={[
            {
              icon: 'log-out-outline',
              label: '로그아웃',
              danger: true,
              onPress: () =>
                Alert.alert('로그아웃', '정말 로그아웃하시겠어요?', [
                  { text: '취소', style: 'cancel' },
                  { text: '로그아웃', style: 'destructive' },
                ]),
            },
          ]}
        />
      </ScrollView>
    </SafeAreaView>
  )
}