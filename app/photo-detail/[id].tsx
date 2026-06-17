import { View, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { PhotoDetail } from '@/components/album/PhotoDetail'
import { useDiaryEntries } from '@/hooks/use-diary'
import { colors } from '@/theme/colors'

export default function AlbumPhotoDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: entries } = useDiaryEntries()

  const entry = (entries ?? []).find((e) => e.id === id)
  if (!entry || !entry.illustration_url) return null

  const photo = {
    id: entry.id,
    date: entry.date,
    illustrationUrl: entry.illustration_url,
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 20, justifyContent: 'center' }}>
        <PhotoDetail
          photo={photo}
          onGoToDiary={() => router.push(`/diary/${entry.date}` as never)}
        />
      </View>
    </SafeAreaView>
  )
}