-- ============================================================
-- Storage 버킷 생성 + RLS 정책
-- profiles: 프로필 사진
-- photos: 다이어리 사진 (압축본)
-- illustrations: 일러스트 변환본
-- ============================================================

-- 버킷 생성
insert into storage.buckets (id, name, public)
values
  ('profiles', 'profiles', true),
  ('photos', 'photos', false),
  ('illustrations', 'illustrations', false);

-- ============================================================
-- profiles 버킷: 인증된 사용자 업로드, 공개 읽기
-- ============================================================
create policy "profiles_upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'profiles');

create policy "profiles_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'profiles' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "profiles_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'profiles' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "profiles_select" on storage.objects
  for select to public
  using (bucket_id = 'profiles');

-- ============================================================
-- photos 버킷: 같은 family 멤버만 접근
-- 파일 경로 규칙: {family_id}/{filename}
-- ============================================================
create policy "photos_upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'photos'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "photos_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'photos'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "photos_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'photos'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );

-- ============================================================
-- illustrations 버킷: 같은 family 멤버만 접근
-- 파일 경로 규칙: {family_id}/{filename}
-- ============================================================
create policy "illustrations_upload" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'illustrations'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "illustrations_select" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'illustrations'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );

create policy "illustrations_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'illustrations'
    and public.is_family_member((storage.foldername(name))[1]::uuid)
  );