import { withSupabase } from "npm:@supabase/server@^1";
import { buildPushHTTPRequest } from "npm:@pushforge/builder";
import {
  coerceQuietHours,
  getNotificationCategoryLabels,
  resolveQuietHoursActive,
  type NotificationCategoryId
} from "../../../lib/notification-system";

type ReminderRow = {
  id: string;
  user_id: string;
  category: NotificationCategoryId;
  destination_path: string;
  title: string;
  body: string;
  status: string;
  scheduled_for: string;
  sent_at: string | null;
  delivered_at: string | null;
  dismissed_at: string | null;
  snoozed_until: string | null;
  dedupe_key: string;
  payload: Record<string, unknown> | null;
};

type PreferenceRow = {
  user_id: string;
  master_enabled: boolean;
  workout_enabled: boolean;
  meals_enabled: boolean;
  hydration_enabled: boolean;
  supplements_enabled: boolean;
  checkin_enabled: boolean;
  sleep_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_start: string | null;
  quiet_end: string | null;
  timezone: string | null;
  in_app_enabled: boolean;
};

type SubscriptionRow = {
  id: string;
  user_id: string;
  endpoint: string;
  p256dh: string;
  auth: string;
  expiration_time: string | null;
  active: boolean;
  failure_count: number;
};

function isDueReminder(reminder: ReminderRow, now: Date) {
  if (reminder.status === "dismissed" || reminder.status === "clicked" || reminder.status === "cancelled" || reminder.status === "expired") {
    return false;
  }

  if (reminder.snoozed_until && new Date(reminder.snoozed_until) > now) {
    return false;
  }

  return new Date(reminder.scheduled_for) <= now;
}

function categoryEnabledForReminder(row: PreferenceRow, category: NotificationCategoryId) {
  return category === "workout"
    ? row.workout_enabled
    : category === "meals"
      ? row.meals_enabled
      : category === "hydration"
        ? row.hydration_enabled
        : category === "supplements"
          ? row.supplements_enabled
          : category === "check-in"
            ? row.checkin_enabled
            : row.sleep_enabled;
}

function pushPayload(reminder: ReminderRow, destinationPath: string) {
  const categoryLabel = getNotificationCategoryLabels("en")[reminder.category]?.label ?? reminder.category;
  return {
    title: reminder.title || "AthlexForce",
    body: reminder.body || "Reminder ready.",
    destinationPath,
    category: reminder.category,
    tag: reminder.dedupe_key,
    reminderId: reminder.id,
    titleLabel: categoryLabel
  };
}

async function sendPush(subscription: SubscriptionRow, reminder: ReminderRow, destinationPath: string, vapidPrivateKey: string, vapidSubject: string) {
  const privateJwk = JSON.parse(vapidPrivateKey) as JsonWebKey;
  const { endpoint, headers, body } = await buildPushHTTPRequest({
    privateJWK: privateJwk,
    subscription: {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.p256dh,
        auth: subscription.auth
      },
      expirationTime: subscription.expiration_time ? Date.parse(subscription.expiration_time) : undefined
    },
    message: {
      payload: pushPayload(reminder, destinationPath),
      adminContact: vapidSubject
    }
  });

  return fetch(endpoint, {
    method: "POST",
    headers,
    body
  });
}

