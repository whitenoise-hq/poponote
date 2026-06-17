import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useReactions } from '@/hooks/use-reactions'
import { useComments } from '@/hooks/use-comments'
import { EntryStatsBar } from './EntryStatsBar'
import type { DiaryEntry, CareLog } from '@/types'

interface DayPreviewProps {
  date: string
  entry: DiaryEntry | null
  careLogs: CareLog[]
  onPress: () => void
  onPressWrite?: () => void
}

const borderWithEntry = { borderWidth: 1, borderColor: colors.primary.DEFAULT }
const borderNoEntry = { borderWidth: 1, borderColor: colors.cream[200] }

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function DayPreview({ date, entry, careLogs, onPress, onPressWrite }: DayPreviewProps) {
  const isToday = date === todayStr()
  const hasCare = careLogs.length > 0
  const { data: reactions } = useReactions(entry?.id ?? null)
  const { data: comments } = useComments(entry?.id ?? null)
  const likeCount = (reactions ?? []).length
  const commentCount = entry
    ? (comments ?? []).length
    : 0

  return (
    <View style={{ marginTop: 16 }}>
      <Text variant="label" style={{ color: colors.ink.DEFAULT, marginBottom: 8 }}>
        {formatDate(date)}
      </Text>

      {entry ? (
        /* 일기 있음 — primary border */
        <Pressable onPress={onPress}>
          <Card style={{ ...borderWithEntry, gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              {(entry.illustration_url || entry.photo_url) && (
                <Image
                  source={{ uri: entry.illustration_url ?? entry.photo_url! }}
                  style={{ width: 56, height: 56, borderRadius: 12 }}
                  resizeMode="cover"
                />
              )}
              <View style={{ flex: 1 }}>
                {entry.title && (
                  <Text variant="label" style={{ color: colors.ink.DEFAULT }} numberOfLines={1}>
                    {entry.title}
                  </Text>
                )}
                <Text
                  variant="caption"
                  style={{ color: colors.muted.foreground, marginTop: 5 }}
                  numberOfLines={2}
                >
                  {entry.body}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={colors.ink[300]} />
            </View>

            <EntryStatsBar
              likeCount={likeCount}
              commentCount={commentCount}
              careLogs={careLogs}
            />
          </Card>
        </Pressable>
      ) : (
        /* 일기 없음 */
        <View style={{ gap: 10 }}>
          {/* 오늘이면 작성 유도 */}
          {isToday && onPressWrite ? (
            <Pressable onPress={onPressWrite}>
              <View
                style={{
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: colors.primary.DEFAULT + '40',
                  backgroundColor: colors.primary[50],
                  paddingVertical: 24,
                  paddingHorizontal: 16,
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: colors.white,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="pencil" size={18} color={colors.primary.DEFAULT} />
                </View>
                <Text variant="label" style={{ color: colors.ink.DEFAULT }}>
                  오늘 일기를 남겨주세요.
                </Text>
                <Text variant="caption" style={{ color: colors.muted.foreground }}>
                  탭해서 오늘 하루를 기록해보세요
                </Text>
              </View>
            </Pressable>
          ) : !hasCare ? (
            <Card style={{ ...borderNoEntry, alignItems: 'center', paddingVertical: 28 }}>
              <Text variant="caption" style={{ color: colors.muted.foreground }}>
                이 날의 기록이 없어요
              </Text>
            </Card>
          ) : null}

          {/* 케어만 있으면 — cream border, 좋아요/댓글 숨김 */}
          {hasCare && (
            <Pressable onPress={onPress}>
              <Card style={{ ...borderNoEntry, gap: 10 }}>
                <EntryStatsBar likeCount={0} commentCount={0} careLogs={careLogs} hideReactions />
              </Card>
            </Pressable>
          )}
        </View>
      )}
    </View>
  )
}