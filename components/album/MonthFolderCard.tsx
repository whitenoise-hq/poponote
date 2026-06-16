import {Pressable, View, Image} from 'react-native'
import {Ionicons} from '@expo/vector-icons'
import {Text, Card} from '@/components/ui'
import {colors} from '@/theme/colors'
import type {AlbumMonth} from '@/hooks/use-album'

interface MonthFolderCardProps {
    folder: AlbumMonth
    onPress: () => void
}

function formatMonth(month: string): string {
    const [y, m] = month.split('-')
    return `${y}년 ${m}월`
}

export function MonthFolderCard({folder, onPress}: MonthFolderCardProps) {
    return (
        <Pressable onPress={onPress}>
            <Card className="flex-row items-center gap-4 p-2 border border-cream-200">
                <Image
                    source={{uri: folder.coverUrl}}
                    className="w-20 h-20 rounded-xl"
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
                <Ionicons name="chevron-forward" size={18} color={colors.ink[300]}/>
            </Card>
        </Pressable>
    )
}
