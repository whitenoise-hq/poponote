import { useState } from 'react'
import { View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { ViewToggle, type DiaryViewMode } from '@/components/diary/ViewToggle'
import { CalendarView } from '@/components/diary/CalendarView'
import { ListView } from '@/components/diary/ListView'
import { useDiaryEntries } from '@/hooks/use-diary'
import { getCareLogs } from '@/lib/mock-data'

export default function DiaryScreen() {
  const router = useRouter()
  const [mode, setMode] = useState<DiaryViewMode>('calendar')
  const { data: entries } = useDiaryEntries()

  const allCareLogs = getCareLogs()

  function handleSelectDate(dateStr: string) {
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

      <View className="flex-1 px-5 pt-4">
        {mode === 'calendar' ? (
          <CalendarView
            entries={entries ?? []}
            careLogs={allCareLogs}
            onSelectDate={handleSelectDate}
          />
        ) : (
          <ListView
            entries={entries ?? []}
            onSelectDate={handleSelectDate}
          />
        )}
      </View>
    </SafeAreaView>
  )
}