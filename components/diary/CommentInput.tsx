import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/theme/colors'

interface CommentInputProps {
  onSend: (body: string) => void
}

export function CommentInput({ onSend }: CommentInputProps) {
  const [text, setText] = useState('')

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingVertical: 12,
        backgroundColor: colors.cream.DEFAULT,
        borderTopWidth: 1,
        borderTopColor: colors.cream[200],
      }}
    >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="댓글 입력..."
          placeholderTextColor={colors.muted.foreground}
          style={{
            flex: 1,
            backgroundColor: colors.muted.DEFAULT,
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: colors.ink.DEFAULT,
          }}
          onSubmitEditing={handleSend}
          returnKeyType="send"
        />
        <Pressable
          onPress={handleSend}
          disabled={!text.trim()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: text.trim() ? colors.primary.DEFAULT : colors.cream[200],
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-up" size={18} color={colors.white} />
        </Pressable>
      </View>
  )
}