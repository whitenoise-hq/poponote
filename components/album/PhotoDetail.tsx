import { View, Image, useWindowDimensions, Alert } from 'react-native'
import { Text, Button } from '@/components/ui'
import type { AlbumPhoto } from '@/hooks/use-album'

interface PhotoDetailProps {
  photo: AlbumPhoto
  onGoToDiary: () => void
}

export function PhotoDetail({ photo, onGoToDiary }: PhotoDetailProps) {
  const { width } = useWindowDimensions()

  function handleSave() {
    Alert.alert('저장', '갤러리에 저장되었습니다. (mock)')
  }

  function handleShare() {
    Alert.alert('공유', '공유 기능은 추후 연동됩니다. (mock)')
  }

  return (
    <View className="flex-1 items-center">
      <Image
        source={{ uri: photo.illustrationUrl }}
        style={{ width: width - 40, height: width - 40 }}
        className="rounded-2xl"
        resizeMode="cover"
      />

      <View className="flex-row gap-3 mt-6">
        <Button label="저장" variant="secondary" onPress={handleSave} />
        <Button label="공유" variant="secondary" onPress={handleShare} />
      </View>

      <View className="mt-4">
        <Button
          label="이 일러스트의 다이어리로 →"
          variant="ghost"
          onPress={onGoToDiary}
        />
      </View>
    </View>
  )
}
