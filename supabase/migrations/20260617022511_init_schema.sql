-- ============================================================
-- 포포노트 초기 스키마 · P2
-- planning.md 7 + 스키마 변경 메모 반영
-- 순서: 테이블 → 함수 → RLS → 인덱스
-- ============================================================

-- ============================================================
-- 1. 테이블 생성
-- ============================================================

create table public.families (
  id          uuid primary key default gen_random_uuid(),
  invite_code text not null unique,
  owner_id    uuid not null references auth.users(id),
  created_at  timestamptz not null default now()
);

create table public.members (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  user_id     uuid not null references auth.users(id),
  nickname    text not null,
  role        text not null default '가족',
  avatar_emoji text not null default '🐾',
  joined_at   timestamptz not null default now(),
  unique (family_id, user_id)
);

create table public.pets (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  name        text not null,
  species     text,
  birthday    date,
  adopted_at  date,
  profile_url text,
  weight      numeric,
  sex         text check (sex in ('male', 'female')),
  neutered    boolean default false
);

create table public.diary_entries (
  id                uuid primary key default gen_random_uuid(),
  family_id         uuid not null references public.families(id) on delete cascade,
  pet_id            uuid not null references public.pets(id) on delete cascade,
  date              date not null,
  author_id         uuid not null references auth.users(id),
  title             text,
  body              text not null,
  photo_url         text,
  illustration_url  text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now(),
  unique (family_id, pet_id, date)  -- 하루 1개 제약
);

create table public.care_logs (
  id          uuid primary key default gen_random_uuid(),
  family_id   uuid not null references public.families(id) on delete cascade,
  pet_id      uuid not null references public.pets(id) on delete cascade,
  date        date not null,
  kind        text not null check (kind in ('meal', 'treat', 'walk')),
  author_id   uuid not null references auth.users(id),
  logged_at   timestamptz not null default now(),
  memo        text
);

create table public.comments (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references public.diary_entries(id) on delete cascade,
  author_id   uuid not null references auth.users(id),
  body        text not null,
  created_at  timestamptz not null default now()
);

create table public.reactions (
  id          uuid primary key default gen_random_uuid(),
  entry_id    uuid not null references public.diary_entries(id) on delete cascade,
  author_id   uuid not null references auth.users(id),
  kind        text not null default 'heart',
  unique (entry_id, author_id, kind)
);

-- ============================================================
-- 2. Helper function (members 테이블 생성 후)
-- ============================================================

create or replace function public.is_family_member(_family_id uuid)
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.members
    where family_id = _family_id
      and user_id = auth.uid()
  );
$$;

-- ============================================================
-- 3. RLS 활성화 + 정책
-- ============================================================

-- families
alter table public.families enable row level security;
create policy "families_select" on public.families for select using (public.is_family_member(id));
create policy "families_insert" on public.families for insert with check (owner_id = auth.uid());
create policy "families_update" on public.families for update using (owner_id = auth.uid());

-- members
alter table public.members enable row level security;
create policy "members_select" on public.members for select using (public.is_family_member(family_id));
create policy "members_insert" on public.members for insert with check (user_id = auth.uid());
create policy "members_update" on public.members for update using (user_id = auth.uid());
create policy "members_delete" on public.members for delete using (user_id = auth.uid());

-- pets
alter table public.pets enable row level security;
create policy "pets_select" on public.pets for select using (public.is_family_member(family_id));
create policy "pets_insert" on public.pets for insert with check (public.is_family_member(family_id));
create policy "pets_update" on public.pets for update using (public.is_family_member(family_id));

-- diary_entries
alter table public.diary_entries enable row level security;
create policy "diary_entries_select" on public.diary_entries for select using (public.is_family_member(family_id));
create policy "diary_entries_insert" on public.diary_entries for insert with check (author_id = auth.uid() and public.is_family_member(family_id));
create policy "diary_entries_update" on public.diary_entries for update using (author_id = auth.uid());
create policy "diary_entries_delete" on public.diary_entries for delete using (author_id = auth.uid());

-- care_logs
alter table public.care_logs enable row level security;
create policy "care_logs_select" on public.care_logs for select using (public.is_family_member(family_id));
create policy "care_logs_insert" on public.care_logs for insert with check (author_id = auth.uid() and public.is_family_member(family_id));
create policy "care_logs_update" on public.care_logs for update using (author_id = auth.uid());
create policy "care_logs_delete" on public.care_logs for delete using (author_id = auth.uid());

-- comments (entry → diary_entries → family 경유)
alter table public.comments enable row level security;
create policy "comments_select" on public.comments for select using (
  exists (select 1 from public.diary_entries e where e.id = entry_id and public.is_family_member(e.family_id))
);
create policy "comments_insert" on public.comments for insert with check (
  author_id = auth.uid() and exists (select 1 from public.diary_entries e where e.id = entry_id and public.is_family_member(e.family_id))
);
create policy "comments_update" on public.comments for update using (author_id = auth.uid());
create policy "comments_delete" on public.comments for delete using (author_id = auth.uid());

-- reactions
alter table public.reactions enable row level security;
create policy "reactions_select" on public.reactions for select using (
  exists (select 1 from public.diary_entries e where e.id = entry_id and public.is_family_member(e.family_id))
);
create policy "reactions_insert" on public.reactions for insert with check (
  author_id = auth.uid() and exists (select 1 from public.diary_entries e where e.id = entry_id and public.is_family_member(e.family_id))
);
create policy "reactions_delete" on public.reactions for delete using (author_id = auth.uid());

-- ============================================================
-- 4. 인덱스
-- ============================================================
create index idx_members_family on public.members(family_id);
create index idx_members_user on public.members(user_id);
create index idx_pets_family on public.pets(family_id);
create index idx_diary_entries_family_date on public.diary_entries(family_id, date);
create index idx_diary_entries_pet_date on public.diary_entries(pet_id, date);
create index idx_care_logs_family_date on public.care_logs(family_id, date);
create index idx_care_logs_pet_date on public.care_logs(pet_id, date);
create index idx_comments_entry on public.comments(entry_id);
create index idx_reactions_entry on public.reactions(entry_id);