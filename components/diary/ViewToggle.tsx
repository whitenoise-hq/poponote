import { useRef, useEffect } from 'react'
import { View, Pressable, Animated, useWindowDimensions } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from '@/components/ui'

export type DiaryViewMode = 'calendar' | 'list'

interface ViewToggleProps {
  mode: DiaryViewMode
  onChangeMode: (mode: DiaryViewMode) => void
}

export function ViewToggle({ mode, onChangeMode }: ViewToggleProps) {
  const { width } = useWindowDimensions()
  const toggleWidth = width - 40 // px-5 양쪽
  const tabWidth = (toggleWidth - 8) / 2 // padding 4 양쪽
  const slideAnim = useRef(new Animated.Value(mode === 'calendar' ? 0 : 1)).current

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: mode === 'calendar' ? 0 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 30,
    }).start()
  }, [mode, slideAnim])

  const translateX = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, tabWidth],
  })

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: '#fde8e0',
        borderRadius: 20,
        padding: 4,
        position: 'relative',
      }}
    >
      {/* Sliding indicator */}
      <Animated.View
        style={{
          position: 'absolute',
          top: 4,
          left: 4,
          width: tabWidth,
          height: '100%',
          backgroundColor: '#fff',
          borderRadius: 16,
          transform: [{ translateX }],
          shadowColor: '#f4846a',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 3,
        }}
      />

      <Pressable
        onPress={() => onChangeMode('calendar')}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingVertical: 10,
          zIndex: 1,
        }}
      >
        <Ionicons
          name="calendar-outline"
          size={14}
          color={mode === 'calendar' ? '#F2724A' : '#9e7e76'}
        />
        <Text
          variant="label"
          style={{
            color: mode === 'calendar' ? '#F2724A' : '#9e7e76',
            fontWeight: mode === 'calendar' ? '700' : '400',
          }}
        >
          캘린더
        </Text>
      </Pressable>

      <Pressable
        onPress={() => onChangeMode('list')}
        style={{
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          paddingVertical: 10,
          zIndex: 1,
        }}
      >
        <Ionicons
          name="grid-outline"
          size={14}
          color={mode === 'list' ? '#F2724A' : '#9e7e76'}
        />
        <Text
          variant="label"
          style={{
            color: mode === 'list' ? '#F2724A' : '#9e7e76',
            fontWeight: mode === 'list' ? '700' : '400',
          }}
        >
          피드
        </Text>
      </Pressable>
    </View>
  )
}