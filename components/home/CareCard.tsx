import { useState } from 'react'
import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { CareEntry } from './CareEntry'
import { CareAddSheet } from './CareAddSheet'
import { CARE_CONFIG } from '@/lib/care-config'
import type { CareLog, CareKind } from '@/types'

// NativeWind 동적 클래스 불가 → lookup 사용
const BG_CLASSES: Record<CareKind, string> = {
  meal: 'bg-meal-bg',
  treat: 'bg-treat-bg',
  walk: 'bg-walk-bg',
}

const COLOR_VALUES: Record<CareKind, string> = {
  meal: '#f4846a',
  treat: '#a8c8a0',
  walk: '#7eb8e8',
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
      className={`rounded-2xl p-4 ${BG_CLASSES[kind]}`}
      style={{ borderWidth: 1.5, borderColor: color + '22' }}
    >
      {/* Header: emoji + label + count + add button */}
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2">
          <Ionicons name={config.icon} size={16} color={color} />
          <Text
            variant="label"
            className="font-bold"
            style={{ color }}
          >
            {config.label}
          </Text>
          <View
            className="rounded-full px-1.5 py-0.5"
            style={{ backgroundColor: color + '22' }}
          >
            <Text variant="caption" style={{ color }}>
              {logs.length}회
            </Text>
          </View>
        </View>

        <Pressable
          onPress={handleAdd}
          className="w-7 h-7 rounded-full items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <Ionicons name="add" size={16} color="#fff" />
        </Pressable>
      </View>

      {/* Entry list */}
      {logs.length > 0 && (
        <View className="gap-1.5 mb-1">
          {logs.map((log) => (
            <CareEntry key={log.id} log={log} accentColor={color} />
          ))}
        </View>
      )}

      {/* Add sheet (treat/walk) */}
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