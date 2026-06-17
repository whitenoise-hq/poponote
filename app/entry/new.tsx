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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream.DEFAULT }} edges={['top']}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 12 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.ink.DEFAULT} />
        </Pressable>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>
          새 기록
        </Text>
        <View style={{ width: 32 }} />
      </View>

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
          placeholder="제목 (선택)"
          placeholderTextColor={colors.muted.foreground}
          style={{
            marginTop: 16,
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: colors.white,
            borderRadius: 12,
            fontSize: 16,
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
            fontSize: 14,
            fontFamily: 'Pretendard-Regular',
            color: colors.ink.DEFAULT,
            minHeight: 160,
          }}
        />

        {/* Save button */}
        <Button
          label="저장"
          style={{ marginTop: 24 }}
          onPress={handleSave}
          loading={addEntry.isPending}
        />
      </ScrollView>
    </SafeAreaView>
  )
}