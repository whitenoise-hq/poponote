import { View, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'

export default function OnboardingChoiceScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 24 }}>
        {/* Title */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <Text variant="title" style={{ color: colors.ink.DEFAULT, textAlign: 'center' }}>
            반가워요!
          </Text>
          <Text variant="body" style={{ color: colors.muted.foreground, marginTop: 8, textAlign: 'center' }}>
            포포노트를 어떻게 시작할까요?
          </Text>
        </View>

        {/* Options */}
        <View style={{ gap: 16 }}>
          {/* 새로 시작 */}
          <Pressable
            onPress={() => router.push('/(onboarding)/register-pet' as never)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              borderRadius: 16,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.cream[200],
            }}
          >
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.primary[50],
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="paw" size={26} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" style={{ color: colors.ink.DEFAULT, fontSize: 15 }}>
                새로 시작하기
              </Text>
              <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>
                반려동물을 등록하고 가족을 초대해요
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ink[300]} />
          </Pressable>

          {/* 코드로 참여 */}
          <Pressable
            onPress={() => router.push('/(onboarding)/join-code' as never)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              padding: 20,
              borderRadius: 16,
              backgroundColor: colors.white,
              borderWidth: 1,
              borderColor: colors.cream[200],
            }}
          >
            <View style={{
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: colors.walk.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Ionicons name="people" size={26} color={colors.walk.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="label" style={{ color: colors.ink.DEFAULT, fontSize: 15 }}>
                초대 코드로 참여하기
              </Text>
              <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 2 }}>
                가족에게 받은 코드로 참여해요
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.ink[300]} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  )
}