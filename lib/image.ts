import { manipulateAsync, SaveFormat } from 'expo-image-manipulator'

interface CompressResult {
  uri: string
  width: number
  height: number
}

/**
 * 이미지 압축: 가로 최대 1440px 리사이즈 + JPEG 80% 품질.
 * (WebP는 expo-image-manipulator에서 지원하지 않아 JPEG 사용)
 */
export async function compressImage(uri: string, maxWidth = 1440): Promise<CompressResult> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: 0.8, format: SaveFormat.JPEG },
  )
  return { uri: result.uri, width: result.width, height: result.height }
}

/**
 * 썸네일 생성: 가로 300px 리사이즈 + JPEG 70% 품질.
 */
export async function createThumbnail(uri: string): Promise<CompressResult> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 300 } }],
    { compress: 0.7, format: SaveFormat.JPEG },
  )
  return { uri: result.uri, width: result.width, height: result.height }
}

/**
 * 프로필 이미지 압축: 가로 512px + JPEG 80%.
 */
export async function compressProfileImage(uri: string): Promise<CompressResult> {
  const result = await manipulateAsync(
    uri,
    [{ resize: { width: 512 } }],
    { compress: 0.8, format: SaveFormat.JPEG },
  )
  return { uri: result.uri, width: result.width, height: result.height }
}