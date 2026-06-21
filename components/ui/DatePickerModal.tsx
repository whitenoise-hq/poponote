import { useState } from 'react'
import { View, Pressable, Modal as RNModal, StyleSheet, Platform } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Text } from './text'
import { colors } from '@/theme/colors'

interface DatePickerModalProps {
  visible: boolean
  value: Date
  onConfirm: (date: Date) => void
  onCancel: () => void
  maximumDate?: Date
  minimumDate?: Date
}

export function DatePickerModal({
  visible,
  value,
  onConfirm,
  onCancel,
  maximumDate,
  minimumDate,
}: DatePickerModalProps) {
  const [tempDate, setTempDate] = useState(value)

  function handleChange(_: unknown, date?: Date) {
    if (date) setTempDate(date)
  }

  function handleConfirm() {
    onConfirm(tempDate)
  }

  return (
    <RNModal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={styles.backdrop} onPress={onCancel}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Pressable onPress={onCancel}>
              <Text variant="label" style={{ color: colors.ink[400] }}>취소</Text>
            </Pressable>
            <Text variant="subtitle" style={{ color: colors.ink.DEFAULT }}>날짜 선택</Text>
            <Pressable onPress={handleConfirm}>
              <Text variant="label" style={{ color: colors.primary.DEFAULT }}>확인</Text>
            </Pressable>
          </View>

          <View style={{ alignItems: 'center', paddingHorizontal: 20 }}>
            <DateTimePicker
              value={tempDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleChange}
              maximumDate={maximumDate}
              minimumDate={minimumDate}
              locale="ko-KR"
              // 모달 배경이 항상 흰색이므로, 다크 모드에서 숫자가 흰색으로 렌더링돼
              // 안 보이는 문제를 막기 위해 라이트 테마로 고정 (iOS 전용 prop)
              themeVariant="light"
              textColor={colors.ink.DEFAULT}
              style={{ height: 200 }}
            />
          </View>
        </View>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.cream[200],
  },
})