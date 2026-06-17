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
  )
}