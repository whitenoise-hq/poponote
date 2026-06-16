import { FlatList, Pressable, Image, useWindowDimensions } from 'react-native'
import type { AlbumPhoto } from '@/hooks/use-album'

interface PhotoGridProps {
  photos: AlbumPhoto[]
  onPress: (photo: AlbumPhoto) => void
}

export function PhotoGrid({ photos, onPress }: PhotoGridProps) {
  const { width } = useWindowDimensions()
  const gap = 3
  const cols = 3
  const itemSize = (width - 40 - gap * (cols - 1)) / cols

  return (
    <FlatList
      data={photos}
      numColumns={cols}
      keyExtractor={(item) => item.id}
      columnWrapperClassName="gap-[3px]"
      contentContainerClassName="gap-[3px]"
      renderItem={({ item }) => (
        <Pressable onPress={() => onPress(item)}>
          <Image
            source={{ uri: item.illustrationUrl }}
            style={{ width: itemSize, height: itemSize }}
            className="rounded-lg"
            resizeMode="cover"
          />
        </Pressable>
      )}
      showsVerticalScrollIndicator={false}
    />
  )
}
