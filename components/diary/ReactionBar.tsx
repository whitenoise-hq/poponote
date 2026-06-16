import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
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
    <View className="mt-4 flex-row items-center gap-3">
      <Pressable
        onPress={onToggle}
        className={`flex-row items-center gap-1.5 px-4 py-2 rounded-full border ${
          hasReacted
            ? 'bg-primary/10 border-primary/30'
            : 'bg-white border-cream-200'
        }`}
      >
        <Ionicons
          name={hasReacted ? 'heart' : 'heart-outline'}
          size={18}
          color={hasReacted ? '#F2724A' : '#9e7e76'}
        />
        <Text
          variant="label"
          className={hasReacted ? 'text-primary' : 'text-muted-foreground'}
        >
          {count > 0 ? count : '좋아요'}
        </Text>
      </Pressable>
    </View>
  )
}