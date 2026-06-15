/**
 * 조건부 className을 합치는 경량 유틸. clsx 의존성 없이 falsy 값을 걸러 공백으로 join.
 * 충돌 유틸리티(예: 같은 속성)는 dedupe하지 않으므로, 컴포넌트는
 * 기본 클래스 뒤에 사용자 className을 두어 추가(additive) 용도로 사용한다.
 */
export type ClassValue = string | number | null | false | undefined;

export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(' ');
}
