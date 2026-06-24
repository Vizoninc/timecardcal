import { ShieldCheck, Bolt, Lock, Phone } from "./Icons";

const ITEMS = [
  { Icon: Bolt, label: "Instant results" },
  { Icon: Lock, label: "No sign-in" },
  { Icon: ShieldCheck, label: "Private — runs in your browser" },
  { Icon: Phone, label: "Works great on mobile" },
];

/** Slim trust/social-proof row. Server component. */
export function TrustStrip({ dark = false }: { dark?: boolean }) {
  return (
    <ul
      className={`flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium ${
        dark ? "text-slate-300" : "text-ink-700"
      }`}
    >
      {ITEMS.map(({ Icon, label }) => (
        <li key={label} className="flex items-center gap-2">
          <Icon className={`h-4 w-4 ${dark ? "text-brand-300" : "text-brand-600"}`} />
          {label}
        </li>
      ))}
    </ul>
  );
}
