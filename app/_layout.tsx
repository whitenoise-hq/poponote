import { useEffect, useState, useCallback } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { Jua_400Regular } from '@expo-google-fonts/jua';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth } from '@/hooks/use-auth';
import { getUserFamily } from '@/lib/onboarding';

SplashScreen.preventAutoHideAsync();

function AuthGate({ fontsReady, onReady }: { fontsReady: boolean; onReady: () => void }) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const [familyChecked, setFamilyChecked] = useState(false)
  const [hasFamily, setHasFamily] = useState(false)
  const [routeDecided, setRouteDecided] = useState(false)

  // 로그인 후 가족 소속 확인
  useEffect(() => {
    if (!isLoggedIn || loading) {
      setFamilyChecked(false)
      return
    }

    getUserFamily().then((familyId) => {
      setHasFamily(!!familyId)
      setFamilyChecked(true)
    })
  }, [isLoggedIn, loading, segments])

  // 라우팅 가드
  useEffect(() => {
    if (!fontsReady || loading) return

    const inAuthGroup = segments[0] === '(auth)'
    const inOnboardingGroup = segments[0] === '(onboarding)'
    const inInviteResult = inOnboardingGroup && segments[1] === 'invite-result'

    if (!isLoggedIn) {
      if (!inAuthGroup && !inOnboardingGroup) {
        router.replace('/(auth)/login' as never)
      }
      if (!routeDecided) {
        setRouteDecided(true)
        onReady()
      }
    } else if (familyChecked) {
      if (!hasFamily && !inOnboardingGroup) {
        router.replace('/(onboarding)/choice' as never)
      } else if (hasFamily && (inAuthGroup || inOnboardingGroup) && !inInviteResult) {
        // invite-result에서는 코드 공유 후 사용자가 직접 "시작하기"를 누를 때까지 대기
        router.replace('/(tabs)' as never)
      }
      if (!routeDecided) {
        setRouteDecided(true)
        onReady()
      }
    }
  }, [isLoggedIn, loading, familyChecked, hasFamily, segments, fontsReady])

  return null
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    Jua_400Regular,
  });

  const fontsReady = fontsLoaded || !!fontError

  const handleReady = useCallback(() => {
    SplashScreen.hideAsync()
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate fontsReady={fontsReady} onReady={handleReady} />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}