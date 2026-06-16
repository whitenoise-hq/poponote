// 포포노트 공용 타입 — planning.md 7 + 스키마 변경 메모 기준

export type CareKind = 'meal' | 'treat' | 'walk'

export type ReactionKind = 'heart'

export interface Family {
  id: string
  invite_code: string
  owner_id: string
  created_at: string
}

export interface Member {
  id: string
  family_id: string
  user_id: string
  nickname: string
  role: string
  avatar_emoji: string
  joined_at: string
}

export interface Pet {
  id: string
  family_id: string
  name: string
  species: string | null
  birthday: string | null
  adopted_at: string | null
  profile_url: string | null
  weight: number | null
  sex: 'male' | 'female' | null
  neutered: boolean | null
}

export interface DiaryEntry {
  id: string
  family_id: string
  pet_id: string
  date: string // YYYY-MM-DD
  author_id: string
  title: string | null
  body: string
  photo_url: string | null
  illustration_url: string | null
  created_at: string
  updated_at: string
}

export interface CareLog {
  id: string
  family_id: string
  pet_id: string
  date: string // YYYY-MM-DD
  kind: CareKind
  author_id: string
  logged_at: string // ISO datetime
  memo: string | null
}

export interface Comment {
  id: string
  entry_id: string
  author_id: string
  body: string
  created_at: string
}

export interface Reaction {
  id: string
  entry_id: string
  author_id: string
  kind: ReactionKind
}