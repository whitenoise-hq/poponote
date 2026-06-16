import {Pressable, View, Image, useWindowDimensions} from 'react-native'
import {Text} from '@/components/ui'
import type {AlbumMonth} from '@/hooks/use-album'

interface MonthFolderCardProps {
    folder: AlbumMonth
    onPress: () => void
}

function formatMonth(month: string): string {
    const [y, m] = month.split('-')
    return `${y}년 ${m}월`
}

const SCREEN_PADDING = 20 // album 화면 px-5 좌우 합
const COLUMN_GAP = 16

export function MonthFolderCard({folder, onPress}: MonthFolderCardProps) {
    const {width} = useWindowDimensions()
    const cardWidth = (width - SCREEN_PADDING - COLUMN_GAP) / 2

    const [front, second, third] = folder.coverUrls
    const back = Math.round(cardWidth * 0.7)
    const main = Math.round(cardWidth * 0.78)
    const center = (dim: number) => (cardWidth - dim) / 2
    const offset = Math.round(cardWidth * 0.07) // 뒤 레이어를 좌우로 펼쳐 빼내는 양

    return (
        <Pressable onPress={onPress} className="mb-5 items-center" style={{width: cardWidth}}>
            {/* 겹친 사진 더미 */}
            <View style={{width: cardWidth, height: cardWidth}}>
                {third && (
                    <Image
                        source={{uri: third}}
                        resizeMode="cover"
                        className="absolute rounded-2xl border border-cream-200 bg-white"
                        style={{
                            width: back,
                            height: back,
                            top: center(back),
                            left: center(back) - offset,
                            transform: [{rotate: '-12deg'}],
                        }}
                    />
                )}
                {second && (
                    <Image
                        source={{uri: second}}
                        resizeMode="cover"
                        className="absolute rounded-2xl border border-cream-200 bg-white"
                        style={{
                            width: back,
                            height: back,
                            top: center(back),
                            left: center(back) + offset,
                            transform: [{rotate: '11deg'}],
                        }}
                    />
                )}
                <Image
                    source={{uri: front}}
                    resizeMode="cover"
                    className="absolute rounded-2xl border border-cream-200 bg-white shadow-card"
                    style={{width: main, height: main, top: center(main), left: center(main)}}
                />
            </View>

            {/* 연·월 + 장수 */}
            <View className="items-center">
                <Text variant="subtitle" className="text-ink">
                    {formatMonth(folder.month)}
                </Text>
            </View>
        </Pressable>
    )
}
