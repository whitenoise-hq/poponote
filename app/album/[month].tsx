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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ flex: 1, color: colors.ink.DEFAULT }}>
          {formatMonth(month)}
        </Text>
        <Text variant="caption" style={{ color: colors.muted.foreground, marginRight: 4 }}>
          {(photos ?? []).length}장
        </Text>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <PhotoGrid photos={photos ?? []} onPress={handlePhotoPress} />
      </View>
    </SafeAreaView>
  )
}