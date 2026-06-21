import { useState, useEffect } from 'react'
import { AppState } from 'react-native'

/** 로컬 기준 오늘 날짜 (YYYY-MM-DD) */
export function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/**
 * "오늘" 날짜를 반환하되, 앱이 포그라운드로 돌아올 때 날짜가 바뀌었으면 갱신한다.
 * 모듈 상수로 한 번만 계산하면 자정을 넘겨 앱을 재개했을 때 어제 날짜에 머무는 문제가 있어,
 * AppState 변화를 구독해 날짜 경계를 넘기면 값을 업데이트한다.
 */
export function useToday(): string {
  const [today, setToday] = useState(todayStr)

  useEffect(() => {
    const sub = AppState.addEventListener('change', (status) => {
      if (status === 'active') {
        const now = todayStr()
        setToday((prev) => (prev !== now ? now : prev))
      }
    })
    return () => sub.remove()
  }, [])

  return today
}