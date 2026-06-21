/** 초대 코드 접두사. 코드는 PPNT-XXXX 형식. */
export const INVITE_CODE_PREFIX = 'PPNT-'

/**
 * 초대 코드 생성. PPNT-XXXX 형식 (영대문자 + 숫자 4자리).
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 혼동 문자 제외 (0/O, 1/I)
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${INVITE_CODE_PREFIX}${code}`
}