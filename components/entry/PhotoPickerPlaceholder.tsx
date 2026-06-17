import { useState } from 'react'
import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'

const DUMMY_IMAGE = 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format'

interface PhotoPickerPlaceholderProps {
  onPick?: (uri: string) => void
}

export function PhotoPickerPlaceholder({ onPick }: PhotoPickerPlaceholderProps) {
  const [pickerVisible, setPickerVisible] = useState(false)

  function handleConfirm() {
    setPickerVisible(false)
    onPick?.(DUMMY_IMAGE)
  }

  return (
    <>
      <Pressable
        onPress={() => setPickerVisible(true)}
        style={{
          width: '100%',
          height: 224,
          borderRadius: 16,
          backgroundColor: colors.muted.DEFAULT,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderStyle: 'dashed',
          borderColor: colors.cream[200],
        }}
      >
        <Ionicons name="camera-outline" size={36} color={colors.muted.foreground} />
        <Text variant="body" style={{ color: colors.muted.foreground, marginTop: 8 }}>
          사진을 선택하세요
        </Text>
      </Pressable>

      <AlertModal
        visible={pickerVisible}
        title="사진 선택"
        message="카메라 / 갤러리에서 선택 (mock)"
        confirmLabel="더미 이미지 사용"
        onConfirm={handleConfirm}
        onCancel={() => setPickerVisible(false)}
      />
    </>
  )
}