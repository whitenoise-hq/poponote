import { useState } from 'react'
import { View, ScrollView, ActivityIndicator } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { ViewToggle, type DiaryViewMode } from '@/components/diary/ViewToggle'
import { CalendarView } from '@/components/diary/CalendarView'
import { ListView } from '@/components/diary/ListView'
import { DayPreview } from '@/components/diary/DayPreview'
import { useDiaryEntries } from '@/hooks/use-diary'
import { useCareLogs, useAllCareLogs } from '@/hooks/use-care-logs'
import { useRefetchOnFocus } from '@/hooks/use-refetch-on-focus'
import { colors } from '@/theme/colors'

export default function DiaryScreen() {
  const router = useRouter()
  useRefetchOnFocus([['diaryEntries'], ['allCareLogs'], ['careLogs']])
  const [mode, setMode] = useState<DiaryViewMode>('calendar')
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const [selectedDate, setSelectedDate] = useState<string>(todayStr)
  const { data: entries, isLoading } = useDiaryEntries()

  const { data: allCareLogs_ } = useAllCareLogs()
  const { data: selectedCareLogs_ } = useCareLogs(selectedDate)
  const allCareLogs = allCareLogs_ ?? []

  const selectedEntry =
    selectedDate
      ? (entries ?? []).find((e) => e.date === selectedDate) ?? null
      : null

  const selectedCareLogs = selectedCareLogs_ ?? []

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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text variant="title" style={{ color: colors.ink.DEFAULT, marginBottom: 16 }}>
          다이어리
        </Text>
        <ViewToggle mode={mode} onChangeMode={setMode} />
      </View>

      {mode === 'calendar' ? (
        <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
          <CalendarView
            entries={entries ?? []}
            careLogs={allCareLogs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate ? (
            <DayPreview
              date={selectedDate}
              entry={selectedEntry}
              careLogs={selectedCareLogs}
              onPress={handleGoToDetail}
              onPressWrite={() => router.push('/entry/new' as never)}
            />
          ) : null}
          <View style={{ height: 32 }} />
        </ScrollView>
      ) : (
        <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}>
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