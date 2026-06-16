import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui'

interface CalendarDayCellProps {
  day: number | null
  dateStr: string | null
  isToday: boolean
  hasEntry: boolean
  hasCare: boolean
  onPress: (dateStr: string) => void
}

export function CalendarDayCell({
  day,
  dateStr,
  isToday,
  hasEntry,
  hasCare,
  onPress,
}: CalendarDayCellProps) {
  if (day === null) {
    return <View className="flex-1 h-11" />
  }

  return (
    <Pressable
      onPress={() => dateStr && onPress(dateStr)}
      className={`flex-1 h-11 items-center justify-center rounded-lg ${
        isToday ? 'bg-primary/10' : ''
      }`}
    >
      <Text
        variant="caption"
        className={isToday ? 'text-primary font-bold' : 'text-ink'}
        style={isToday ? { fontWeight: '700' } : undefined}
      >
        {day}
      </Text>
      <View className="flex-row gap-0.5 mt-0.5">
        {hasEntry && (
          <View className="w-1.5 h-1.5 rounded-full bg-primary" />
        )}
        {hasCare && !hasEntry && (
          <View className="w-1.5 h-1.5 rounded-full bg-ink-300" />
        )}
      </View>
    </Pressable>
  )
}