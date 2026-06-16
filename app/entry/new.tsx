import { useState } from 'react'
import { View, ScrollView, TextInput, Image, Pressable, Alert } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'

import { Text, Button } from '@/components/ui'
import { PhotoPickerPlaceholder } from '@/components/entry/PhotoPickerPlaceholder'
import { useAddDiaryEntry } from '@/hooks/use-diary'
import { colors } from '@/theme/colors'

export default function NewEntryScreen() {
  const router = useRouter()
  const addEntry = useAddDiaryEntry()

  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')

  function handleSave() {
    if (!body.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.')
      return
    }

    addEntry.mutate(
      {
        title: title.trim() || null,
        body: body.trim(),
        photoUrl,
      },
      {
        onSuccess: () => router.back(),
      },
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3">
        <Pressable
          onPress={() => router.back()}
          className="w-8 h-8 items-center justify-center"
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" className="text-ink">
          새 기록
        </Text>
        <View className="w-8" />
      </View>

      <ScrollView
        className="flex-1 px-5"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Photo */}
        {photoUrl ? (
          <Pressable onPress={() => setPhotoUrl(null)}>
            <Image
              source={{ uri: photoUrl }}
              className="w-full h-56 rounded-2xl"
              resizeMode="cover"
            />
            <Text variant="caption" className="text-muted-foreground text-center mt-1">
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
          placeholder="제목 (선택)"
          placeholderTextColor={colors.muted.foreground}
          className="mt-4 px-4 py-3 bg-white rounded-xl text-base font-medium text-ink"
          style={{ fontFamily: 'GothicA1_500Medium' }}
        />

        {/* Body */}
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="오늘 하루를 기록해보세요..."
          placeholderTextColor={colors.muted.foreground}
          multiline
          textAlignVertical="top"
          className="mt-3 px-4 py-3 bg-white rounded-xl text-sm font-sans text-ink min-h-[160px]"
          style={{ fontFamily: 'GothicA1_400Regular' }}
        />

        {/* Save button */}
        <Button
          label="저장"
          className="mt-6"
          onPress={handleSave}
          loading={addEntry.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  )
}
