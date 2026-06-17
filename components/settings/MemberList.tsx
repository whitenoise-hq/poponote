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
    <Card className="p-0 overflow-hidden">
      {members.map((member, i) => {
        const isMe = member.user_id === CURRENT_USER_ID
        const isLast = i === members.length - 1
        return (
          <View
            key={member.id}
            className="flex-row items-center gap-3 px-4 py-3.5"
            style={!isLast ? { borderBottomWidth: 1, borderBottomColor: colors.cream[200] } : undefined}
          >
            <View style={{ width: 28, height: 28, borderRadius: 22, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={20} color={colors.primary.DEFAULT} />
            </View>
            <View className="flex-1">
              <Text variant="body" className="text-ink">
                {member.nickname}
              </Text>
              <Text variant="caption" className="text-muted-foreground">
                {member.role}
              </Text>
            </View>
            {isMe ? (
              <View style={{ backgroundColor: colors.primary.DEFAULT + '18', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text variant="caption" className="text-primary" style={{ fontSize: 11 }}>
                  나
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: colors.cream[100], borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text variant="caption" className="text-muted-foreground" style={{ fontSize: 11 }}>
                  멤버
                </Text>
              </View>
            )}
          </View>
        )
      })}
    </Card>
  )
}