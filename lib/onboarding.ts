import { supabase } from './supabase'
import { generateInviteCode } from './invite-code'
import { uploadProfileImage } from './storage'

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
  profileImageUri,
}: {
  petName: string
  species?: string
  birthday?: string
  nickname: string
  role?: string
  profileImageUri?: string
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

  // 3. 프로필 이미지 업로드 (있으면)
  let profileUrl: string | null = null
  if (profileImageUri) {
    profileUrl = await uploadProfileImage(profileImageUri, user.id)
  }

  // 4. Pet 생성
  const { error: petError } = await supabase
    .from('pets')
    .insert({
      family_id: family.id,
      name: petName,
      species: species || null,
      birthday: birthday || null,
      profile_url: profileUrl,
    })

  if (petError) throw petError

  return inviteCode
}

/**
 * 초대받은 사용자: 코드 검증 → family_id 반환
 *
 * families RLS는 멤버/owner만 조회를 허용하므로, 아직 멤버가 아닌 초대 사용자는
 * 테이블을 직접 읽지 못한다. security definer 함수(verify_invite_code)로 우회한다.
 */
export async function verifyInviteCode(code: string): Promise<{ familyId: string; petName: string } | null> {
  const { data, error } = await supabase.rpc('verify_invite_code', { _code: code })

  if (error || !data || data.length === 0) return null

  const row = data[0] as { family_id: string; pet_name: string | null }
  return { familyId: row.family_id, petName: row.pet_name ?? '' }
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