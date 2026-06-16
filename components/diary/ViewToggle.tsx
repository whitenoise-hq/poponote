import { View, Pressable } from 'react-native'
import { Text } from '@/components/ui'

export type DiaryViewMode = 'calendar' | 'list'

interface ViewToggleProps {
  mode: DiaryViewMode
  onChangeMode: (mode: DiaryViewMode) => void
}

export function ViewToggle({ mode, onChangeMode }: ViewToggleProps) {
  return (
    <View className="flex-row bg-muted rounded-xl p-1">
      <Pressable
        onPress={() => onChangeMode('calendar')}
        className={`flex-1 py-2 rounded-lg items-center ${
          mode === 'calendar' ? 'bg-white shadow-card' : ''
        }`}
      >
        <Text
          variant="label"
          className={mode === 'calendar' ? 'text-ink' : 'text-muted-foreground'}
        >
          캘린더
        </Text>
      </Pressable>
      <Pressable
        onPress={() => onChangeMode('list')}
        className={`flex-1 py-2 rounded-lg items-center ${
          mode === 'list' ? 'bg-white shadow-card' : ''
        }`}
      >
        <Text
          variant="label"
          className={mode === 'list' ? 'text-ink' : 'text-muted-foreground'}
        >
          리스트
        </Text>
      </Pressable>
    </View>
  )
}