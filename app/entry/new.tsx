import { useState } from 'react'
import { View, ScrollView, TextInput, Image, Pressable, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import * as ImagePicker from 'expo-image-picker'
import { Text, Button, AlertModal } from '@/components/ui'
import { PhotoPickerPlaceholder } from '@/components/entry/PhotoPickerPlaceholder'
import { useGenerateDiaryText, useAddDiaryEntry } from '@/hooks/use-diary'
import { colors } from '@/theme/colors'

export default function NewEntryScreen() {
  const router = useRouter()
  const generateText = useGenerateDiaryText()
  const addEntry = useAddDiaryEntry()

  const [localPhotoUrl, setLocalPhotoUrl] = useState<string | null>(null)
  const [generatedPhotoUrl, setGeneratedPhotoUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [progressMessage, setProgressMessage] = useState<string | null>(null)
  const [successVisible, setSuccessVisible] = useState(false)
  const [errorVisible, setErrorVisible] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const isGenerating = generateText.isPending
  const isSaving = addEntry.isPending
  const isBusy = isGenerating || isSaving
  const hasGenerated = !!generatedPhotoUrl
  const canSave = hasGenerated && title.trim().length > 0 && body.trim().length > 0 && !isBusy

  function handlePhotoPick(uri: string) {
    setLocalPhotoUrl(uri)
    setGeneratedPhotoUrl(null)
    setTitle('')
    setBody('')

    generateText.mutate(
      {
        photoUrl: uri,
        onProgress: (step) => setProgressMessage(step),
      },
      {
        onSuccess: (result) => {
          setProgressMessage(null)
          setGeneratedPhotoUrl(result.photoUrl)
          setTitle(result.title)
          setBody(result.body)
        },
        onError: (err) => {
          setProgressMessage(null)
          setLocalPhotoUrl(null)
          setErrorMessage(err instanceof Error ? err.message : 'AI 일기 생성에 실패했습니다.')
          setErrorVisible(true)
        },
      },
    )
  }

  function handleSave() {
    if (!canSave || !generatedPhotoUrl) return

    addEntry.mutate(
      {
        title: title.trim(),
        body: body.trim(),
        photoUrl: generatedPhotoUrl,
      },
      {
        onSuccess: () => setSuccessVisible(true),
        onError: (err) => {
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
          onPress={() => !isBusy && router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', opacity: isBusy ? 0.3 : 1 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          새 기록
        </Text>
        <View style={{ width: 32 }} />
      </View>

      {/* 생성/저장 중 오버레이 */}
      {isGenerating ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16, paddingHorizontal: 32, paddingBottom: 100 }}>
          {localPhotoUrl && (
            <Image
              source={{ uri: localPhotoUrl }}
              style={{ width: 120, height: 120, borderRadius: 16, marginBottom: 8 }}
              resizeMode="cover"
            />
          )}
          <ActivityIndicator size="large" color={colors.primary.DEFAULT} />
          <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, textAlign: 'center' }}>
            {progressMessage ?? '처리 중...'}
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
          {localPhotoUrl ? (
            <Pressable onPress={async () => {
              if (isBusy) return
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                quality: 0.9,
              })
              if (!result.canceled && result.assets[0]) {
                handlePhotoPick(result.assets[0].uri)
              }
            }}>
              <Image
                source={{ uri: localPhotoUrl }}
                style={{ width: '100%', height: 224, borderRadius: 16 }}
                resizeMode="cover"
              />
              <Text variant="caption" style={{ color: colors.muted.foreground, textAlign: 'center', marginTop: 4 }}>
                탭하여 사진 변경
              </Text>
            </Pressable>
          ) : (
            <PhotoPickerPlaceholder onPick={handlePhotoPick} />
          )}

          {/* Title */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder={hasGenerated ? '제목' : 'AI가 작성해드려요'}
            placeholderTextColor={colors.muted.foreground}
            editable={hasGenerated}
            style={{
              marginTop: 16,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: hasGenerated ? colors.white : colors.cream[200],
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.cream[200],
              fontSize: 14,
              fontFamily: 'Pretendard-Medium',
              color: colors.ink.DEFAULT,
              opacity: hasGenerated ? 1 : 0.5,
            }}
          />

          {/* Body */}
          <TextInput
            value={body}
            onChangeText={setBody}
            placeholder={hasGenerated ? '오늘 하루를 기록해보세요...' : '사진을 올리면 AI가 일기를 써드려요'}
            placeholderTextColor={colors.muted.foreground}
            editable={hasGenerated}
            multiline
            textAlignVertical="top"
            style={{
              marginTop: 12,
              paddingHorizontal: 16,
              paddingVertical: 12,
              backgroundColor: hasGenerated ? colors.white : colors.cream[200],
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.cream[200],
              fontSize: 14,
              fontFamily: 'Pretendard-Regular',
              color: colors.ink.DEFAULT,
              minHeight: 160,
              opacity: hasGenerated ? 1 : 0.5,
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
        visible={successVisible}
        title="저장 완료"
        message="일기가 저장되었습니다."
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