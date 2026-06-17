import { View, Pressable, Modal as RNModal, StyleSheet } from 'react-native'
import { Text } from './text'
import { colors } from '@/theme/colors'

interface AlertModalProps {
  visible: boolean
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  /** true이면 확인 버튼이 빨간색(위험 동작) */
  destructive?: boolean
  onConfirm: () => void
  /** 없으면 취소 버튼 숨김 (확인만 있는 모달) */
  onCancel?: () => void
}

/**
 * Alert.alert 대체 공통 모달.
 * - onCancel이 있으면 확인+취소 2버튼
 * - onCancel이 없으면 확인만 1버튼
 */
export function AlertModal({
  visible,
  title,
  message,
  confirmLabel = '확인',
  cancelLabel = '취소',
  destructive = false,
  onConfirm,
  onCancel,
}: AlertModalProps) {
  const hasCancel = onCancel != null

  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel ?? onConfirm}
    >
      <View style={styles.backdrop}>
        <View style={styles.container}>
          <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, textAlign: 'center' }}>
            {title}
          </Text>

          {message ? (
            <Text variant="body" style={{ color: colors.ink[500], textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
              {message}
            </Text>
          ) : null}

          <View style={[styles.buttons, !hasCancel && styles.singleButton]}>
            {hasCancel && (
              <Pressable onPress={onCancel} style={[styles.button, styles.cancelButton]}>
                <Text variant="label" style={{ color: colors.ink[500] }}>{cancelLabel}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={onConfirm}
              style={[
                styles.button,
                styles.confirmButton,
                destructive && styles.destructiveButton,
              ]}
            >
              <Text
                variant="label"
                style={{ color: destructive ? colors.white : colors.white }}
              >
                {confirmLabel}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
  singleButton: {
    justifyContent: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 12,
  },
  cancelButton: {
    backgroundColor: colors.cream[100],
    borderWidth: 1,
    borderColor: colors.cream[200],
  },
  confirmButton: {
    backgroundColor: colors.primary.DEFAULT,
  },
  destructiveButton: {
    backgroundColor: colors.danger,
  },
})