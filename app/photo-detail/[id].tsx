import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { PhotoDetail } from '@/components/album/PhotoDetail'
import { getDiaryEntries } from '@/lib/mock-data'

export default function AlbumPhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()

  const entry = getDiaryEntries().find((e) => e.id === id)
  if (!entry || !entry.illustration_url) return null

  const photo = {
    id: entry.id,
    date: entry.date,
    illustrationUrl: entry.illustration_url,
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-8 h-8 rounded-full bg-secondary items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="#2B2520" />
        </Pressable>
      </View>

      <View className="flex-1 px-5 justify-center">
        <PhotoDetail
          photo={photo}
          onGoToDiary={() => router.push(`/diary/${entry.date}` as never)}
        />
      </View>
    </SafeAreaView>
  )
}