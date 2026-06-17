-- 회원 탈퇴 함수: 본인이 owner인 family 전체 삭제 (cascade) + 멤버 탈퇴
-- security definer로 RLS 우회하여 관련 데이터 정리
create or replace function public.delete_account()
returns void
language plpgsql
security definer
as $$
declare
  _uid uuid := auth.uid();
begin
  -- 1. 본인이 owner인 family 삭제 (cascade로 members, pets, diary_entries, care_logs, comments, reactions 삭제)
  delete from public.families where owner_id = _uid;

  -- 2. 다른 가족의 멤버인 경우 멤버 레코드만 삭제
  delete from public.members where user_id = _uid;
end;
$$;

-- authenticated 역할에 실행 권한 부여
grant execute on function public.delete_account() to authenticated;