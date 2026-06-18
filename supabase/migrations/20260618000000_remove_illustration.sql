-- 일러스트 변환 기능 제거: illustration_url 컬럼 삭제 + illustrations 버킷 정리
-- AI 일기 작성 기능으로 대체됨

-- 1. diary_entries에서 illustration_url 컬럼 삭제
alter table public.diary_entries drop column if exists illustration_url;

-- 2. illustrations 버킷 정책 삭제
drop policy if exists "illustrations_upload" on storage.objects;
drop policy if exists "illustrations_select" on storage.objects;
drop policy if exists "illustrations_delete" on storage.objects;

-- 3. illustrations 버킷은 Supabase Dashboard > Storage에서 수동 삭제