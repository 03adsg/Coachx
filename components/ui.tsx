import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

export function Section({ title, meta, children }: { title: string; meta?: string; children: ReactNode }) {
  if (!title) {
    return <section className="section">{children}</section>;
  }

  return (
    <section className="section">
      <div className="row" style={{ marginBottom: 12 }}>
        <div>
          <h2 className="headline-md">{title}</h2>
          {meta ? <p className="caption" style={{ marginTop: 4 }}>{meta}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}

export function Card({ children, elevated = false, className = "" }: { children: ReactNode; elevated?: boolean; className?: string }) {
  return <div className={`card ${elevated ? "elevated" : ""} ${className}`.trim()}>{children}</div>;
}

export function PrimaryButton({ href, children, className = "" }: { href?: string; children: ReactNode; className?: string }) {
  if (href) {
    return (
      <Link href={href} className={`button-primary focus-ring ${className}`.trim()}>
        {children}
      </Link>
    );
  }

  return <button className={`button-primary focus-ring ${className}`.trim()} type="button">{children}</button>;
}

export function SecondaryButton({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <button className={`button-secondary focus-ring ${className}`.trim()} type="button" style={style}>
      {children}
    </button>
  );
}

export function StatTile({ label, value, meta }: { label: string; value: string; meta?: string }) {
  return (
    <div>
      <p className="eyebrow" style={{ marginBottom: 8 }}>{label}</p>
      <p className="metric">{value}</p>
      {meta ? <p className="caption" style={{ marginTop: 6 }}>{meta}</p> : null}
    </div>
  );
}

export function IconButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button aria-label={label} className="tap-target focus-ring" type="button">
      <span className="icon" aria-hidden="true">{icon}</span>
    </button>
  );
}
