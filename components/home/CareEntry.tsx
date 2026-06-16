import { View } from 'react-native'
import { Text } from '@/components/ui'
import { getMemberNickname } from '@/lib/mock-data'
import type { CareLog } from '@/types'

interface CareEntryProps {
  log: CareLog
  accentColor: string
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function CareEntry({ log, accentColor }: CareEntryProps) {
  const nickname = getMemberNickname(log.author_id)
  const initial = nickname[0]

  return (
    <View className="flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <View
          className="w-5 h-5 rounded-full items-center justify-center"
          style={{ backgroundColor: accentColor + '33' }}
        >
          <Text
            variant="caption"
            style={{ color: accentColor, fontSize: 10, fontWeight: '700' }}
          >
            {initial}
          </Text>
        </View>
        <Text variant="caption" style={{ color: '#2B2520' }}>
          {nickname}
          {log.memo ? (
            <Text variant="caption" className="text-muted-foreground">
              {' '}
              · {log.memo}
            </Text>
          ) : null}
        </Text>
      </View>
      <Text variant="caption" className="text-muted-foreground">
        {formatTime(log.logged_at)}
      </Text>
    </View>
  )
}