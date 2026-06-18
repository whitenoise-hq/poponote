import { supabase } from './supabase'

interface GenerateDiaryResult {
  title: string
  body: string
}

/**
 * 사진 URL을 AI에 전달해 일기 제목+내용을 생성한다.
 */
export async function generateDiary(photoUrl: string, petName?: string): Promise<GenerateDiaryResult> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('로그인 필요')

  const response = await supabase.functions.invoke('generate-diary', {
    body: { photoUrl, petName },
  })

  if (response.error) {
    throw new Error(response.error.message ?? 'AI 일기 생성 실패')
  }

  const { title, body } = response.data ?? {}
  if (!title || !body) {
    throw new Error('AI 응답이 올바르지 않습니다')
  }

  return { title, body }
}