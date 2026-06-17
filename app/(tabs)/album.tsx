import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text } from '@/components/ui'
import { MonthFolderCard } from '@/components/album/MonthFolderCard'
import { useAlbumMonths } from '@/hooks/use-album'
import { colors } from '@/theme/colors'

export default function AlbumScreen() {
  const router = useRouter()
  const { data: months } = useAlbumMonths()

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      <View style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 }}>
        <Text variant="title" style={{ color: colors.ink.DEFAULT }}>
          일러스트 앨범
        </Text>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          {(months ?? []).map((folder) => (
            <MonthFolderCard
              key={folder.month}
              folder={folder}
              onPress={() => router.push(`/album/${folder.month}` as never)}
            />
          ))}
        </View>
        {(months ?? []).length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Text variant="body" style={{ color: colors.muted.foreground }}>
              아직 일러스트가 없어요
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}