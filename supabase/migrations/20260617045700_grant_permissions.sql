-- authenticated 역할에 테이블 접근 권한 부여
-- (프로젝트 생성 시 "Automatically expose new tables" 비활성화 했으므로 수동 부여)

grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.families to authenticated;
grant select, insert, update, delete on public.members to authenticated;
grant select, insert, update, delete on public.pets to authenticated;
grant select, insert, update, delete on public.diary_entries to authenticated;
grant select, insert, update, delete on public.care_logs to authenticated;
grant select, insert, update, delete on public.comments to authenticated;
grant select, insert, update, delete on public.reactions to authenticated;