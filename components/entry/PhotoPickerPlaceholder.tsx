import { Pressable, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'

interface PhotoPickerPlaceholderProps {
  onPick?: (uri: string) => void
}

export function PhotoPickerPlaceholder({ onPick }: PhotoPickerPlaceholderProps) {
  function handlePress() {
    Alert.alert('사진 선택', '카메라 / 갤러리에서 선택 (mock)', [
      {
        text: '더미 이미지 사용',
        onPress: () =>
          onPick?.(
            'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format',
          ),
      },
      { text: '취소', style: 'cancel' },
    ])
  }

  return (
    <Pressable
      onPress={handlePress}
      className="w-full h-56 rounded-2xl bg-muted items-center justify-center border-2 border-dashed border-cream-200"
    >
      <Ionicons name="camera-outline" size={36} color={colors.muted.foreground} />
      <Text variant="body" className="text-muted-foreground mt-2">
        사진을 선택하세요
      </Text>
    </Pressable>
  )
}
