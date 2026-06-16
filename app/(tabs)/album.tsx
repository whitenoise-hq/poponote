import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { MonthFolderCard } from '@/components/album/MonthFolderCard'
import { useAlbumMonths } from '@/hooks/use-album'

export default function AlbumScreen() {
  const router = useRouter()
  const { data: months } = useAlbumMonths()

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      <View className="px-5 pt-4 pb-2">
        <Text variant="title" className="text-ink">
          일러스트 앨범
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-8 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {(months ?? []).map((folder) => (
            <MonthFolderCard
              key={folder.month}
              folder={folder}
              onPress={() => router.push(`/album/${folder.month}` as never)}
            />
          ))}
        </View>
        {(months ?? []).length === 0 && (
          <View className="items-center py-12">
            <Text variant="body" className="text-muted-foreground">
              아직 일러스트가 없어요
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}