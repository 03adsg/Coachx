"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/components/auth-provider";
import { Screen } from "@/components/screen";
import { Card, PrimaryButton } from "@/components/ui";

export default function ProfileSecurityPage() {
  const router = useRouter();
  const auth = useAuthStore();

  return (
    <Screen
      activeTab="profile"
      shellClassName="screen-shell"
      topbar={
        <header className="topbar center">
          <div className="eyebrow" style={{ margin: 0, color: "#c6c6c7" }}>
            Account / Security
          </div>
        </header>
      }
    >
      <main className="content tight">
        <section className="section">
          <Card className="p-16">
            <div className="stack" style={{ gap: 12 }}>
              <div>
                <div className="eyebrow">Signed in as</div>
                <div className="headline-md" style={{ marginTop: 6 }}>
                  {auth.user?.email ?? "No active account"}
                </div>
                <p className="caption" style={{ marginTop: 8 }}>
                  Keep your session secure from this device.
                </p>
              </div>
              <div className="stack" style={{ gap: 8 }}>
                <Link href="/profile" className="button-secondary focus-ring" style={{ width: "100%" }}>
                  Back to Profile
                </Link>
                {auth.isConfigured ? (
                  <button
                    className="button-secondary focus-ring"
                    type="button"
                    onClick={async () => {
                      await auth.signOut();
                      router.push("/entry");
                    }}
                    style={{ width: "100%" }}
                  >
                    Sign out
                  </button>
                ) : null}
              </div>
            </div>
          </Card>
        </section>

        <section className="section">
          <Card className="p-16">
            <div className="eyebrow">Security note</div>
            <p className="caption" style={{ marginTop: 8, lineHeight: 1.6 }}>
              Account controls are managed through your current sign-in provider. No password or secret values are shown on this screen.
            </p>
          </Card>
        </section>

        <PrimaryButton href="/profile" className="focus-ring">
          Return
        </PrimaryButton>
      </main>
    </Screen>
  );
}
