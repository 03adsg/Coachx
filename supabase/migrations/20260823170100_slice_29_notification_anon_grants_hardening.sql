begin;

-- RLS already denies anonymous rows, but remove unnecessary table privileges as
-- defense in depth and to keep the API surface aligned with the policy roles.
revoke insert, update, delete on table public.notification_reminders from anon;
revoke insert, update, delete on table public.push_subscriptions from anon;
revoke insert, update, delete on table public.notification_preferences from anon;
revoke insert, update, delete on table public.notification_delivery_attempts from anon;

commit;
