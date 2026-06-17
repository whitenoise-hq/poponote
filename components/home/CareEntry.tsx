import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import type { CareLog } from '@/types'

interface CareEntryProps {
  log: CareLog
  accentColor: string
  getNickname: (userId: string) => string
  onDelete?: (id: string) => void
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function CareEntry({ log, accentColor, getNickname, onDelete }: CareEntryProps) {
  const { user } = useAuth()
  const nickname = getNickname(log.author_id)
  const initial = nickname[0]
  const isOwn = log.author_id === user?.id

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
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
        <Text variant="caption" style={{ color: colors.ink.DEFAULT, flex: 1 }}>
          {nickname}
          {log.memo ? (
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              {' '}· {log.memo}
            </Text>
          ) : null}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Text variant="caption" style={{ color: colors.muted.foreground }}>
          {formatTime(log.logged_at)}
        </Text>
        {isOwn && onDelete && (
          <Pressable
            onPress={() => onDelete(log.id)}
            style={{ width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="close-circle" size={14} color={colors.ink[300]} />
          </Pressable>
        )}
      </View>
    </View>
  )
}