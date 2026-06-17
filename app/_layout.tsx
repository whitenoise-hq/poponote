import { useEffect, useState } from 'react';
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

function AuthGate({ fontsReady }: { fontsReady: boolean }) {
  const { isLoggedIn, loading } = useAuth()
  const router = useRouter()
  const segments = useSegments()
  const [familyChecked, setFamilyChecked] = useState(false)
  const [hasFamily, setHasFamily] = useState(false)

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
  }, [isLoggedIn, loading])

  // 라우팅 가드
  useEffect(() => {
    if (!fontsReady || loading) return

    const inAuthGroup = segments[0] === '(auth)'
    const inOnboardingGroup = segments[0] === '(onboarding)'

    if (!isLoggedIn) {
      // 미인증 → 로그인 (온보딩 중이면 허용)
      if (!inAuthGroup && !inOnboardingGroup) {
        router.replace('/(auth)/login' as never)
      }
    } else if (familyChecked) {
      if (!hasFamily && !inOnboardingGroup) {
        // 인증 + 그룹 없음 → 온보딩
        router.replace('/(onboarding)/choice' as never)
      } else if (hasFamily && (inAuthGroup || inOnboardingGroup)) {
        // 인증 + 그룹 있음 → 홈
        router.replace('/(tabs)' as never)
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

  useEffect(() => {
    if (fontsReady) {
      SplashScreen.hideAsync();
    }
  }, [fontsReady]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGate fontsReady={fontsReady} />
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  );
}