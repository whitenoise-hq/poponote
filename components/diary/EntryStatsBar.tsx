import { View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { CARE_CONFIG } from '@/lib/care-config'
import type { CareLog, CareKind } from '@/types'

const COLOR_VALUES: Record<CareKind, string> = {
  meal: colors.meal.DEFAULT,
  treat: colors.treat.DEFAULT,
  walk: colors.walk.DEFAULT,
}

interface EntryStatsBarProps {
  likeCount: number
  commentCount: number
  careLogs: CareLog[]
  /** true이면 좋아요/댓글 아이콘 숨김 (케어만 표시) */
  hideReactions?: boolean
}

export function EntryStatsBar({ likeCount, commentCount, careLogs, hideReactions = false }: EntryStatsBarProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      {/* Likes & Comments — 왼쪽 */}
      {!hideReactions ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="heart" size={13} color={colors.primary.DEFAULT} />
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              {likeCount}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
            <Ionicons name="chatbubble-outline" size={12} color={colors.muted.foreground} />
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              {commentCount}
            </Text>
          </View>
        </View>
      ) : (
        <View />
      )}

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