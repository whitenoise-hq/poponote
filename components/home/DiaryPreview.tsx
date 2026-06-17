import { View, Image, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card } from '@/components/ui'
import { colors } from '@/theme/colors'
import { getMemberNickname } from '@/lib/mock-data'
import type { DiaryEntry } from '@/types'

interface DiaryPreviewProps {
  entry: DiaryEntry | null | undefined
  onPressEntry: () => void
  onPressMore: () => void
  onPressWrite: () => void
}

export function DiaryPreview({
  entry,
  onPressEntry,
  onPressMore,
  onPressWrite,
}: DiaryPreviewProps) {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          오늘의 일기
        </Text>
        {entry && (
          <Pressable onPress={onPressMore} style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Text variant="caption" style={{ color: colors.primary.DEFAULT }}>
              더보기
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.primary.DEFAULT} />
          </Pressable>
        )}
      </View>

      {entry ? (
        <Pressable onPress={onPressEntry}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {entry.photo_url && (
              <View>
                <Image
                  source={{ uri: entry.photo_url }}
                  style={{ width: '100%', height: 192 }}
                  resizeMode="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: 'rgba(61,47,42,0.45)',
                    justifyContent: 'flex-end',
                    padding: 12,
                  }}
                >
                  {entry.title && (
                    <Text
                      variant="label"
                      style={{ color: colors.white, fontWeight: '700' }}
                    >
                      {entry.title}
                    </Text>
                  )}
                </View>
              </View>
            )}
            <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
              <Text
                variant="caption"
                style={{ color: colors.muted.foreground, lineHeight: 24 }}
                numberOfLines={2}
              >
                {entry.body}
              </Text>
              <Text variant="caption" style={{ color: colors.muted.foreground, marginTop: 8 }}>
                {getMemberNickname(entry.author_id)}
              </Text>
            </View>
          </Card>
        </Pressable>
      ) : (
        <Pressable onPress={onPressWrite}>
          <View
            style={{
              borderRadius: 16,
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: colors.primary.DEFAULT + '40',
              backgroundColor: colors.primary[50],
              paddingVertical: 28,
              paddingHorizontal: 20,
              alignItems: 'center',
              gap: 10,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: colors.white,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="pencil" size={22} color={colors.primary.DEFAULT} />
            </View>
            <Text variant="label" style={{ color: colors.ink.DEFAULT }}>
              오늘 일기를 남겨주세요.
            </Text>
            <Text variant="caption" style={{ color: colors.muted.foreground }}>
              탭해서 오늘 하루를 기록해보세요
            </Text>
          </View>
        </Pressable>
      )}
    </View>
  )
}