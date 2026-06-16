import type {
  Family,
  Member,
  Pet,
  DiaryEntry,
  CareLog,
  Comment,
  Reaction,
  CareKind,
} from '@/types'

// ── 현재 사용자 (엄마) ──
export const CURRENT_USER_ID = 'user-1'

// ── 오늘 날짜 ──
function todayStr(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
export const TODAY = todayStr()

// ── Family ──
export const mockFamily: Family = {
  id: 'fam-1',
  invite_code: 'POPO-7K2X',
  owner_id: CURRENT_USER_ID,
  created_at: '2026-03-01T09:00:00Z',
}

// ── Members ──
export const mockMembers: Member[] = [
  {
    id: 'mem-1',
    family_id: 'fam-1',
    user_id: 'user-1',
    nickname: '엄마',
    role: '보호자',
    avatar_emoji: '👩',
    joined_at: '2026-03-01T09:00:00Z',
  },
  {
    id: 'mem-2',
    family_id: 'fam-1',
    user_id: 'user-2',
    nickname: '아빠',
    role: '가족',
    avatar_emoji: '👨',
    joined_at: '2026-03-01T09:05:00Z',
  },
  {
    id: 'mem-3',
    family_id: 'fam-1',
    user_id: 'user-3',
    nickname: '유진',
    role: '가족',
    avatar_emoji: '👧',
    joined_at: '2026-03-15T14:00:00Z',
  },
]

// ── Pet ──
export const mockPet: Pet = {
  id: 'pet-1',
  family_id: 'fam-1',
  name: '포포',
  species: '골든 리트리버',
  birthday: '2023-03-14',
  adopted_at: '2023-06-01',
  profile_url:
    'https://images.unsplash.com/photo-1629740067905-bd3f515aa739?w=200&h=200&fit=crop&auto=format',
  weight: 28.5,
  sex: 'male',
  neutered: true,
}

// ── Diary Entries ──
export const mockDiaryEntries: DiaryEntry[] = [
  {
    id: 'entry-1',
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: TODAY,
    author_id: 'user-1',
    title: '산책 중에 발견한 민들레',
    body: '오늘 한강 산책 중에 포포가 민들레를 발견하고 한참 킁킁거렸어요. 바람이 살살 불고 너무 좋은 하루였다.',
    photo_url:
      'https://images.unsplash.com/photo-1530700131180-d43d9b8cc41f?w=800&h=600&fit=crop&auto=format',
    illustration_url:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format',
    created_at: `${TODAY}T19:24:00Z`,
    updated_at: `${TODAY}T19:24:00Z`,
  },
  {
    id: 'entry-2',
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: '2026-06-13',
    author_id: 'user-2',
    title: '새 장난감과 첫 만남',
    body: '포포에게 새 장난감을 줬더니 신나서 거실을 뛰어다녔어요. 삑삑 소리에 완전 흥분!',
    photo_url:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format',
    illustration_url:
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800&h=600&fit=crop&auto=format',
    created_at: '2026-06-13T20:15:00Z',
    updated_at: '2026-06-13T20:15:00Z',
  },
  {
    id: 'entry-3',
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: '2026-06-10',
    author_id: 'user-3',
    title: '포포의 목욕 시간',
    body: '오늘 포포 목욕시켰는데 물 튀기면서 난리가 났어요 ㅋㅋ 드라이어 소리에는 겁먹어서 품에 안겨있었어요.',
    photo_url:
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=600&fit=crop&auto=format',
    illustration_url:
      'https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?w=800&h=600&fit=crop&auto=format',
    created_at: '2026-06-10T21:00:00Z',
    updated_at: '2026-06-10T21:00:00Z',
  },
  {
    id: 'entry-4',
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: '2026-05-25',
    author_id: 'user-1',
    title: '동네 산책하다 친구 만남',
    body: '오늘 동네 산책 중 같은 종 골든 리트리버를 만났는데 둘이 금방 친해졌어요! 다음에 또 만나기로.',
    photo_url:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=600&fit=crop&auto=format',
    illustration_url:
      'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&h=600&fit=crop&auto=format',
    created_at: '2026-05-25T18:30:00Z',
    updated_at: '2026-05-25T18:30:00Z',
  },
  {
    id: 'entry-5',
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: '2026-04-12',
    author_id: 'user-2',
    title: '벚꽃 아래에서',
    body: '벚꽃 구경하러 나왔는데 포포가 꽃잎 날리는 거 보고 뛰어다녔어요. 진짜 그림 같은 장면이었다.',
    photo_url:
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop&auto=format',
    illustration_url:
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=800&h=600&fit=crop&auto=format',
    created_at: '2026-04-12T17:00:00Z',
    updated_at: '2026-04-12T17:00:00Z',
  },
]

// ── Care Logs ──
export const mockCareLogs: CareLog[] = [
  // 오늘
  { id: 'care-1', family_id: 'fam-1', pet_id: 'pet-1', date: TODAY, kind: 'meal', author_id: 'user-1', logged_at: `${TODAY}T08:12:00Z`, memo: null },
  { id: 'care-2', family_id: 'fam-1', pet_id: 'pet-1', date: TODAY, kind: 'meal', author_id: 'user-2', logged_at: `${TODAY}T13:20:00Z`, memo: null },
  { id: 'care-3', family_id: 'fam-1', pet_id: 'pet-1', date: TODAY, kind: 'treat', author_id: 'user-1', logged_at: `${TODAY}T15:00:00Z`, memo: '닭가슴살 트릿' },
  // 6/13
  { id: 'care-4', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-13', kind: 'meal', author_id: 'user-1', logged_at: '2026-06-13T08:00:00Z', memo: null },
  { id: 'care-5', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-13', kind: 'meal', author_id: 'user-2', logged_at: '2026-06-13T18:30:00Z', memo: null },
  { id: 'care-6', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-13', kind: 'walk', author_id: 'user-2', logged_at: '2026-06-13T19:00:00Z', memo: '공원 30분' },
  // 6/10
  { id: 'care-7', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-10', kind: 'meal', author_id: 'user-3', logged_at: '2026-06-10T08:30:00Z', memo: null },
  { id: 'care-8', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-10', kind: 'treat', author_id: 'user-3', logged_at: '2026-06-10T14:00:00Z', memo: '간식 스틱' },
  // 6/5 (케어만, 일기 없는 날)
  { id: 'care-9', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-05', kind: 'meal', author_id: 'user-1', logged_at: '2026-06-05T08:00:00Z', memo: null },
  { id: 'care-10', family_id: 'fam-1', pet_id: 'pet-1', date: '2026-06-05', kind: 'walk', author_id: 'user-1', logged_at: '2026-06-05T18:00:00Z', memo: '한강 1시간' },
]

// ── Comments ──
export const mockComments: Comment[] = [
  { id: 'cmt-1', entry_id: 'entry-1', author_id: 'user-2', body: '너무 귀엽다 ㅎㅎ', created_at: `${TODAY}T19:40:00Z` },
  { id: 'cmt-2', entry_id: 'entry-1', author_id: 'user-3', body: '산책 같이 갈걸!', created_at: `${TODAY}T20:05:00Z` },
  { id: 'cmt-3', entry_id: 'entry-2', author_id: 'user-1', body: '포포 완전 신났네 ㅋㅋ', created_at: '2026-06-13T20:30:00Z' },
]

// ── Reactions ──
export const mockReactions: Reaction[] = [
  { id: 'rxn-1', entry_id: 'entry-1', author_id: 'user-1', kind: 'heart' },
  { id: 'rxn-2', entry_id: 'entry-1', author_id: 'user-2', kind: 'heart' },
  { id: 'rxn-3', entry_id: 'entry-1', author_id: 'user-3', kind: 'heart' },
  { id: 'rxn-4', entry_id: 'entry-2', author_id: 'user-1', kind: 'heart' },
]

// ── Mutable copies (hooks에서 mutation용) ──
let _careLogs = [...mockCareLogs]
let _comments = [...mockComments]
let _reactions = [...mockReactions]
let _diaryEntries = [...mockDiaryEntries]

export function getCareLogs(): CareLog[] {
  return _careLogs
}

export function addCareLog(kind: CareKind, memo: string | null): CareLog {
  const now = new Date()
  const log: CareLog = {
    id: `care-${Date.now()}`,
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: TODAY,
    kind,
    author_id: CURRENT_USER_ID,
    logged_at: now.toISOString(),
    memo,
  }
  _careLogs = [..._careLogs, log]
  return log
}

export function getComments(): Comment[] {
  return _comments
}

export function addComment(entryId: string, body: string): Comment {
  const comment: Comment = {
    id: `cmt-${Date.now()}`,
    entry_id: entryId,
    author_id: CURRENT_USER_ID,
    body,
    created_at: new Date().toISOString(),
  }
  _comments = [..._comments, comment]
  return comment
}

export function deleteComment(commentId: string): void {
  _comments = _comments.filter((c) => c.id !== commentId)
}

export function getReactions(): Reaction[] {
  return _reactions
}

export function toggleReaction(entryId: string): Reaction | null {
  const existing = _reactions.find(
    (r) => r.entry_id === entryId && r.author_id === CURRENT_USER_ID,
  )
  if (existing) {
    _reactions = _reactions.filter((r) => r.id !== existing.id)
    return null
  }
  const reaction: Reaction = {
    id: `rxn-${Date.now()}`,
    entry_id: entryId,
    author_id: CURRENT_USER_ID,
    kind: 'heart',
  }
  _reactions = [..._reactions, reaction]
  return reaction
}

export function getDiaryEntries(): DiaryEntry[] {
  return _diaryEntries
}

export function addDiaryEntry(
  title: string | null,
  body: string,
  photoUrl: string | null,
): DiaryEntry {
  const entry: DiaryEntry = {
    id: `entry-${Date.now()}`,
    family_id: 'fam-1',
    pet_id: 'pet-1',
    date: TODAY,
    author_id: CURRENT_USER_ID,
    title,
    body,
    photo_url: photoUrl,
    illustration_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
  _diaryEntries = [..._diaryEntries, entry]
  return entry
}

// ── Helper: member nickname lookup ──
export function getMemberNickname(userId: string): string {
  return mockMembers.find((m) => m.user_id === userId)?.nickname ?? '알 수 없음'
}

export function getMember(userId: string): Member | undefined {
  return mockMembers.find((m) => m.user_id === userId)
}