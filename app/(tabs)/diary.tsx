import { useState } from 'react'
import { View, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { ViewToggle, type DiaryViewMode } from '@/components/diary/ViewToggle'
import { CalendarView } from '@/components/diary/CalendarView'
import { ListView } from '@/components/diary/ListView'
import { DayPreview } from '@/components/diary/DayPreview'
import { useDiaryEntries } from '@/hooks/use-diary'
import { getCareLogs } from '@/lib/mock-data'

export default function DiaryScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<DiaryViewMode>('calendar')
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const { data: entries } = useDiaryEntries()

  const allCareLogs = getCareLogs()

  const selectedEntry =
    selectedDate
      ? (entries ?? []).find((e) => e.date === selectedDate) ?? null
      : null

  const selectedCareLogs =
    selectedDate
      ? allCareLogs.filter((c) => c.date === selectedDate)
      : []

  const hasContent = selectedEntry || selectedCareLogs.length > 0

  function handleGoToDetail() {
    if (selectedDate && hasContent) {
      router.push(`/diary/${selectedDate}` as never)
    }
  }

  function handleListSelect(dateStr: string) {
    router.push(`/diary/${dateStr}` as never)
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text variant="title" className="text-ink mb-4">
          다이어리
        </Text>
        <ViewToggle mode={mode} onChangeMode={setMode} />
      </View>

      {mode === 'calendar' ? (
        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          <CalendarView
            entries={entries ?? []}
            careLogs={allCareLogs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate && (
            <DayPreview
              date={selectedDate}
              entry={selectedEntry}
              careLogs={selectedCareLogs}
              onPress={handleGoToDetail}
            />
          )}
          <View className="h-8" />
        </ScrollView>
      ) : (
        <View className="flex-1 px-5 pt-4">
          <ListView
            entries={entries ?? []}
            careLogs={allCareLogs}
            onSelectDate={handleListSelect}
          />
        </View>
      )}
    </SafeAreaView>
  )
}