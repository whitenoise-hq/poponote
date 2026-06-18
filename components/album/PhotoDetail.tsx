import { useState } from 'react'
import { View, Image, Pressable, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library/legacy'
import * as FileSystem from 'expo-file-system/legacy'
import * as Sharing from 'expo-sharing'
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
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertTitle, setAlertTitle] = useState('')
  const [alertMessage, setAlertMessage] = useState('')

  async function handleSave() {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync()
      if (status !== 'granted') {
        setAlertTitle('권한 필요')
        setAlertMessage('갤러리 접근 권한이 필요합니다.')
        setAlertVisible(true)
        return
      }

      const fileUri = FileSystem.cacheDirectory + `poponote_${Date.now()}.jpg`
      const download = await FileSystem.downloadAsync(photo.photoUrl, fileUri)
      await MediaLibrary.saveToLibraryAsync(download.uri)

      setAlertTitle('저장 완료')
      setAlertMessage('갤러리에 저장되었습니다.')
      setAlertVisible(true)
    } catch {
      setAlertTitle('저장 실패')
      setAlertMessage('사진 저장에 실패했습니다.')
      setAlertVisible(true)
    }
  }

  async function handleShare() {
    try {
      const fileUri = FileSystem.cacheDirectory + `poponote_share_${Date.now()}.jpg`
      const download = await FileSystem.downloadAsync(photo.photoUrl, fileUri)
      await Sharing.shareAsync(download.uri)
    } catch {
      setAlertTitle('공유 실패')
      setAlertMessage('사진 공유에 실패했습니다.')
      setAlertVisible(true)
    }
  }

  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Image
        source={{ uri: photo.photoUrl }}
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
          onPress={handleShare}
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
          <Ionicons name="share-outline" size={18} color={colors.ink.DEFAULT} />
          <Text variant="label" style={{ color: colors.ink.DEFAULT }}>공유하기</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={onGoToDiary}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          borderRadius: 9999,
          backgroundColor: colors.primary.DEFAULT,
          paddingVertical: 12,
          marginTop: 12,
          width: imageSize,
        }}
      >
        <Ionicons name="book-outline" size={18} color={colors.white} />
        <Text variant="label" style={{ color: colors.white }}>다이어리 보기</Text>
      </Pressable>

      <AlertModal
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onConfirm={() => setAlertVisible(false)}
      />
    </View>
  )
}