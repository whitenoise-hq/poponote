import { useState, useEffect } from 'react'
import { View, ScrollView, TextInput, Image, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Button, AlertModal } from '@/components/ui'
import { useDiaryEntries, useUpdateDiaryEntry } from '@/hooks/use-diary'
import { colors } from '@/theme/colors'

export default function EditEntryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { data: entries, isLoading } = useDiaryEntries()
  const updateEntry = useUpdateDiaryEntry()

  const entry = (entries ?? []).find((e) => e.id === id)

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [initialized, setInitialized] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (entry && !initialized) {
      setTitle(entry.title ?? '')
      setBody(entry.body ?? '')
      setInitialized(true)
    }
  }, [entry, initialized])

  const isSaving = updateEntry.isPending
  const canSave = title.trim().length > 0 && body.trim().length > 0 && !isSaving

  if (isLoading || !entry) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT, alignItems: 'center', justifyContent: 'center' }} edges={['top']}>
        <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
      </SafeAreaView>
    )
  }

  function handleSave() {
    if (!canSave || !entry) return

    updateEntry.mutate(
      {
        entryId: entry.id,
        title: title.trim(),
        body: body.trim(),
      },
      {
        onSuccess: () => setSuccessVisible(true),
        onError: (err) => {
          setErrorMessage(err instanceof Error ? err.message : '수정에 실패했습니다.')
          setErrorVisible(true)
        },
      },
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable
          onPress={() => !isSaving && router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', opacity: isSaving ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          일기 수정
        </Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo (읽기 전용) */}
        {entry.photo_url && (
          <Image
            source={{ uri: entry.photo_url }}
            style={{ width: '100%', height: 224, borderRadius: 16 }}
            resizeMode="cover"
          />
        )}

        {/* Title */}
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="제목"
          placeholderTextColor={colors.muted.foreground}
          style={{
            marginTop: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.white,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.cream[200],
            fontSize: 14,
            fontFamily: 'Pretendard-Medium',
            color: colors.ink.DEFAULT,
          }}
        />

        {/* Body */}
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="오늘 하루를 기록해보세요..."
          placeholderTextColor={colors.muted.foreground}
          multiline
          textAlignVertical="top"
          style={{
            marginTop: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.white,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.cream[200],
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: colors.ink.DEFAULT,
            minHeight: 160,
          }}
        />

        {/* Save button */}
        <Button
          label="수정 완료"
          style={{ marginTop: 24, opacity: canSave ? 1 : 0.4 }}
          disabled={!canSave}
          onPress={handleSave}
        />
      </ScrollView>

      <AlertModal
        visible={successVisible}
        title="수정 완료"
        message="일기가 수정되었습니다."
        onConfirm={() => {
          setSuccessVisible(false)
          router.back()
        }}
      />

      <AlertModal
        visible={errorVisible}
        title="오류"
        message={errorMessage}
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}