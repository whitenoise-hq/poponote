import { Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'
import { colors } from '@/theme/colors'
import * as ImagePicker from 'expo-image-picker'

interface PhotoPickerPlaceholderProps {
  onPick?: (uri: string) => void
}

export function PhotoPickerPlaceholder({ onPick }: PhotoPickerPlaceholderProps) {
  async function handlePress() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    })
    if (!result.canceled && result.assets[0]) {
      onPick?.(result.assets[0].uri)
    }
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