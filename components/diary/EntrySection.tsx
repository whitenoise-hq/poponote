import { View, Image } from 'react-native'
import { Text } from '@/components/ui'
import { getMemberNickname } from '@/lib/mock-data'
import type { DiaryEntry } from '@/types'

interface EntrySectionProps {
  entry: DiaryEntry
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function EntrySection({ entry }: EntrySectionProps) {
  return (
    <View>
      {entry.photo_url && (
        <Image
          source={{ uri: entry.illustration_url ?? entry.photo_url }}
          className="w-full h-64 rounded-2xl"
          resizeMode="cover"
        />
      )}
      <View className="mt-3">
        {entry.title && (
          <Text variant="subtitle" className="text-ink mb-1">
            {entry.title}
          </Text>
        )}
        <Text variant="body" className="text-ink leading-relaxed">
          {entry.body}
        </Text>
        <Text variant="caption" className="text-muted-foreground mt-2">
          {getMemberNickname(entry.author_id)} · {formatTime(entry.created_at)}
        </Text>
      </View>
    </View>
  )
}