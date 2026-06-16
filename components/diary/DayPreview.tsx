import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { getMemberNickname, getReactions, getComments } from '@/lib/mock-data'
import { EntryStatsBar } from './EntryStatsBar'
import type { DiaryEntry, CareLog } from '@/types'

interface DayPreviewProps {
  date: string
  entry: DiaryEntry | null
  careLogs: CareLog[]
  onPress: () => void
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

export function DayPreview({ date, entry, careLogs, onPress }: DayPreviewProps) {
  const hasContent = entry || careLogs.length > 0
  const likeCount = entry
    ? getReactions().filter((r) => r.entry_id === entry.id).length
    : 0
  const commentCount = entry
    ? getComments().filter((c) => c.entry_id === entry.id).length
    : 0

  return (
    <View style={{ marginTop: 16 }}>
      <Text variant="label" style={{ color: '#2B2520', marginBottom: 8 }}>
        {formatDate(date)}
      </Text>

      {hasContent ? (
        <Pressable onPress={onPress}>
          <Card style={{ borderWidth: 1, borderColor: '#F2724A', gap: 10 }}>
            {entry && (
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {entry.photo_url && (
                  <Image
                    source={{ uri: entry.photo_url }}
                    style={{ width: 56, height: 56, borderRadius: 12 }}
                    resizeMode="cover"
                  />
                )}
                <View style={{ flex: 1 }}>
                  {entry.title && (
                    <Text variant="label" style={{ color: '#2B2520' }} numberOfLines={1}>
                      {entry.title}
                    </Text>
                  )}
                  <Text
                    variant="caption"
                    style={{ color: '#9e7e76' }}
                    numberOfLines={2}
                  >
                    {entry.body}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#C4B9AC" />
              </View>
            )}

            <EntryStatsBar
              likeCount={likeCount}
              commentCount={commentCount}
              careLogs={careLogs}
            />
          </Card>
        </Pressable>
      ) : (
        <Card style={{ borderWidth: 1, borderColor: '#F2724A', alignItems: 'center', paddingVertical: 32 }}>
          <Text variant="caption" style={{ color: '#9e7e76' }}>
            이 날의 기록이 없어요
          </Text>
        </Card>
      )}
    </View>
  )
}