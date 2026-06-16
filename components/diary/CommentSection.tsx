import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { getMemberNickname, CURRENT_USER_ID } from '@/lib/mock-data'
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
  return (
    <View style={{ marginTop: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <Ionicons name="chatbubbles-outline" size={18} color="#2B2520" />
        <Text variant="subtitle" style={{ color: '#2B2520' }}>
          댓글
        </Text>
      </View>

      {comments.length === 0 && (
        <Text variant="caption" style={{ color: '#9e7e76' }}>
          아직 댓글이 없어요
        </Text>
      )}

      {comments.map((comment) => {
        const isOwn = comment.author_id === CURRENT_USER_ID
        return (
          <View key={comment.id} style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
            <View
              style={{
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: '#ffd6cc',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="person" size={14} color="#F2724A" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Text variant="label" style={{ color: '#2B2520' }}>
                  {getMemberNickname(comment.author_id)}
                </Text>
                <Text variant="caption" style={{ color: '#9e7e76' }}>
                  {formatTime(comment.created_at)}
                </Text>
                {isOwn && (
                  <Pressable onPress={() => onDelete(comment.id)}>
                    <Text variant="caption" style={{ color: '#D45D5D' }}>
                      삭제
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text variant="body" style={{ color: '#2B2520', marginTop: 2 }}>
                {comment.body}
              </Text>
            </View>
          </View>
        )
      })}
    </View>
  )
}