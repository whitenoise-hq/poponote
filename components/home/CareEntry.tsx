import { View } from 'react-native'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
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
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <View
          style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: accentColor + '33' }}
        >
          <Text
            variant="caption"
            style={{ color: accentColor, fontSize: 10, fontWeight: '700' }}
          >
            {initial}
          </Text>
        </View>
        <Text variant="caption" style={{ color: colors.ink.DEFAULT }}>
          {nickname}
          {log.memo ? (
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              {' '}· {log.memo}
            </Text>
          ) : null}
        </Text>
      </View>
      <Text variant="caption" style={{ color: colors.muted.foreground }}>
        {formatTime(log.logged_at)}
      </Text>
    </View>
  )
}