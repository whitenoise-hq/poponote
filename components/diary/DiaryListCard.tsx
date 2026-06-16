import { Pressable, View, Image } from 'react-native'
import { Text, Card } from '@/components/ui'
import { EntryStatsBar } from './EntryStatsBar'
import type { DiaryEntry, CareLog } from '@/types'

interface DiaryListCardProps {
  entry: DiaryEntry
  careLogs: CareLog[]
  likeCount: number
  commentCount: number
  onPress: () => void
}

function formatDateShort(dateStr: string): string {
  const [y, m, d] = dateStr.split('-')
  return `${y}.${m}.${d}`
}

export function DiaryListCard({ entry, careLogs, likeCount, commentCount, onPress }: DiaryListCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="overflow-hidden" style={{ padding: 0 }}>
        {entry.photo_url && (
          <Image
            source={{ uri: entry.photo_url }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />
        )}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          {/* 제목 + 날짜 */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Text
              variant="label"
              style={{ color: '#2B2520', flex: 1 }}
              numberOfLines={1}
            >
              {entry.title ?? entry.body}
            </Text>
            <Text variant="caption" style={{ color: '#9e7e76', flexShrink: 0 }}>
              {formatDateShort(entry.date)}
            </Text>
          </View>

          {entry.title && (
            <Text
              variant="caption"
              style={{ color: '#9e7e76' }}
              numberOfLines={2}
            >
              {entry.body}
            </Text>
          )}

          <EntryStatsBar
            likeCount={likeCount}
            commentCount={commentCount}
            careLogs={careLogs}
          />
        </View>
      </Card>
    </Pressable>
  )
}