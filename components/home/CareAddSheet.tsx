import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'

interface CareAddSheetProps {
  accentColor: string
  onSubmit: (memo: string | null) => void
  onCancel: () => void
}

export function CareAddSheet({
  accentColor,
  onSubmit,
  onCancel,
}: CareAddSheetProps) {
  const [memo, setMemo] = useState('')

  function handleSubmit() {
    onSubmit(memo.trim() || null)
    setMemo('')
  }

  return (
    <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
      <TextInput
        value={memo}
        onChangeText={setMemo}
        placeholder="메모 (선택)"
        placeholderTextColor={colors.muted.foreground}
        style={{
          flex: 1,
          fontSize: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 12,
          backgroundColor: colors.white,
          fontFamily: 'Pretendard-Regular',
          color: colors.ink.DEFAULT,
          borderWidth: 1.5,
          borderColor: accentColor + '44',
        }}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Pressable
        onPress={handleSubmit}
        style={{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: accentColor }}
      >
        <Text variant="caption" style={{ color: colors.white, fontWeight: '600' }}>
          추가
        </Text>
      </Pressable>
    </View>
  )
}