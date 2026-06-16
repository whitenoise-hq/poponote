import { View, ScrollView, Pressable } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Card } from '@/components/ui'
import { EntrySection } from '@/components/diary/EntrySection'
import { ReactionBar } from '@/components/diary/ReactionBar'
import { CareRecordSection } from '@/components/diary/CareRecordSection'
import { CommentSection } from '@/components/diary/CommentSection'
import { CommentInput } from '@/components/diary/CommentInput'
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FBF7F1' }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: '#fde8e0',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="chevron-back" size={20} color="#2B2520" />
        </Pressable>
        <Text variant="subtitle" style={{ color: '#2B2520', flex: 1 }}>
          {formatDateHeader(date)}
        </Text>
      </View>

      {/* Content */}
      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {entry ? (
          <>
            <EntrySection entry={entry} />
            <ReactionBar
              reactions={reactions ?? []}
              onToggle={() => toggleReaction.mutate()}
            />
            <CareRecordSection logs={careLogs ?? []} />
            <CommentSection
              comments={comments ?? []}
              onDelete={(id) => deleteComment.mutate(id)}
            />
          </>
        ) : (
          <View>
            <CareRecordSection logs={careLogs ?? []} />
            {(careLogs ?? []).length === 0 && (
              <Card style={{ paddingVertical: 32, alignItems: 'center', marginTop: 16 }}>
                <Text variant="body" style={{ color: '#9e7e76' }}>
                  이 날의 기록이 없어요
                </Text>
              </Card>
            )}
          </View>
        )}
        <View style={{ height: 24 }} />
      </ScrollView>

      {/* 하단 고정 댓글 입력 */}
      {entry && (
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FBF7F1' }}>
          <CommentInput onSend={(body) => addComment.mutate(body)} />
        </SafeAreaView>
      )}
    </SafeAreaView>
  )
}