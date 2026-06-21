-- Realtime 동기화: 가족 구성원의 변경을 다른 기기에 실시간 반영하기 위해
-- 관련 테이블을 supabase_realtime publication에 추가한다.
-- (클라이언트는 family_id 필터 또는 RLS로 자기 가족 이벤트만 수신)

-- supabase_realtime publication은 Supabase 클라우드에 기본 존재하지만,
-- 로컬/셀프호스트 대비 없으면 생성.
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

-- 각 테이블 추가 (재실행 멱등성 위해 duplicate 무시)
do $$ begin
  alter publication supabase_realtime add table public.diary_entries;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.care_logs;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.comments;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.reactions;
exception when duplicate_object then null; end $$;

do $$ begin
  alter publication supabase_realtime add table public.pets;
exception when duplicate_object then null; end $$;

-- comments/reactions는 family_id 컬럼이 없어 DELETE 시 entry_id로 정밀 무효화가 필요.
-- replica identity full이면 payload.old에 entry_id가 포함된다.
alter table public.comments replica identity full;
alter table public.reactions replica identity full;
