import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { CURRENT_USER_ID } from '@/lib/mock-data'
import type { Reaction } from '@/types'

interface ReactionBarProps {
  reactions: Reaction[]
  onToggle: () => void
}

export function ReactionBar({ reactions, onToggle }: ReactionBarProps) {
  const hasReacted = reactions.some((r) => r.author_id === CURRENT_USER_ID)
  const count = reactions.length

  return (
    <View style={{ marginTop: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      <Pressable
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 9999,
          borderWidth: 1,
          backgroundColor: hasReacted ? colors.primary.DEFAULT + '1A' : colors.white,
          borderColor: hasReacted ? colors.primary.DEFAULT + '4D' : colors.cream[200],
        }}
      >
        <Ionicons
          name={hasReacted ? 'heart' : 'heart-outline'}
          size={18}
          color={hasReacted ? colors.primary.DEFAULT : colors.muted.foreground}
        />
        <Text
          variant="label"
          style={{ color: hasReacted ? colors.primary.DEFAULT : colors.muted.foreground }}
        >
          {count > 0 ? count : '좋아요'}
        </Text>
      </Pressable>
    </View>
  )
}