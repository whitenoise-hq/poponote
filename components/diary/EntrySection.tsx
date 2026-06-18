import { View, Image } from 'react-native'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useMemberMap } from '@/hooks/use-member-map'
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
  const { getNickname } = useMemberMap()

  const displayUrl = entry.photo_url

  return (
    <View>
      {displayUrl ? (
        <Image
          source={{ uri: displayUrl }}
          style={{ width: '100%', height: 256, borderRadius: 16 }}
          resizeMode="cover"
        />
      ) : null}
      <View style={{ marginTop: 12 }}>
        {entry.title && (
          <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, marginBottom: 4 }}>
            {entry.title}
          </Text>
        )}
        <Text variant="body" style={{ color: colors.ink.DEFAULT, lineHeight: 24 }}>
          {entry.body}
        </Text>
        <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 8 }}>
          {getNickname(entry.author_id)} · {formatTime(entry.created_at)}
        </Text>
      </View>
    </View>
  )
}