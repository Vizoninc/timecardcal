import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-content px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-ink-900">Page not found</h1>
      <p className="mt-2 text-ink-700">
        That page doesn&rsquo;t exist. Try a calculator instead.
      </p>
      <Link
        href="/time-card-calculator"
        className="mt-6 inline-block rounded-lg bg-brand-500 px-5 py-2.5 font-medium text-white hover:bg-brand-600"
      >
        Open the Time Card Calculator
      </Link>
    </div>
  );
}
