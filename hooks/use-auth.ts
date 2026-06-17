import { useState, useEffect, useCallback } from 'react'
import { makeRedirectUri } from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { supabase } from '@/lib/supabase'
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
    })

    // 세션 변경 구독
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
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

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setSession(null)
  }, [])

  return {
    session,
    user: session?.user ?? null,
    loading,
    isLoggedIn: !!session,
    signInWithKakao,
    signOut,
  }
}