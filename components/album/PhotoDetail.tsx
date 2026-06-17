import { useState } from 'react'
import { View, Image, Pressable, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import type { AlbumPhoto } from '@/hooks/use-album'

interface PhotoDetailProps {
  photo: AlbumPhoto
  onGoToDiary: () => void
}

export function PhotoDetail({ photo, onGoToDiary }: PhotoDetailProps) {
  const { width } = useWindowDimensions()
  const imageSize = width - 40
  const [savedVisible, setSavedVisible] = useState(false)

  function handleSave() {
    setSavedVisible(true)
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={{ uri: photo.illustrationUrl }}
        style={{ width: imageSize, height: imageSize, borderRadius: 16 }}
        resizeMode="cover"
      />

      <View style={{ flexDirection: 'row', gap: 12, marginTop: 20, width: imageSize }}>
        <Pressable
          onPress={handleSave}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderRadius: 9999,
            borderWidth: 1,
            borderColor: colors.cream[200],
            backgroundColor: colors.cream[100],
            paddingVertical: 12,
          }}
        >
          <Ionicons name="download-outline" size={18} color={colors.ink.DEFAULT} />
          <Text variant="label" style={{ color: colors.ink.DEFAULT }}>저장하기</Text>
        </Pressable>

        <Pressable
          onPress={onGoToDiary}
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            borderRadius: 9999,
            backgroundColor: colors.primary.DEFAULT,
            paddingVertical: 12,
          }}
        >
          <Ionicons name="book-outline" size={18} color={colors.white} />
          <Text variant="label" style={{ color: colors.white }}>다이어리 보기</Text>
        </Pressable>
      </View>

      <AlertModal
        visible={savedVisible}
        title="저장 완료"
        message="갤러리에 저장되었습니다."
        onConfirm={() => setSavedVisible(false)}
      />
    </View>
  )
}