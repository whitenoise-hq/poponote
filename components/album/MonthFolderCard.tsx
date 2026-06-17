import {Pressable, View, Image, useWindowDimensions} from 'react-native'
import {Text} from '@/components/ui'
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

const SCREEN_PADDING = 40 // paddingHorizontal: 20 = 좌우 합 40
const COLUMN_GAP = 16

const imageBase = {
    position: 'absolute' as const,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cream[200],
    backgroundColor: colors.white,
}

export function MonthFolderCard({folder, onPress}: MonthFolderCardProps) {
    const {width} = useWindowDimensions()
    const cardWidth = (width - SCREEN_PADDING - COLUMN_GAP) / 2

    const [front, second, third] = folder.coverUrls
    const back = Math.round(cardWidth * 0.7)
    const main = Math.round(cardWidth * 0.78)
    const center = (dim: number) => (cardWidth - dim) / 2
    const offset = Math.round(cardWidth * 0.07)

    return (
        <Pressable onPress={onPress} style={{width: cardWidth, marginBottom: 12, alignItems: 'center'}}>
            <View style={{width: cardWidth, height: cardWidth, marginBottom: -5}}>
                {third && (
                    <Image
                        source={{uri: third}}
                        resizeMode="cover"
                        style={{
                            ...imageBase,
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
                        style={{
                            ...imageBase,
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
                    style={{
                        ...imageBase,
                        width: main,
                        height: main,
                        top: center(main),
                        left: center(main),
                        shadowColor: '#000',
                        shadowOffset: {width: 0, height: 1},
                        shadowOpacity: 0.08,
                        shadowRadius: 8,
                    }}
                />
            </View>

            <View style={{alignItems: 'center', marginTop: -4}}>
                <Text variant="subtitle" style={{color: colors.ink.DEFAULT}}>
                    {formatMonth(folder.month)}
                </Text>
            </View>
        </Pressable>
    )
}