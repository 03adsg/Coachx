create extension if not exists pg_cron;

select cron.schedule(
  'dispatch-notification-reminders-global',
  '*/2 * * * *',
  $cron$
  select net.http_post(
    url := 'https://zlblnezbbiimapruazvc.supabase.co/functions/v1/dispatch-notification-reminders',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'apikey', (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'athlexforce_automations_secret_key'
        limit 1
      )
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 30000
  );
  $cron$
);
