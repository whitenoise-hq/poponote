import { View, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Card } from '@/components/ui'
import { EntrySection } from '@/components/diary/EntrySection'
import { CareRecordSection } from '@/components/diary/CareRecordSection'
import { ReactionBar } from '@/components/diary/ReactionBar'
import { CommentSection } from '@/components/diary/CommentSection'
import { useDiaryEntry } from '@/hooks/use-diary'
import { useCareLogs } from '@/hooks/use-care-logs'
import { useComments, useAddComment, useDeleteComment } from '@/hooks/use-comments'
import { useReactions, useToggleReaction } from '@/hooks/use-reactions'

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

export default function DiaryDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>()
  const router = useRouter()
  const { data: entry } = useDiaryEntry(date ?? '')
  const { data: careLogs } = useCareLogs(date ?? '')
  const { data: comments } = useComments(entry?.id ?? null)
  const { data: reactions } = useReactions(entry?.id ?? null)
  const addComment = useAddComment(entry?.id ?? '')
  const deleteComment = useDeleteComment(entry?.id ?? '')
  const toggleReaction = useToggleReaction(entry?.id ?? '')

  if (!date) return null

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 gap-3">
        <Pressable
          onPress={() => router.back()}
          className="w-8 h-8 rounded-full bg-secondary items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color="#2B2520" />
        </Pressable>
        <Text variant="subtitle" className="text-ink flex-1">
          {formatDateHeader(date)}
        </Text>
      </View>

      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {entry ? (
          <>
            <EntrySection entry={entry} />
            <CareRecordSection logs={careLogs ?? []} />
            <ReactionBar
              reactions={reactions ?? []}
              onToggle={() => toggleReaction.mutate()}
            />
            <CommentSection
              comments={comments ?? []}
              onAdd={(body) => addComment.mutate(body)}
              onDelete={(id) => deleteComment.mutate(id)}
            />
          </>
        ) : (
          <View>
            <CareRecordSection logs={careLogs ?? []} />
            {(careLogs ?? []).length === 0 && (
              <Card className="py-8 items-center mt-4">
                <Text variant="body" className="text-muted-foreground">
                  이 날의 기록이 없어요
                </Text>
              </Card>
            )}
          </View>
        )}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  )
}