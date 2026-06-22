import { useState, useEffect, useCallback } from 'react'
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import * as AppleAuthentication from 'expo-apple-authentication'
import { supabase } from '@/lib/supabase'
import { queryClient } from '@/lib/query-client'
import type { Session } from '@supabase/supabase-js'

WebBrowser.maybeCompleteAuthSession()

const redirectUri = makeRedirectUri({ scheme: 'poponote' })

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 초기 세션 확인
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s)
      setLoading(false)
      // Realtime 소켓에 사용자 JWT 주입 (RLS 적용된 Postgres Changes 수신에 필수)
      supabase.realtime.setAuth(s?.access_token ?? null)
    })

    // 세션 변경 구독 (로그인/로그아웃 + TOKEN_REFRESHED 포함)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      // 토큰 갱신 시에도 다시 설정해 realtime이 만료 토큰으로 끊기지 않게 함
      supabase.realtime.setAuth(s?.access_token ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signInWithKakao = useCallback(async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: {
        redirectTo: redirectUri,
        skipBrowserRedirect: true,
      },
    })

    if (error) throw error
    if (data.url) {
      const result = await WebBrowser.openAuthSessionAsync(data.url, redirectUri)
      if (result.type === 'success' && result.url) {
        // URL에서 토큰 추출하여 세션 설정
        const url = new URL(result.url)
        const params = new URLSearchParams(url.hash.substring(1)) // #access_token=...
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')

        if (accessToken && refreshToken) {
          await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        }
      }
    }
  }, [])

  const signInWithApple = useCallback(async () => {
    // 네이티브 Apple 로그인: identityToken을 받아 Supabase에 넘겨 검증·세션 발급
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    })

    if (!credential.identityToken) {
      throw new Error('Apple 로그인에서 identityToken을 받지 못했습니다.')
    }

    const { error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    })

    if (error) throw error
  }, [])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
    // 이전 사용자의 데이터가 메모리 캐시에 남아 재로그인 시 노출되는 것을 방지
    // (앱 재시작 없이도 새 세션이 모든 쿼리를 다시 불러오도록)
    queryClient.clear()
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
    isLoggedIn: !!session,
    signInWithKakao,
    signInWithApple,
    signOut,
  }
}