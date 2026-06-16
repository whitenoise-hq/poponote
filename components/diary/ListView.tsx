import { FlatList, View } from 'react-native'
import { Text } from '@/components/ui'
import { DiaryListCard } from './DiaryListCard'
import { getReactions, getComments } from '@/lib/mock-data'
import { colors } from '@/theme/colors'
import type { DiaryEntry, CareLog } from '@/types'

interface ListViewProps {
  entries: DiaryEntry[]
  careLogs: CareLog[]
  onSelectDate: (dateStr: string) => void
}

export function ListView({ entries, careLogs, onSelectDate }: ListViewProps) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <FlatList
      data={sorted}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <DiaryListCard
          entry={item}
          careLogs={careLogs.filter((c) => c.date === item.date)}
          likeCount={getReactions().filter((r) => r.entry_id === item.id).length}
          commentCount={getComments().filter((c) => c.entry_id === item.id).length}
          onPress={() => onSelectDate(item.date)}
        />
      )}
      contentContainerStyle={{ gap: 16, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', paddingVertical: 48 }}>
          <Text variant="body" style={{ color: colors.muted.foreground }}>
            아직 기록이 없어요
          </Text>
        </View>
      }
    />
  )
}