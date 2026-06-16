import { Pressable, View, Image } from 'react-native'
import { Text, Card } from '@/components/ui'
import { getMemberNickname } from '@/lib/mock-data'
import type { DiaryEntry } from '@/types'

interface DiaryListCardProps {
  entry: DiaryEntry
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

export function DiaryListCard({ entry, onPress }: DiaryListCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="overflow-hidden">
        {entry.photo_url && (
          <View className="relative">
            <Image
              source={{ uri: entry.photo_url }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="absolute top-3 left-3 bg-white/90 rounded-lg px-2 py-1">
              <Text variant="caption" className="text-ink font-medium">
                {formatDate(entry.date)}
              </Text>
            </View>
            <View
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{ backgroundColor: 'rgba(61,47,42,0.4)' }}
            />
          </View>
        )}
        <View className="px-4 py-3">
          {entry.title && (
            <Text variant="label" className="text-ink mb-1">
              {entry.title}
            </Text>
          )}
          <Text
            variant="caption"
            className="text-muted-foreground"
            numberOfLines={2}
          >
            {entry.body}
          </Text>
          <Text variant="caption" className="text-muted-foreground mt-1">
            {getMemberNickname(entry.author_id)}
          </Text>
        </View>
      </Card>
    </Pressable>
  )
}