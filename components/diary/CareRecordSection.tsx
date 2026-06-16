import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { CARE_CONFIG, CARE_KINDS } from '@/lib/care-config'
import { getMemberNickname } from '@/lib/mock-data'
import type { CareLog, CareKind } from '@/types'

interface CareRecordSectionProps {
  logs: CareLog[]
}

const COLOR_VALUES: Record<CareKind, string> = {
  meal: '#f4846a',
  treat: '#a8c8a0',
  walk: '#7eb8e8',
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function CareRecordSection({ logs }: CareRecordSectionProps) {
  if (logs.length === 0) return null

  return (
    <View className="mt-4">
      <Text variant="subtitle" className="text-ink mb-3">
        케어 기록
      </Text>
      {CARE_KINDS.map((kind) => {
        const kindLogs = logs.filter((l) => l.kind === kind)
        if (kindLogs.length === 0) return null
        const config = CARE_CONFIG[kind]
        const color = COLOR_VALUES[kind]

        return (
          <View key={kind} className="mb-3">
            <View className="flex-row items-center gap-1 mb-1">
              <Ionicons name={config.icon} size={14} color={color} />
              <Text variant="label" style={{ color }}>
                {config.label}
              </Text>
            </View>
            {kindLogs.map((log) => (
              <View key={log.id} className="flex-row items-center gap-2 ml-5 mb-0.5">
                <Text variant="caption" className="text-ink">
                  {getMemberNickname(log.author_id)}
                </Text>
                <Text variant="caption" className="text-muted-foreground">
                  {formatTime(log.logged_at)}
                </Text>
                {log.memo && (
                  <Text variant="caption" className="text-muted-foreground">
                    "{log.memo}"
                  </Text>
                )}
              </View>
            ))}
          </View>
        )
      })}
    </View>
  )
}