import { useState, useRef } from 'react'
import { View, Image, Pressable, Animated, type ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from './text'
import { colors } from '@/theme/colors'

interface FlipImageProps {
  frontUri: string   // 일러스트
  backUri: string    // 원본
  style?: ViewStyle
  borderRadius?: number
}

/**
 * 앞면(일러스트) ↔ 뒷면(원본) 플립 이미지.
 * 하단 버튼으로 토글, Y축 회전 애니메이션.
 */
export function FlipImage({ frontUri, backUri, style, borderRadius = 16 }: FlipImageProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const flipAnim = useRef(new Animated.Value(0)).current

  function handleFlip() {
    Animated.spring(flipAnim, {
      toValue: isFlipped ? 0 : 1,
      friction: 8,
      tension: 60,
      useNativeDriver: true,
    }).start()
    setIsFlipped(!isFlipped)
  }

  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  })

  const imageStyle = {
    width: '100%' as const,
    height: '100%' as const,
    borderRadius,
  }

  return (
    <View>
      <View style={[{ overflow: 'hidden', borderRadius }, style]}>
        {/* Front - 일러스트 */}
        <Animated.View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ perspective: 1000 }, { rotateY: frontInterpolate }],
          }}
        >
          <Image source={{ uri: frontUri }} style={imageStyle} resizeMode="cover" />
        </Animated.View>

        {/* Back - 원본 */}
        <Animated.View
          style={{
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            transform: [{ perspective: 1000 }, { rotateY: backInterpolate }],
          }}
        >
          <Image source={{ uri: backUri }} style={imageStyle} resizeMode="cover" />
        </Animated.View>
      </View>

      {/* 토글 버튼 */}
      <Pressable
        onPress={handleFlip}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 4,
          marginTop: 8,
          paddingVertical: 6,
        }}
      >
        <Ionicons
          name={isFlipped ? 'color-palette-outline' : 'image-outline'}
          size={14}
          color={colors.muted.foreground}
        />
        <Text variant="caption" style={{ color: colors.muted.foreground }}>
          {isFlipped ? '일러스트 보기' : '원본 보기'}
        </Text>
      </Pressable>
    </View>
  )
}