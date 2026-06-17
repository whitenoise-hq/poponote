import { useState } from 'react'
import { View, ScrollView, Pressable } from 'react-native'
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

    const [deleteVisible, setDeleteVisible] = useState(false)
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
                    <Pressable
                        onPress={() => setDeleteVisible(true)}
                        style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Ionicons name="trash-outline" size={20} color={colors.danger} />
                    </Pressable>
                ) : (
                    <View style={{ width: 32 }} />
                )}
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
                                <Text variant="body" style={{ color: colors.muted.foreground }}>
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
                <SafeAreaView edges={['bottom']} style={{ backgroundColor: colors.cream.DEFAULT }}>
                    <CommentInput onSend={(body) => addComment.mutate(body)} />
                </SafeAreaView>
            )}

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
        </SafeAreaView>
    )
}