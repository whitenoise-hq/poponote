import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { PhotoGrid } from '@/components/album/PhotoGrid'
import { useAlbumMonth, type AlbumPhoto } from '@/hooks/use-album'
import { colors } from '@/theme/colors'

export default function AlbumMonthScreen() {
  const { month } = useLocalSearchParams<{ month: string }>()
  const router = useRouter()
  const { data: photos } = useAlbumMonth(month ?? '')

  function formatMonth(m: string): string {
    const [y, mo] = m.split('-')
    return `${y}년 ${mo}월`
  }

  function handlePhotoPress(photo: AlbumPhoto) {
    router.push(`/photo-detail/${photo.id}` as never)
  }

  if (!month) return null

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="flex-row items-center px-5 py-3 gap-3">
        <Pressable
          onPress={() => router.back()}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" className="flex-1 text-ink">
          {formatMonth(month)}
        </Text>
        <Text variant="caption" className="text-muted-foreground mr-1">
          {(photos ?? []).length}장
        </Text>
      </View>

      <View className="flex-1 px-5">
        <PhotoGrid photos={photos ?? []} onPress={handlePhotoPress} />
      </View>
    </SafeAreaView>
  )
}