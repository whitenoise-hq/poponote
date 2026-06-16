import { ScrollView, View } from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import { LinearGradient } from 'expo-linear-gradient'

import { PetHeader } from '@/components/home/PetHeader'
import { CareSection } from '@/components/home/CareSection'
import { DiaryPreview } from '@/components/home/DiaryPreview'
import { usePet } from '@/hooks/use-pet'
import { useCareLogs, useAddCareLog } from '@/hooks/use-care-logs'
import { useTodayEntry } from '@/hooks/use-diary'
import { TODAY } from '@/lib/mock-data'
import type { CareKind } from '@/types'

export default function HomeScreen() {
  const router = useRouter()
  const { data: pet } = usePet()
  const { data: careLogs } = useCareLogs(TODAY)
  const addCareLog = useAddCareLog(TODAY)
  const { data: todayEntry } = useTodayEntry()

  function handleAddCare(kind: CareKind, memo: string | null) {
    addCareLog.mutate({ kind, memo })
  }

  function handlePressEntry() {
    router.push(`/diary/${TODAY}` as never)
  }

  function handlePressWrite() {
    router.push('/entry/new' as never)
  }

  return (
    <LinearGradient
      colors={['#fff0ec', '#fdf8f5', '#FBF7F1']}
      locations={[0, 0.3, 1]}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={['top']}>
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {pet && <PetHeader pet={pet} />}

          <View className="px-4 pb-8 gap-6">
            <CareSection
              logs={careLogs ?? []}
              onAdd={handleAddCare}
            />

            <DiaryPreview
              entry={todayEntry}
              onPressEntry={handlePressEntry}
              onPressWrite={handlePressWrite}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}