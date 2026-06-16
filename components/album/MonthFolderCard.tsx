import { Pressable, View, Image } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import type { AlbumMonth } from '@/hooks/use-album'

interface MonthFolderCardProps {
  folder: AlbumMonth
  onPress: () => void
}

function formatMonth(month: string): string {
  const [y, m] = month.split('-')
  return `${y}.${m}`
}

export function MonthFolderCard({ folder, onPress }: MonthFolderCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Card className="flex-row items-center p-3 gap-4">
        <Image
          source={{ uri: folder.coverUrl }}
          className="w-16 h-16 rounded-xl"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text variant="subtitle" className="text-ink">
            {formatMonth(folder.month)}
          </Text>
          <Text variant="caption" className="text-muted-foreground mt-0.5">
            {folder.count}장
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#C4B9AC" />
      </Card>
    </Pressable>
  )
}