import type { ComponentType } from "react";

type IconProps = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function Clock({ className }: IconProps) {
  return (<svg className={className} {...base}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>);
}
export function Calendar({ className }: IconProps) {
  return (<svg className={className} {...base}><rect x="3" y="4" width="18" height="17" rx="2" /><path d="M3 9h18M8 2v4M16 2v4" /></svg>);
}
export function Hourglass({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9" /></svg>);
}
export function Coffee({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="M4 8h13v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V8Z" /><path d="M17 9h2a2 2 0 0 1 0 6h-2M6 2v2M10 2v2M14 2v2" /></svg>);
}
export function Layers({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="m12 3 9 5-9 5-9-5 9-5Z" /><path d="m3 13 9 5 9-5" /></svg>);
}
export function Divide({ className }: IconProps) {
  return (<svg className={className} {...base}><circle cx="12" cy="6" r="1.4" /><circle cx="12" cy="18" r="1.4" /><path d="M5 12h14" /></svg>);
}
export function Hash({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></svg>);
}
export function ShieldCheck({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="M12 3l7 3v6c0 5-3.5 7.5-7 9-3.5-1.5-7-4-7-9V6l7-3Z" /><path d="m9 12 2 2 4-4" /></svg>);
}
export function Bolt({ className }: IconProps) {
  return (<svg className={className} {...base}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" /></svg>);
}
export function Lock({ className }: IconProps) {
  return (<svg className={className} {...base}><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>);
}
export function Phone({ className }: IconProps) {
  return (<svg className={className} {...base}><rect x="6" y="2" width="12" height="20" rx="2" /><path d="M11 18h2" /></svg>);
}

export const TOOL_ICONS: Record<string, ComponentType<IconProps>> = {
  "time-card-calculator": Clock,
  "timesheet-calculator": Calendar,
  "work-hours-calculator": Hourglass,
  "time-card-calculator-with-lunch-break": Coffee,
  "biweekly-timesheet-calculator": Layers,
  "minutes-to-decimal-payroll": Divide,
  "decimal-hours-calculator": Hash,
};
