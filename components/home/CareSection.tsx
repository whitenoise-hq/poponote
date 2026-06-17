import { View } from 'react-native'
import { Text } from '@/components/ui'
import { CareCard } from './CareCard'
import { CARE_KINDS } from '@/lib/care-config'
import { colors } from '@/theme/colors'
import type { CareLog, CareKind } from '@/types'

interface CareSectionProps {
  logs: CareLog[]
  onAdd: (kind: CareKind, memo: string | null) => void
}

export function CareSection({ logs, onAdd }: CareSectionProps) {
  const totalCount = logs.length

  function logsForKind(kind: CareKind): CareLog[] {
    return logs.filter((l) => l.kind === kind)
  }

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          오늘의 케어
        </Text>
        <Text variant="caption" style={{ color: colors.muted.foreground }}>
          총 {totalCount}번
        </Text>
      </View>

      <View style={{ gap: 12 }}>
        {CARE_KINDS.map((kind) => (
          <CareCard
            key={kind}
            kind={kind}
            logs={logsForKind(kind)}
            onAdd={(memo) => onAdd(kind, memo)}
          />
        ))}
      </View>
    </View>
  )
}