import { Pressable, View, Image } from 'react-native'
import { Text, Card } from '@/components/ui'
import { EntryStatsBar } from './EntryStatsBar'
import { colors } from '@/theme/colors'
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
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {entry.photo_url && (
          <Image
            source={{ uri: entry.photo_url }}
            style={{ width: '100%', height: 220 }}
            resizeMode="cover"
          />
        )}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Text
              variant="label"
              style={{ color: colors.ink.DEFAULT, flex: 1 }}
              numberOfLines={1}
            >
              {entry.title ?? entry.body}
            </Text>
            <Text variant="caption" style={{ color: colors.muted.foreground, flexShrink: 0 }}>
              {formatDateShort(entry.date)}
            </Text>
          </View>

          {entry.title && (
            <Text
              variant="caption"
              style={{ color: colors.muted.foreground }}
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