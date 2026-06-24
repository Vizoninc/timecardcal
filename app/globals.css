@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  color-scheme: light;
}

html {
  -webkit-text-size-adjust: 100%;
}

body {
  @apply bg-slate-50 text-ink-800 antialiased;
}

/* Visible, consistent focus ring for keyboard users across interactive els. */
:where(a, button, input, select, textarea, summary):focus-visible {
  outline: 2px solid theme("colors.brand.600");
  outline-offset: 2px;
}

/* Bigger touch targets on small screens without bloating desktop. */
@media (max-width: 640px) {
  input,
  select,
  button {
    min-height: 44px;
  }
}

/* ------- Print styles -------
   Remove all non-essential chrome and ads; show only the report. */
@media print {
  /* Anything marked print:hidden via Tailwind is already removed.
     Belt-and-suspenders for ad containers + nav. */
  [data-ad-slot],
  header,
  footer,
  nav,
  .sticky-actions {
    display: none !important;
  }

  body {
    background: #fff !important;
    color: #000 !important;
  }

  .calc-root {
    font-size: 12px;
  }

  /* Make tables print cleanly with borders. */
  table,
  th,
  td {
    border: 1px solid #999 !important;
    border-collapse: collapse;
  }

  a[href]::after {
    content: "";
  }

  @page {
    margin: 1.5cm;
  }
}
