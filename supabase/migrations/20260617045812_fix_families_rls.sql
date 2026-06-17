-- families SELECT: 멤버이거나 owner인 경우 허용
-- (가족 생성 직후 아직 멤버 등록 전에도 owner가 조회 가능해야 함)
drop policy "families_select" on public.families;
create policy "families_select" on public.families
  for select using (
    owner_id = auth.uid() or public.is_family_member(id)
  );