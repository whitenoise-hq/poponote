import { Pressable, View } from 'react-native'
import { Text } from '@/components/ui'

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
            ? { backgroundColor: '#F2724A' }
            : isToday
              ? { backgroundColor: 'rgba(242,114,74,0.1)' }
              : undefined,
        ]}
      >
        <Text
          variant="caption"
          style={{
            color: isSelected ? '#fff' : isToday ? '#F2724A' : '#2B2520',
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
              backgroundColor: isSelected ? '#F2724A' : '#F2724A',
            }}
          />
        ) : hasCare ? (
          <View
            style={{
              width: 5,
              height: 5,
              borderRadius: 3,
              backgroundColor: '#C4B9AC',
            }}
          />
        ) : null}
      </View>
    </Pressable>
  )
}