import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { getMemberNickname, CURRENT_USER_ID } from '@/lib/mock-data'
import type { Comment } from '@/types'

interface CommentSectionProps {
  comments: Comment[]
  onAdd: (body: string) => void
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

export function CommentSection({
  comments,
  onAdd,
  onDelete,
}: CommentSectionProps) {
  const [text, setText] = useState('')

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setText('')
  }

  return (
    <View className="mt-4">
      <Text variant="subtitle" className="text-ink mb-3">
        댓글
      </Text>

      {/* Comment list */}
      {comments.map((comment) => {
        const isOwn = comment.author_id === CURRENT_USER_ID

        return (
          <View key={comment.id} className="flex-row gap-2 mb-3">
            <View className="w-7 h-7 rounded-full bg-accent items-center justify-center">
              <Ionicons name="person" size={14} color="#F2724A" />
            </View>
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text variant="label" className="text-ink">
                  {getMemberNickname(comment.author_id)}
                </Text>
                <Text variant="caption" className="text-muted-foreground">
                  {formatTime(comment.created_at)}
                </Text>
                {isOwn && (
                  <Pressable onPress={() => onDelete(comment.id)}>
                    <Text variant="caption" className="text-danger">
                      삭제
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text variant="body" className="text-ink mt-0.5">
                {comment.body}
              </Text>
            </View>
          </View>
        )
      })}

      {/* Input */}
      <View className="flex-row gap-2 mt-2">
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="댓글 입력..."
          placeholderTextColor="#9e7e76"
          className="flex-1 bg-muted rounded-xl px-3 py-2 text-sm font-sans text-ink"
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          className="bg-primary rounded-xl px-4 py-2 justify-center"
        >
          <Text variant="label" className="text-white">
            전송
          </Text>
        </Pressable>
      </View>
    </View>
  )
}