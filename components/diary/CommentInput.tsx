import { useState, useEffect } from 'react'
import { View, TextInput, Pressable, Keyboard, Platform } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/theme/colors'

interface CommentInputProps {
  onSend: (body: string) => void
}

export function CommentInput({ onSend }: CommentInputProps) {
  const [text, setText] = useState('')
  const [keyboardShown, setKeyboardShown] = useState(false)
  const insets = useSafeAreaInsets()

  useEffect(() => {
    const showEvt = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow'
    const hideEvt = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide'
    const showSub = Keyboard.addListener(showEvt, () => setKeyboardShown(true))
    const hideSub = Keyboard.addListener(hideEvt, () => setKeyboardShown(false))
    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  function handleSend() {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    Keyboard.dismiss()
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 20,
        paddingTop: 12,
        // 키보드가 올라오면 하단 안전영역 여백은 키보드에 가려지므로 제거해 상하 균형을 맞춘다.
        paddingBottom: keyboardShown ? 12 : insets.bottom + 12,
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