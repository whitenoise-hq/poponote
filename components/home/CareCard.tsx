import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { CareEntry } from './CareEntry'
import { CareAddSheet } from './CareAddSheet'
import { CARE_CONFIG } from '@/lib/care-config'
import { colors } from '@/theme/colors'
import type { CareLog, CareKind } from '@/types'

const BG_COLORS: Record<CareKind, string> = {
  meal: colors.meal.bg,
  treat: colors.treat.bg,
  walk: colors.walk.bg,
}

const COLOR_VALUES: Record<CareKind, string> = {
  meal: colors.meal.DEFAULT,
  treat: colors.treat.DEFAULT,
  walk: colors.walk.DEFAULT,
}

interface CareCardProps {
  kind: CareKind
  logs: CareLog[]
  onAdd: (memo: string | null) => void
}

export function CareCard({ kind, logs, onAdd }: CareCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const config = CARE_CONFIG[kind]
  const color = COLOR_VALUES[kind]

  function handleAdd() {
    setIsAdding(!isAdding)
  }

  function handleSubmit(memo: string | null) {
    onAdd(memo)
    setIsAdding(false)
  }

  return (
    <View
      style={{
        borderRadius: 16,
        padding: 16,
        backgroundColor: BG_COLORS[kind],
        borderWidth: 1.5,
        borderColor: color + '22',
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Ionicons name={config.icon} size={16} color={color} />
          <Text variant="label" style={{ color, fontWeight: '700' }}>
            {config.label}
          </Text>
          <View style={{ backgroundColor: color + '22', borderRadius: 9999, paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text variant="caption" style={{ color }}>
              {logs.length}회
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleAdd}
          style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: color }}
        >
          <Ionicons name="add" size={16} color={colors.white} />
        </Pressable>
      </View>

      {/* Entry list */}
      {logs.length > 0 && (
        <View style={{ gap: 6, marginBottom: 4 }}>
          {logs.map((log) => (
            <CareEntry key={log.id} log={log} accentColor={color} />
          ))}
        </View>
      )}

      {/* Add sheet */}
      {isAdding && (
        <CareAddSheet
          accentColor={color}
          onSubmit={handleSubmit}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Empty state */}
      {logs.length === 0 && !isAdding && (
        <Text variant="caption" style={{ color: color + '99' }}>
          아직 기록이 없어요
        </Text>
      )}
    </View>
  )
}