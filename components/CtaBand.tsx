import Link from "next/link";

/** Gradient call-to-action band placed before the footer on marketing pages. */
export function CtaBand({
  href = "/time-card-calculator",
  label = "Open the calculator →",
  title = "Ready to total your hours?",
  subtitle = "Free, instant, and private — no sign-in, nothing uploaded.",
}: {
  href?: string;
  label?: string;
  title?: string;
  subtitle?: string;
}) {
  return (
    <section className="mt-16 print:hidden">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 px-6 py-12 text-center shadow-pop sm:px-12">
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl"
        />
        <h2 className="relative text-2xl font-black tracking-tight text-white sm:text-3xl">
          {title}
        </h2>
        <p className="relative mt-2 text-brand-100">{subtitle}</p>
        <Link
          href={href}
          className="relative mt-6 inline-flex items-center justify-center rounded-xl bg-white px-6 py-3 text-sm font-bold text-brand-700 shadow transition hover:bg-brand-50 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {label}
        </Link>
      </div>
    </section>
  );
}