export default {
  fetch: withSupabase({ auth: "secret" }, async (_req, ctx) => {
    const now = new Date();
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY")?.trim() ?? "";
    const vapidSubject = Deno.env.get("VAPID_SUBJECT")?.trim() ?? "mailto:support@athlexforce.app";

    if (!vapidPrivateKey) {
      return Response.json({ ok: false, error: "Missing VAPID_PRIVATE_KEY" }, { status: 500 });
    }

    const [remindersResult, preferencesResult, subscriptionsResult] = await Promise.all([
      ctx.supabaseAdmin.from("notification_reminders").select("*").in("status", ["scheduled", "ready", "snoozed"]),
      ctx.supabaseAdmin.from("notification_preferences").select("*"),
      ctx.supabaseAdmin.from("push_subscriptions").select("*").eq("active", true)
    ]);

    if (remindersResult.error) {
      return Response.json({ ok: false, error: remindersResult.error.message }, { status: 500 });
    }

    if (preferencesResult.error) {
      return Response.json({ ok: false, error: preferencesResult.error.message }, { status: 500 });
    }

    if (subscriptionsResult.error) {
      return Response.json({ ok: false, error: subscriptionsResult.error.message }, { status: 500 });
    }

    const reminders = ((remindersResult.data ?? []) as ReminderRow[]).filter((reminder) => isDueReminder(reminder, now));
    const preferences = (preferencesResult.data ?? []) as PreferenceRow[];
    const subscriptions = (subscriptionsResult.data ?? []) as SubscriptionRow[];

    const byUserPreferences = new Map(preferences.map((row) => [row.user_id, row]));
    const byUserSubscriptions = new Map<string, SubscriptionRow[]>();
    for (const subscription of subscriptions) {
      const list = byUserSubscriptions.get(subscription.user_id) ?? [];
      list.push(subscription);
      byUserSubscriptions.set(subscription.user_id, list);
    }

    let sent = 0;
    let skipped = 0;
    let failures = 0;

    for (const reminder of reminders) {
      const preferenceRow = byUserPreferences.get(reminder.user_id);
      if (!preferenceRow || !preferenceRow.master_enabled || !categoryEnabledForReminder(preferenceRow, reminder.category)) {
        skipped += 1;
        continue;
      }

      const quietHours = coerceQuietHours(
        {
          enabled: preferenceRow.quiet_hours_enabled,
          start: preferenceRow.quiet_start ?? "22:00",
          end: preferenceRow.quiet_end ?? "07:00",
          timezone: preferenceRow.timezone ?? "Device local"
        },
        {
          enabled: true,
          start: "22:00",
          end: "07:00",
          timezone: "Device local"
        }
      );

      if (resolveQuietHoursActive(now, quietHours)) {
        skipped += 1;
        continue;
      }

      const userSubscriptions = byUserSubscriptions.get(reminder.user_id) ?? [];
      if (userSubscriptions.length === 0 || !preferenceRow.in_app_enabled) {
        skipped += 1;
        continue;
      }

      const destinationPath = reminder.destination_path.startsWith("/") ? reminder.destination_path : "/";
      const payload = pushPayload(reminder, destinationPath);

      for (const subscription of userSubscriptions) {
        try {
          const response = await sendPush(subscription, reminder, destinationPath, vapidPrivateKey, vapidSubject);
          const result = response.ok ? "sent" : response.status === 410 || response.status === 404 ? "gone" : "failed";

          await ctx.supabaseAdmin.from("notification_delivery_attempts").insert({
            notification_reminder_id: reminder.id,
            user_id: reminder.user_id,
            push_subscription_id: subscription.id,
            result,
            status_code: response.status,
            error_code: response.ok ? null : `http_${response.status}`,
            error_detail: response.ok ? null : response.statusText
          });

          if (response.ok) {
            sent += 1;
            await ctx.supabaseAdmin
              .from("notification_reminders")
              .update({
                status: "sent",
                sent_at: now.toISOString()
              })
              .eq("id", reminder.id);

            await ctx.supabaseAdmin
              .from("push_subscriptions")
              .update({
                last_success_at: now.toISOString(),
                failure_count: 0
              })
              .eq("id", subscription.id);
            break;
          }

          if (response.status === 410 || response.status === 404) {
            await ctx.supabaseAdmin
              .from("push_subscriptions")
              .update({
                active: false,
                failure_count: subscription.failure_count + 1
              })
              .eq("id", subscription.id);
            failures += 1;
            continue;
          }

          await ctx.supabaseAdmin
            .from("push_subscriptions")
            .update({
              failure_count: subscription.failure_count + 1
            })
            .eq("id", subscription.id);
          failures += 1;
        } catch (error) {
          await ctx.supabaseAdmin.from("notification_delivery_attempts").insert({
            notification_reminder_id: reminder.id,
            user_id: reminder.user_id,
            push_subscription_id: userSubscriptions[0]?.id ?? null,
            result: "failed",
            status_code: null,
            error_code: "exception",
            error_detail: error instanceof Error ? error.message : "Unknown push failure"
          });
          failures += 1;
        }
      }

      if (payload && reminder.status !== "sent") {
        await ctx.supabaseAdmin
          .from("notification_reminders")
          .update({
            status: "ready"
          })
          .eq("id", reminder.id);
      }
    }

    return Response.json({
      ok: true,
      due: reminders.length,
      sent,
      skipped,
      failures
    });
  })
};
