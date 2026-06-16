import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { getMemberNickname } from '@/lib/mock-data'
import type { DiaryEntry } from '@/types'

interface DiaryPreviewProps {
  entry: DiaryEntry | null | undefined
  onPressEntry: () => void
  onPressWrite: () => void
}

export function DiaryPreview({
  entry,
  onPressEntry,
  onPressWrite,
}: DiaryPreviewProps) {
  return (
    <View>
      <View className="flex-row items-center justify-between mb-3">
        <Text variant="subtitle" className="text-ink">
          오늘의 일기
        </Text>
        {entry && (
          <Pressable onPress={onPressEntry} className="flex-row items-center gap-0.5">
            <Text variant="caption" className="text-primary">
              더보기
            </Text>
            <Ionicons name="chevron-forward" size={14} color="#F2724A" />
          </Pressable>
        )}
      </View>

      {entry ? (
        <Pressable onPress={onPressEntry}>
          <Card className="overflow-hidden" style={{ padding: 0 }}>
            {entry.photo_url && (
              <View className="relative">
                <Image
                  source={{ uri: entry.photo_url }}
                  style={{ width: '100%', height: 192 }}
                  resizeMode="cover"
                />
                <View
                  className="absolute inset-0"
                  style={{
                    backgroundColor: 'rgba(61,47,42,0.45)',
                    justifyContent: 'flex-end',
                    padding: 12,
                  }}
                >
                  {entry.title && (
                    <Text
                      variant="label"
                      className="text-white"
                      style={{ fontWeight: '700' }}
                    >
                      {entry.title}
                    </Text>
                  )}
                </View>
              </View>
            )}
            <View className="px-4 py-3">
              <Text
                variant="caption"
                className="text-muted-foreground leading-relaxed"
                numberOfLines={2}
              >
                {entry.body}
              </Text>
              <Text variant="caption" className="text-muted-foreground mt-2">
                {getMemberNickname(entry.author_id)}
              </Text>
            </View>
          </Card>
        </Pressable>
      ) : (
        <Pressable onPress={onPressWrite}>
          <Card className="py-8 items-center gap-2">
            <Ionicons name="create-outline" size={28} color="#9e7e76" />
            <Text variant="body" className="text-muted-foreground">
              오늘 일기를 남겨주세요
            </Text>
          </Card>
        </Pressable>
      )}
    </View>
  )
}