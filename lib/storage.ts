import { supabase } from './supabase'
import { compressImage, createThumbnail, compressProfileImage } from './image'

/**
 * 파일 URI → Blob 변환 (React Native에서 fetch로 처리)
 */
async function uriToBlob(uri: string): Promise<Blob> {
  const response = await fetch(uri)
  return response.blob()
}

/**
 * 프로필 사진 업로드.
 * 경로: profiles/{userId}/{timestamp}.jpg
 * 반환: public URL
 */
export async function uploadProfileImage(uri: string, userId: string): Promise<string> {
  const compressed = await compressProfileImage(uri)
  const blob = await uriToBlob(compressed.uri)
  const path = `${userId}/${Date.now()}.jpg`

  const { error } = await supabase.storage
    .from('profiles')
    .upload(path, blob, { contentType: 'image/jpeg', upsert: true })

  if (error) throw error

  const { data } = supabase.storage.from('profiles').getPublicUrl(path)
  return data.publicUrl
}

/**
 * 다이어리 사진 업로드 (압축본 + 썸네일).
 * 경로: photos/{familyId}/{timestamp}.jpg
 *       photos/{familyId}/{timestamp}_thumb.jpg
 * 반환: { photoUrl, thumbUrl }
 */
export async function uploadDiaryPhoto(
  uri: string,
  familyId: string,
): Promise<{ photoUrl: string; thumbUrl: string }> {
  const ts = Date.now()

  // 압축본
  const compressed = await compressImage(uri)
  const blob = await uriToBlob(compressed.uri)
  const photoPath = `${familyId}/${ts}.jpg`

  const { error: photoError } = await supabase.storage
    .from('photos')
    .upload(photoPath, blob, { contentType: 'image/jpeg' })

  if (photoError) throw photoError

  // 썸네일
  const thumb = await createThumbnail(uri)
  const thumbBlob = await uriToBlob(thumb.uri)
  const thumbPath = `${familyId}/${ts}_thumb.jpg`

  const { error: thumbError } = await supabase.storage
    .from('photos')
    .upload(thumbPath, thumbBlob, { contentType: 'image/jpeg' })

  if (thumbError) throw thumbError

  // signed URL (photos 버킷은 private)
  const { data: photoData } = await supabase.storage
    .from('photos')
    .createSignedUrl(photoPath, 60 * 60 * 24 * 365) // 1년

  const { data: thumbData } = await supabase.storage
    .from('photos')
    .createSignedUrl(thumbPath, 60 * 60 * 24 * 365)

  return {
    photoUrl: photoData?.signedUrl ?? '',
    thumbUrl: thumbData?.signedUrl ?? '',
  }
}