import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'

interface CalendarDayCellProps {
  day: number | null
  dateStr: string | null
  isToday: boolean
  isSelected: boolean
  hasEntry: boolean
  hasCare: boolean
  onPress: (dateStr: string) => void
}

export function CalendarDayCell({
  day,
  dateStr,
  isToday,
  isSelected,
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
      className="flex-1 h-11 items-center justify-center"
    >
      {/* 숫자 뒤 원형 배경 */}
      <View
        className="items-center justify-center"
        style={[
          { width: 30, height: 30, borderRadius: 15 },
          isSelected
            ? { backgroundColor: colors.primary.DEFAULT }
            : isToday
              ? { backgroundColor: 'rgba(242,114,74,0.1)' }
              : undefined,
        ]}
      >
        <Text
          variant="caption"
          style={{
            color: isSelected ? colors.white : isToday ? colors.primary.DEFAULT : colors.ink.DEFAULT,
            fontWeight: isSelected || isToday ? '700' : '400',
          }}
        >
          {day}
        </Text>
      </View>
      {/* 점 영역 고정 높이 */}
      <View style={{ height: 6, justifyContent: 'center' }}>
        {hasEntry ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: isSelected ? colors.primary.DEFAULT : colors.primary.DEFAULT,
            }}
          />
        ) : hasCare ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: colors.ink[300],
            }}
          />
        ) : null}
      </View>
    </Pressable>
  )
}