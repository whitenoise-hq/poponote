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
import { colors } from '@/theme/colors'

function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
const TODAY = todayStr()
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

  function handlePressMore() {
    router.navigate('/(tabs)/diary' as never)
  }

  function handlePressWrite() {
    router.push('/entry/new' as never)
  }

  return (
    <LinearGradient
      colors={[colors.meal.bg, colors.cream[75], colors.cream.DEFAULT]}
      locations={[0, 0.3, 1]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {pet && <PetHeader pet={pet} />}

          <View style={{ paddingHorizontal: 16, paddingBottom: 32, gap: 24 }}>
            <CareSection
              logs={careLogs ?? []}
              onAdd={handleAddCare}
            />

            <DiaryPreview
              entry={todayEntry}
              onPressEntry={handlePressEntry}
              onPressMore={handlePressMore}
              onPressWrite={handlePressWrite}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}