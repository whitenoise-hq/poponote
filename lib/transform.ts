import { supabase } from './supabase'

interface TransformResult {
  illustrationUrl: string
  illustrationPath: string
}

/**
 * 사진 → 일러스트 변환.
 */
export async function transformToIllustration({
  photoUrl,
  familyId,
  entryId,
}: {
  photoUrl: string
  familyId: string
  entryId?: string
}): Promise<TransformResult> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('로그인 필요')

  const response = await supabase.functions.invoke('transform-image', {
    body: { photoUrl, familyId, entryId },
  })

  if (response.error) {
    throw new Error(response.error.message ?? '일러스트 변환 실패')
  }

  return {
    illustrationUrl: response.data?.illustrationUrl ?? '',
    illustrationPath: response.data?.illustrationPath ?? '',
  }
}

/**
 * 일러스트 삭제 (롤백용)
 */
export async function deleteIllustration(path: string) {
  await supabase.storage.from('illustrations').remove([path]).catch(() => {})
}