import { useEffect, useState, useMemo } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import { Jua_400Regular } from '@expo-google-fonts/jua';
import { useFonts } from 'expo-font';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { AuthContext } from '@/lib/auth-store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
    Jua_400Regular,
  });

  const [isLoggedIn, setIsLoggedIn] = useState(true) // mock: 기본 로그인 상태
  const router = useRouter()
  const segments = useSegments()

  const auth = useMemo(() => ({
    isLoggedIn,
    login: () => setIsLoggedIn(true),
    logout: () => setIsLoggedIn(false),
  }), [isLoggedIn])

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // 인증 라우팅 가드
  useEffect(() => {
    if (!fontsLoaded && !fontError) return

    const inAuthGroup = segments[0] === '(auth)'
    const inOnboardingGroup = segments[0] === '(onboarding)'

    if (!isLoggedIn && !inAuthGroup && !inOnboardingGroup) {
      router.replace('/(auth)/login' as never)
    } else if (isLoggedIn && (inAuthGroup || inOnboardingGroup)) {
      router.replace('/(tabs)' as never)
    }
  }, [isLoggedIn, segments, fontsLoaded, fontError])

  return (
    <AuthContext.Provider value={auth}>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }} />
      </QueryClientProvider>
    </AuthContext.Provider>
  );
}