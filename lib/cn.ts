import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 조건부 className을 합치고 충돌 유틸리티를 정리한다(뒤에 온 클래스가 이김).
 * clsx로 falsy를 거르고, tailwind-merge로 같은 속성 충돌(p-4 vs p-2 등)을 dedupe한다.
 * 덕분에 컴포넌트 기본 클래스를 호출부 className으로 안전하게 오버라이드할 수 있다.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}