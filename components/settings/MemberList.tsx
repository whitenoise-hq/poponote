import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import { CURRENT_USER_ID } from '@/lib/mock-data'
import type { Member } from '@/types'

interface MemberListProps {
  members: Member[]
}

export function MemberList({ members }: MemberListProps) {
  return (
    <Card className="p-4">
      <Text variant="label" className="text-ink mb-3">
        가족 멤버
      </Text>
      <View className="gap-3">
        {members.map((member) => {
          const isMe = member.user_id === CURRENT_USER_ID
          return (
            <View key={member.id} className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-accent items-center justify-center">
                <Ionicons name="person" size={18} color={colors.primary.DEFAULT} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text variant="body" className="text-ink">
                    {member.nickname}
                  </Text>
                  {isMe && (
                    <View className="bg-primary/10 rounded-full px-1.5 py-0.5">
                      <Text
                        variant="caption"
                        className="text-primary"
                        style={{ fontSize: 10 }}
                      >
                        나
                      </Text>
                    </View>
                  )}
                </View>
                <Text variant="caption" className="text-muted-foreground">
                  {member.role}
                </Text>
              </View>
            </View>
          )
        })}
      </View>
    </Card>
  )
}