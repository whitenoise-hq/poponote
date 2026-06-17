/**
 * 초대 코드 생성. POPO-XXXX 형식 (영대문자 + 숫자 4자리).
 */
export function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // 혼동 문자 제외 (0/O, 1/I)
  let code = ''
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return `POPO-${code}`
}