import { useState } from 'react'
import { View, ScrollView, TextInput, Image, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Button, AlertModal } from '@/components/ui'
import { PhotoPickerPlaceholder } from '@/components/entry/PhotoPickerPlaceholder'
import { useAddDiaryEntry } from '@/hooks/use-diary'
import { colors } from '@/theme/colors'

export default function NewEntryScreen() {
  const router = useRouter()
  const addEntry = useAddDiaryEntry()

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [alertVisible, setAlertVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [progressMessage, setProgressMessage] = useState<string | null>(null)

  const canSave = !!photoUrl && title.trim().length > 0 && body.trim().length > 0
  const isSaving = addEntry.isPending

  function handleSave() {
    if (!canSave) {
      setAlertVisible(true)
      return
    }

    addEntry.mutate(
      {
        title: title.trim() || null,
        body: body.trim(),
        photoUrl,
        onProgress: (step) => setProgressMessage(step),
      },
      {
        onSuccess: () => {
          setProgressMessage(null)
          router.back()
        },
        onError: (err) => {
          setProgressMessage(null)
          setErrorMessage(err instanceof Error ? err.message : '저장에 실패했습니다.')
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
          새 기록
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 저장/변환 중 오버레이 */}
      {isSaving ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32, paddingBottom: 100 }}>
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, textAlign: 'center' }}>
            {progressMessage ?? '저장 중...'}
          </Text>
          <Text variant="caption" style={{ color: colors.muted.foreground, textAlign: 'center' }}>
            잠시만 기다려주세요
          </Text>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          contentContainerStyle={{ paddingBottom: 32 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Photo */}
          {photoUrl ? (
            <Pressable onPress={() => setPhotoUrl(null)}>
              <Image
                source={{ uri: photoUrl }}
                style={{ width: '100%', height: 224, borderRadius: 16 }}
                resizeMode="cover"
              />
              <Text variant="caption" style={{ color: colors.muted.foreground, textAlign: 'center', marginTop: 4 }}>
                탭하여 사진 변경
              </Text>
            </Pressable>
          ) : (
            <PhotoPickerPlaceholder onPick={setPhotoUrl} />
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
            label="저장"
            style={{ marginTop: 24, opacity: canSave ? 1 : 0.4 }}
            disabled={!canSave}
            onPress={handleSave}
          />
        </ScrollView>
      )}

      <AlertModal
        visible={alertVisible}
        title="알림"
        message="사진, 제목, 내용을 모두 입력해주세요."
        onConfirm={() => setAlertVisible(false)}
      />

      <AlertModal
        visible={errorVisible}
        title="저장 실패"
        message={errorMessage}
        onConfirm={() => setErrorVisible(false)}
      />
    </SafeAreaView>
  )
}