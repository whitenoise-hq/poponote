import { useState } from 'react'
import { View, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          paddingHorizontal: 20,
          paddingVertical: 12,
          backgroundColor: '#FBF7F1',
          borderTopWidth: 1,
          borderTopColor: '#ECE1D1',
        }}
      >
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="댓글 입력..."
          placeholderTextColor="#9e7e76"
          style={{
            flex: 1,
            backgroundColor: '#f5ede8',
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 10,
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: '#2B2520',
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
            backgroundColor: text.trim() ? '#F2724A' : '#ECE1D1',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-up" size={18} color="#fff" />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}