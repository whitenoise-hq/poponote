import { type ReactNode } from 'react'
import { View, Pressable, Modal as RNModal, StyleSheet, type ViewStyle } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text } from './text'
import { colors } from '@/theme/colors'

interface ModalProps {
  visible: boolean
  onClose: () => void
  title?: string
  showClose?: boolean
  children: ReactNode
  style?: ViewStyle
}

/**
 * 공통 바텀시트/센터 모달. title + 닫기 버튼 + children.
 */
export function Modal({ visible, onClose, title, showClose = true, children, style }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={[styles.container, style]} onPress={(e) => e.stopPropagation()}>
          {/* Header */}
          <View style={styles.header}>
            {title ? (
              <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, flex: 1 }}>
                {title}
              </Text>
            ) : (
              <View style={{ flex: 1 }} />
            )}
            {showClose && (
              <Pressable onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={20} color={colors.ink[400]} />
              </Pressable>
            )}
          </View>

          {/* Content */}
          {children}
        </Pressable>
      </Pressable>
    </RNModal>
  )
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: colors.cream[100],
  },
})