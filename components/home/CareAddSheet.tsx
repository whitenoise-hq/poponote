import { useState } from 'react'
import { View, TextInput, Pressable } from 'react-native'
import { Text } from '@/components/ui'

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
    <View className="flex-row gap-2 mt-2">
      <TextInput
        value={memo}
        onChangeText={setMemo}
        placeholder="메모 (선택)"
        placeholderTextColor="#9e7e76"
        className="flex-1 text-xs px-3 py-2 rounded-xl bg-white font-sans text-ink"
        style={{ borderWidth: 1.5, borderColor: accentColor + '44' }}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />
      <Pressable
        onPress={handleSubmit}
        className="px-3 py-2 rounded-xl"
        style={{ backgroundColor: accentColor }}
      >
        <Text variant="caption" className="text-white font-semibold">
          추가
        </Text>
      </Pressable>
    </View>
  )
}