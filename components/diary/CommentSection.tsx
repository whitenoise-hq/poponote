import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { useMemberMap } from '@/hooks/use-member-map'
import type { Comment } from '@/types'

interface CommentSectionProps {
  comments: Comment[]
  onDelete: (commentId: string) => void
}

function formatTime(isoStr: string): string {
  const d = new Date(isoStr)
  return d.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

export function CommentSection({ comments, onDelete }: CommentSectionProps) {
  const { user } = useAuth()
  const { getNickname } = useMemberMap()

  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Ionicons name="chatbubbles-outline" size={18} color={colors.ink.DEFAULT} />
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          댓글
        </Text>
      </View>

      {comments.length === 0 && (
        <Text variant="caption" style={{ color: colors.muted.foreground }}>
          아직 댓글이 없어요
        </Text>
      )}

      {comments.map((comment) => {
        const isOwn = comment.author_id === user?.id
        return (
          <View key={comment.id} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: colors.accent,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={14} color={colors.primary.DEFAULT} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text variant="label" style={{ color: colors.ink.DEFAULT }}>
                  {getNickname(comment.author_id)}
                </Text>
                <Text variant="caption" style={{ color: colors.muted.foreground }}>
                  {formatTime(comment.created_at)}
                </Text>
                {isOwn && (
                  <Pressable onPress={() => onDelete(comment.id)}>
                    <Text variant="caption" style={{ color: colors.danger }}>
                      삭제
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text variant="body" style={{ color: colors.ink.DEFAULT, marginTop: 2 }}>
                {comment.body}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}