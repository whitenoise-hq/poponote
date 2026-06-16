import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { CARE_CONFIG } from '@/lib/care-config'
import type { CareLog, CareKind } from '@/types'

const COLOR_VALUES: Record<CareKind, string> = {
  meal: '#f4846a',
  treat: '#a8c8a0',
  walk: '#7eb8e8',
}

interface EntryStatsBarProps {
  likeCount: number
  commentCount: number
  careLogs: CareLog[]
}

export function EntryStatsBar({ likeCount, commentCount, careLogs }: EntryStatsBarProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Likes & Comments — 왼쪽 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="heart" size={13} color="#F2724A" />
          <Text variant="caption" style={{ color: '#9e7e76' }}>
            {likeCount}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <Ionicons name="chatbubble-outline" size={12} color="#9e7e76" />
          <Text variant="caption" style={{ color: '#9e7e76' }}>
            {commentCount}
          </Text>
        </View>
      </View>

      {/* Care counts — 오른쪽 */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {(['meal', 'treat', 'walk'] as CareKind[]).map((kind) => {
          const count = careLogs.filter((l) => l.kind === kind).length
          const config = CARE_CONFIG[kind]
          return (
            <View key={kind} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Ionicons name={config.icon} size={13} color={COLOR_VALUES[kind]} />
              <Text variant="caption" style={{ color: COLOR_VALUES[kind] }}>
                {count}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}