export default function SectionCard({ title, kicker, description, children, tone = "light" }) {
  return (
    <section
      className={`rounded-[1.75rem] border p-5 shadow-[0_12px_40px_rgba(20,20,19,0.05)] md:p-7 ${
        tone === "dark"
          ? "border-[var(--dark-border)] bg-[var(--dark)] text-[var(--ivory)]"
          : "border-[var(--border)] bg-[var(--card)]"
      }`}
    >
      <div className="mb-5">
        {kicker ? (
          <p className="mb-2 text-[0.7rem] uppercase tracking-[0.18em] text-[var(--stone)]">
            {kicker}
          </p>
        ) : null}
        <h2 className="font-display text-[1.75rem] leading-[1.1] md:text-[2.15rem]">
          {title}
        </h2>
        {description ? (
          <p className={`mt-3 max-w-2xl text-sm leading-7 ${tone === "dark" ? "text-[var(--silver)]" : "text-[var(--muted)]"}`}>
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
