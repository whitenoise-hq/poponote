import { File as ExpoFile } from 'expo-file-system'
import { supabase } from './supabase'
import { compressImage, compressProfileImage } from './image'

/**
 * 로컬 파일 URI → ArrayBuffer로 읽어서 업로드
 */
async function uploadFile(
  bucket: string,
  path: string,
  uri: string,
  contentType: string,
  upsert = false,
) {
  const file = new ExpoFile(uri)
  const arrayBuffer = await file.arrayBuffer()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, arrayBuffer, { contentType, upsert })

  if (error) {
    console.error('[Storage] upload error:', bucket, path, error)
    throw error
  }
}

/**
 * Storage에서 파일 삭제 (실패해도 무시)
 */
async function deleteFile(bucket: string, path: string) {
  await supabase.storage.from(bucket).remove([path]).catch(() => {})
}

/**
 * 프로필 사진 업로드.
 * 경로: profiles/{userId}/{timestamp}.jpg
 * 반환: public URL
 */
export async function uploadProfileImage(uri: string, userId: string): Promise<string> {
  const compressed = await compressProfileImage(uri)
  const path = `${userId}/${Date.now()}.jpg`

  await uploadFile('profiles', path, compressed.uri, 'image/jpeg', true)

  const { data } = supabase.storage.from('profiles').getPublicUrl(path)
  return data.publicUrl
}

/**
 * 다이어리 사진 업로드 (압축본만).
 * 경로: photos/{familyId}/{timestamp}.jpg
 * 반환: { photoUrl, storagePath } — storagePath는 실패 시 정리용
 */
export async function uploadDiaryPhoto(
  uri: string,
  familyId: string,
): Promise<{ photoUrl: string; storagePath: string }> {
  const ts = Date.now()
  const photoPath = `${familyId}/${ts}.jpg`

  const compressed = await compressImage(uri)
  await uploadFile('photos', photoPath, compressed.uri, 'image/jpeg')

  const { data: photoData } = await supabase.storage
    .from('photos')
    .createSignedUrl(photoPath, 60 * 60 * 24 * 365)

  return {
    photoUrl: photoData?.signedUrl ?? '',
    storagePath: photoPath,
  }
}

/**
 * 업로드된 다이어리 사진 삭제 (저장 실패 시 정리용)
 */
export async function deleteDiaryPhoto(storagePath: string) {
  await deleteFile('photos', storagePath)
}