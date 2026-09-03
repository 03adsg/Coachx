create policy "Athletes can insert own scheduled notification reminders"
on public.notification_reminders
for insert
to authenticated
with check (
  (select auth.uid()) = user_id
  and status = 'scheduled'
  and sent_at is null
  and delivered_at is null
  and clicked_at is null
  and dismissed_at is null
  and snoozed_until is null
);
