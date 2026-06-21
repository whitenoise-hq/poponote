import { useState, useRef } from 'react'
import { View, ScrollView, Pressable, KeyboardAvoidingView, Platform } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Card, AlertModal } from '@/components/ui'
import { EntrySection } from '@/components/diary/EntrySection'
import { ReactionBar } from '@/components/diary/ReactionBar'
import { CareRecordSection } from '@/components/diary/CareRecordSection'
import { CommentSection } from '@/components/diary/CommentSection'
import { CommentInput } from '@/components/diary/CommentInput'
import { useDiaryEntry, useDeleteDiaryEntry } from '@/hooks/use-diary'
import { useCareLogs } from '@/hooks/use-care-logs'
import { useComments, useAddComment, useDeleteComment } from '@/hooks/use-comments'
import { useReactions, useToggleReaction } from '@/hooks/use-reactions'
import { useAuth } from '@/hooks/use-auth'
import { useRefetchOnFocus } from '@/hooks/use-refetch-on-focus'
import { colors } from '@/theme/colors'

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
    const { user } = useAuth()
    const { data: entry } = useDiaryEntry(date ?? '')
    const { data: careLogs } = useCareLogs(date ?? '')
    const { data: comments } = useComments(entry?.id ?? null)
    const { data: reactions } = useReactions(entry?.id ?? null)
    const addComment = useAddComment(entry?.id ?? '')
    const deleteComment = useDeleteComment(entry?.id ?? '')
    const toggleReaction = useToggleReaction(entry?.id ?? '')
    const deleteEntry = useDeleteDiaryEntry()

    useRefetchOnFocus([['diaryEntry'], ['careLogs'], ['comments'], ['reactions']])

    const scrollRef = useRef<ScrollView>(null)
    // 내가 댓글을 작성한 경우에만, 새 댓글이 렌더된 뒤(onContentSizeChange) 맨 아래로 스크롤
    const pendingScrollRef = useRef(false)

    const [deleteVisible, setDeleteVisible] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState<string | null>(null)
    const isOwner = entry && user && entry.author_id === user.id

    function handleDelete() {
        if (!entry) return
        setDeleteVisible(false)
        deleteEntry.mutate(entry.id, {
            onSuccess: () => router.back(),
        })
    }

    if (!date) return null

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                gap: 12,
            }}>
                <Pressable
                    onPress={() => router.back()}
                    style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                >
                    <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
                </Pressable>
                <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, flex: 1, textAlign: 'center' }}>
                    {formatDateHeader(date)}
                </Text>
                {isOwner ? (
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                        <Pressable
                            onPress={() => router.push(`/entry/${entry.id}/edit` as never)}
                            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Ionicons name="create-outline" size={20} color={colors.ink.DEFAULT} />
                        </Pressable>
                        <Pressable
                            onPress={() => setDeleteVisible(true)}
                            style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Ionicons name="trash-outline" size={20} color={colors.danger} />
                        </Pressable>
                    </View>
                ) : (
                    <View style={{ width: 32 }} />
                )}
            </View>

            {/* Content */}
            <ScrollView
                ref={scrollRef}
                style={{ flex: 1, paddingHorizontal: 20 }}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => {
                    if (pendingScrollRef.current) {
                        pendingScrollRef.current = false
                        scrollRef.current?.scrollToEnd({ animated: true })
                    }
                }}
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
                            onDelete={(id) => setCommentToDelete(id)}
                        />
                    </>
                ) : (
                    <View>
                        <CareRecordSection logs={careLogs ?? []} />

                        {(careLogs ?? []).length === 0 && (
                            <Card style={{ paddingVertical: 32, alignItems: 'center', marginTop: 16 }}>
                                <Text variant="body" style={{ color: colors.muted.foreground }}>
                                    이 날의 기록이 없어요
                                </Text>
                            </Card>
                        )}
                    </View>
                )}
                <View style={{ height: 24 }} />
            </ScrollView>

            {/* 하단 고정 댓글 입력 (안전영역 여백은 CommentInput이 키보드 상태에 맞춰 처리) */}
            {entry && (
                <CommentInput
                    onSend={(body) => {
                        pendingScrollRef.current = true
                        addComment.mutate(body)
                    }}
                />
            )}
          </KeyboardAvoidingView>

            {/* 삭제 확인 모달 */}
            <AlertModal
                visible={deleteVisible}
                title="일기 삭제"
                message={"이 일기를 삭제하시겠어요?\n댓글과 좋아요도 함께 삭제됩니다."}
                confirmLabel="삭제"
                destructive
                onConfirm={handleDelete}
                onCancel={() => setDeleteVisible(false)}
            />

            {/* 댓글 삭제 확인 모달 */}
            <AlertModal
                visible={!!commentToDelete}
                title="댓글 삭제"
                message="이 댓글을 삭제하시겠어요?"
                confirmLabel="삭제"
                destructive
                onConfirm={() => {
                    if (commentToDelete) deleteComment.mutate(commentToDelete)
                    setCommentToDelete(null)
                }}
                onCancel={() => setCommentToDelete(null)}
            />
        </SafeAreaView>
    )
}