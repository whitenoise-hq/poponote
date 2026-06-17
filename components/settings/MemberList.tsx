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
    <Card style={{ padding: 0, overflow: 'hidden' }}>
      {members.map((member, i) => {
        const isMe = member.user_id === CURRENT_USER_ID
        const isLast = i === members.length - 1
        return (
          <View
            key={member.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: isLast ? 0 : 1,
              borderBottomColor: colors.cream[200],
            }}
          >
            <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
              <Ionicons name="person" size={20} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <Text variant="body" style={{ color: colors.ink.DEFAULT }}>
                {member.nickname}
              </Text>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>
                {member.role}
              </Text>
            </View>
            {isMe ? (
              <View style={{ backgroundColor: colors.primary.DEFAULT + '18', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontSize: 11 }}>
                  나
                </Text>
              </View>
            ) : (
              <View style={{ backgroundColor: colors.cream[100], borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text variant="caption" style={{ color: colors.muted.foreground, fontSize: 11 }}>
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