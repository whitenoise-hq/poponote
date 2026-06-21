-- 초대 코드 검증 함수
-- 문제: families_select RLS는 owner 또는 기존 멤버만 조회 허용 →
--       초대받은 신규 사용자(아직 멤버 아님)는 invite_code로 family를 읽지 못해
--       "유효하지 않은 코드"로 떨어짐.
-- 해결: security definer로 RLS를 우회하되, 올바른 코드에 대해서만
--       가입에 필요한 최소 정보(family_id, pet 이름)만 반환한다.
--       (코드가 비밀 역할을 하므로 전체 family 열람/열거는 불가)
create or replace function public.verify_invite_code(_code text)
returns table (family_id uuid, pet_name text)
language sql
stable
security definer
as $$
  select
    f.id as family_id,
    coalesce(
      (select p.name from public.pets p where p.family_id = f.id limit 1),
      ''
    ) as pet_name
  from public.families f
  where f.invite_code = upper(trim(_code))
  limit 1;
$$;

grant execute on function public.verify_invite_code(text) to authenticated;