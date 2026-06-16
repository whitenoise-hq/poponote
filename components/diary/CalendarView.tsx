import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { CalendarDayCell } from './CalendarDayCell'
import type { DiaryEntry, CareLog } from '@/types'

interface CalendarViewProps {
  entries: DiaryEntry[]
  careLogs: CareLog[]
  selectedDate: string | null
  onSelectDate: (dateStr: string) => void
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function getCalendarWeeks(year: number, month: number): (number | null)[][] {
  const firstDay = new Date(year, month - 1, 1).getDay()
  const daysInMonth = new Date(year, month, 0).getDate()
  const weeks: (number | null)[][] = []
  let week: (number | null)[] = new Array(firstDay).fill(null) as (number | null)[]

  for (let d = 1; d <= daysInMonth; d++) {
    week.push(d)
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
  }
  if (week.length > 0) {
    while (week.length < 7) week.push(null)
    weeks.push(week)
  }
  return weeks
}

export function CalendarView({
  entries,
  careLogs,
  selectedDate,
  onSelectDate,
}: CalendarViewProps) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth() + 1)

  const weeks = getCalendarWeeks(year, month)
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

  const entryDates = new Set(entries.map((e) => e.date))
  const careDates = new Set(careLogs.map((c) => c.date))

  function prevMonth() {
    if (month === 1) {
      setYear(year - 1)
      setMonth(12)
    } else {
      setMonth(month - 1)
    }
  }

  function nextMonth() {
    if (month === 12) {
      setYear(year + 1)
      setMonth(1)
    } else {
      setMonth(month + 1)
    }
  }

  return (
    <View>
      {/* Month header */}
      <View className="flex-row items-center justify-between mb-4">
        <Pressable onPress={prevMonth} className="px-3 py-1">
          <Ionicons name="chevron-back" size={20} color="#9C9186" />
        </Pressable>
        <Text variant="subtitle" className="text-ink">
          {year}년 {month}월
        </Text>
        <Pressable onPress={nextMonth} className="px-3 py-1">
          <Ionicons name="chevron-forward" size={20} color="#9C9186" />
        </Pressable>
      </View>

      {/* Weekday headers */}
      <View className="flex-row mb-2">
        {WEEKDAYS.map((wd) => (
          <View key={wd} className="flex-1 items-center">
            <Text variant="caption" className="text-muted-foreground">
              {wd}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, wi) => (
        <View key={wi} className="flex-row">
          {week.map((day, di) => {
            const dateStr = day
              ? `${year}-${pad(month)}-${pad(day)}`
              : null
            return (
              <CalendarDayCell
                key={di}
                day={day}
                dateStr={dateStr}
                isToday={dateStr === todayStr}
                isSelected={dateStr === selectedDate}
                hasEntry={dateStr ? entryDates.has(dateStr) : false}
                hasCare={dateStr ? careDates.has(dateStr) : false}
                onPress={onSelectDate}
              />
            )
          })}
        </View>
      ))}
    </View>
  )
}