begin;

-- Athlete clients may create scheduled reminders, but delivery truth belongs to
-- the trusted dispatcher. Limit direct updates to the two in-app actions.
revoke update on table public.notification_reminders from authenticated;
grant update (status, dismissed_at, snoozed_until) on table public.notification_reminders to authenticated;

drop policy if exists "Athletes can update own notification reminders" on public.notification_reminders;
create policy "Athletes can dismiss or snooze own notification reminders"
on public.notification_reminders
for update
to authenticated
using ((select auth.uid()) = user_id)
with check (
  (select auth.uid()) = user_id
  and status in ('dismissed', 'snoozed')
  and sent_at is null
  and delivered_at is null
  and clicked_at is null
);

-- Supabase can retain explicit anon EXECUTE grants even when PUBLIC was
-- revoked. Reassert the intended callable roles for every privileged RPC used
-- by the private-alpha surface.
revoke all on function public.apply_program_change_proposal(uuid) from public, anon;
grant execute on function public.apply_program_change_proposal(uuid) to authenticated, service_role;

revoke all on function public.coach_can_access_athlete(uuid) from public, anon;
grant execute on function public.coach_can_access_athlete(uuid) to authenticated, service_role;

revoke all on function public.coach_create_assignment_invitation(uuid, timestamptz, text) from public, anon;
grant execute on function public.coach_create_assignment_invitation(uuid, timestamptz, text) to authenticated, service_role;

revoke all on function public.coach_accept_assignment_invitation(text) from public, anon;
grant execute on function public.coach_accept_assignment_invitation(text) to authenticated, service_role;

revoke all on function public.get_my_coach_relationship() from public, anon;
grant execute on function public.get_my_coach_relationship() to authenticated, service_role;

revoke all on function public.coach_update_own_profile(text, text, boolean, text, boolean) from public, anon;
grant execute on function public.coach_update_own_profile(text, text, boolean, text, boolean) to authenticated, service_role;

revoke all on function public.coach_mark_checkin_reviewed(uuid, text, text) from public, anon;
grant execute on function public.coach_mark_checkin_reviewed(uuid, text, text) to authenticated, service_role;

revoke all on function public.coach_decide_recommendation(uuid, text) from public, anon;
grant execute on function public.coach_decide_recommendation(uuid, text) to authenticated, service_role;

revoke all on function public.coach_decide_program_change_proposal(uuid, text) from public, anon;
grant execute on function public.coach_decide_program_change_proposal(uuid, text) to authenticated, service_role;

revoke all on function public.complete_workout_session(uuid, integer, text) from public, anon;
grant execute on function public.complete_workout_session(uuid, integer, text) to authenticated, service_role;

-- Trigger-only function: no API role needs direct execution.
revoke all on function public.handle_new_auth_user() from public, anon, authenticated;

commit;
