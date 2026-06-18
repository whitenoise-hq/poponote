import { useState } from 'react'
import { View, Pressable, TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Text, Card, Modal, AlertModal } from '@/components/ui'
import { colors } from '@/theme/colors'
import { useAuth } from '@/hooks/use-auth'
import { useUpdateNickname } from '@/hooks/use-current-user'
import type { Member } from '@/types'

interface MemberListProps {
  members: Member[]
}

export function MemberList({ members }: MemberListProps) {
  const { user } = useAuth()
  const updateNickname = useUpdateNickname()

  const [editVisible, setEditVisible] = useState(false)
  const [editMemberId, setEditMemberId] = useState('')
  const [editValue, setEditValue] = useState('')
  const [successVisible, setSuccessVisible] = useState(false)

  function handleEditOpen(member: Member) {
    setEditMemberId(member.id)
    setEditValue(member.nickname)
    setEditVisible(true)
  }

  function handleEditSave() {
    if (!editValue.trim()) return
    updateNickname.mutate(
      { memberId: editMemberId, nickname: editValue.trim() },
      {
        onSuccess: () => {
          setEditVisible(false)
          setSuccessVisible(true)
        },
      },
    )
  }

  return (
    <>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {members.map((member, i) => {
          const isMe = member.user_id === user?.id
          const isLast = i === members.length - 1
          return (
            <Pressable
              key={member.id}
              onPress={isMe ? () => handleEditOpen(member) : undefined}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: isLast ? 0 : 1,
                borderBottomColor: colors.cream[200],
              }}
            >
              <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="person" size={20} color={colors.primary.DEFAULT} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="body" style={{ color: colors.ink.DEFAULT }}>
                  {member.nickname}
                </Text>
                <Text variant="caption" style={{ color: colors.muted.foreground }}>
                  {member.role}
                </Text>
              </View>
              {isMe ? (
                <View style={{ backgroundColor: colors.primary.DEFAULT + '18', borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text variant="caption" style={{ color: colors.primary.DEFAULT, fontSize: 11 }}>
                    나
                  </Text>
                </View>
              ) : (
                <View style={{ backgroundColor: colors.cream[100], borderRadius: 99, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text variant="caption" style={{ color: colors.muted.foreground, fontSize: 11 }}>
                    멤버
                  </Text>
                </View>
              )}
            </Pressable>
          )
        })}
      </Card>

      <Modal visible={editVisible} onClose={() => setEditVisible(false)} showClose={false}>
        <Text variant="subtitle" style={{ color: colors.ink.DEFAULT, marginBottom: 16 }}>
          닉네임 변경
        </Text>
        <TextInput
          value={editValue}
          onChangeText={setEditValue}
          placeholder="닉네임"
          placeholderTextColor={colors.muted.foreground}
          autoFocus
          style={{
            height: 48,
            paddingHorizontal: 14,
            backgroundColor: colors.cream[100],
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.cream[200],
            fontSize: 15,
            color: colors.ink.DEFAULT,
          }}
        />
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
          <Pressable
            onPress={() => setEditVisible(false)}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: colors.cream[200], alignItems: 'center' }}
          >
            <Text variant="label" style={{ color: colors.muted.foreground }}>취소</Text>
          </Pressable>
          <Pressable
            onPress={handleEditSave}
            disabled={!editValue.trim() || updateNickname.isPending}
            style={{ flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: colors.primary.DEFAULT, alignItems: 'center', opacity: editValue.trim() ? 1 : 0.4 }}
          >
            <Text variant="label" style={{ color: colors.white }}>저장</Text>
          </Pressable>
        </View>
      </Modal>

      <AlertModal
        visible={successVisible}
        title="변경 완료"
        message="닉네임이 변경되었습니다."
        onConfirm={() => setSuccessVisible(false)}
      />
    </>
  )
}