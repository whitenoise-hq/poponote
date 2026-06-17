import { supabase } from './supabase'
import { generateInviteCode } from './invite-code'

/**
 * 최초 사용자: 반려동물 등록 + 가족 그룹 생성 + 본인 멤버 등록
 * 반환: 생성된 초대 코드
 */
export async function createFamilyWithPet({
  petName,
  species,
  birthday,
  nickname,
  role = '보호자',
}: {
  petName: string
  species?: string
  birthday?: string
  nickname: string
  role?: string
}): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  const inviteCode = generateInviteCode()

  // 1. Family 생성
  const { data: family, error: familyError } = await supabase
    .from('families')
    .insert({ invite_code: inviteCode, owner_id: user.id })
    .select('id')
    .single()

  if (familyError) throw familyError

  // 2. 본인 멤버 등록
  const { error: memberError } = await supabase
    .from('members')
    .insert({
      family_id: family.id,
      user_id: user.id,
      nickname,
      role,
    })

  if (memberError) throw memberError

  // 3. Pet 생성
  const { error: petError } = await supabase
    .from('pets')
    .insert({
      family_id: family.id,
      name: petName,
      species: species || null,
      birthday: birthday || null,
    })

  if (petError) throw petError

  return inviteCode
}

/**
 * 초대받은 사용자: 코드 검증 → family_id 반환
 */
export async function verifyInviteCode(code: string): Promise<{ familyId: string; petName: string } | null> {
  const { data, error } = await supabase
    .from('families')
    .select('id')
    .eq('invite_code', code.trim().toUpperCase())
    .single()

  if (error || !data) return null

  // 해당 가족의 펫 이름도 가져오기
  const { data: pet } = await supabase
    .from('pets')
    .select('name')
    .eq('family_id', data.id)
    .limit(1)
    .single()

  return { familyId: data.id, petName: pet?.name ?? '' }
}

/**
 * 초대받은 사용자: 멤버 등록
 */
export async function joinFamily({
  familyId,
  nickname,
  role,
}: {
  familyId: string
  nickname: string
  role: string
}): Promise<void> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('로그인이 필요합니다')

  const { error } = await supabase
    .from('members')
    .insert({
      family_id: familyId,
      user_id: user.id,
      nickname,
      role,
    })

  if (error) throw error
}

/**
 * 현재 사용자가 소속된 family가 있는지 확인
 */
export async function getUserFamily(): Promise<string | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('members')
    .select('family_id')
    .eq('user_id', user.id)
    .limit(1)
    .single()

  return data?.family_id ?? null
}