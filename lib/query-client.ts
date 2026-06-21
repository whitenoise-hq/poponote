import { QueryClient, focusManager } from '@tanstack/react-query'
import { AppState, type AppStateStatus } from 'react-native'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5분
      retry: 1,
    },
  },
})

// 앱이 백그라운드에 있다 포그라운드로 돌아오면 stale한 쿼리를 다시 불러온다.
// (RN에는 window focus가 없으므로 AppState를 focusManager에 연결)
AppState.addEventListener('change', (status: AppStateStatus) => {
  focusManager.setFocused(status === 'active')
})