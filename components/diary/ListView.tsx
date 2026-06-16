import { FlatList, View } from 'react-native'
import { DiaryListCard } from './DiaryListCard'
import type { DiaryEntry } from '@/types'

interface ListViewProps {
  entries: DiaryEntry[]
  onSelectDate: (dateStr: string) => void
}

export function ListView({ entries, onSelectDate }: ListViewProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DiaryListCard
          entry={item}
          onPress={() => onSelectDate(item.date)}
        />
      )}
      contentContainerClassName="gap-4"
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View className="items-center py-12">
          {/* Text imported indirectly via DiaryListCard, keep simple here */}
        </View>
      }
    />
  )
}