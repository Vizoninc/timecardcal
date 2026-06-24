/**
 * Page content registry.
 *
 * Each landing page reuses the SAME calculation engine but has UNIQUE copy,
 * examples, and FAQs so it can rank independently. Page config also sets the
 * calculator's default mode/options for that page.
 */

import type { CalcOptions } from "../../lib/calculations/types";

export interface FaqItem {
  q: string;
  a: string;
}

export interface ExampleItem {
  title: string;
  body: string;
}

export interface RelatedLink {
  label: string;
  href: string;
}

export interface CalculatorDefaults {
  mode: "weekly" | "biweekly";
  options: Partial<CalcOptions>;
}

export interface PageContent {
  slug: string; // path without leading slash, "" for home
  h1: string;
  seoTitle: string;
  seoDescription: string;
  /** One or two short intro paragraphs. */
  intro: string[];
  howTo: string[];
  examples: ExampleItem[];
  conversionTips: string[];
  faqs: FaqItem[];
  related: RelatedLink[];
  defaults: CalculatorDefaults;
  /** Breadcrumb display name. */
  breadcrumb: string;
  /** One-sentence, answer-first definition for snippets/AI (shown under H1). */
  answer: string;
  /** Page-specific note on how overtime works (reduces cross-page duplication). */
  overtimeNote: string;
  /** Page-specific note on how breaks work. */
  breaksNote: string;
}

const VERIFY_NOTE =
  "This tool is for estimates. Overtime rules, rounding, and break laws vary by state, country, and employer policy — always verify the numbers against your own pay rules before using them for payroll.";

export const PAGES: Record<string, PageContent> = {
  "time-card-calculator": {
    slug: "time-card-calculator",
    answer:
      "A time card calculator adds up the hours between your clock-in and clock-out times each day, subtracts unpaid breaks, and gives you daily and weekly totals in both hours:minutes and decimal hours.",
    overtimeNote:
      "On a time card, overtime is usually any time past 40 hours in a week. Choose Weekly to flag it automatically, or Daily + weekly if your job also counts hours past 8 in a single day.",
    breaksNote:
      "Enter the unpaid minutes for each shift — a 30-minute lunch, say — and the calculator removes them from that day's total. Paid breaks stay in; just leave the field at 0.",
    breadcrumb: "Time Card Calculator",
    h1: "Time Card Calculator",
    seoTitle: "Time Card Calculator — Free Hours, Breaks & Pay",
    seoDescription:
      "Free time card calculator. Enter clock-in and clock-out times, subtract lunch breaks, and get daily and weekly totals in hh:mm and decimal hours, plus overtime and pay.",
    intro: [
      "Add up a week of punches in seconds. Enter each day's start and end time, subtract unpaid breaks, and this time card calculator shows your daily and weekly totals in both hh:mm and decimal hours.",
      "It handles overnight shifts, configurable overtime, optional pay rates, and rounding rules — and it works entirely in your browser, so nothing you type is uploaded.",
    ],
    howTo: [
      "Pick your time format (12-hour AM/PM or 24-hour).",
      "For each day you worked, type a start time and an end time.",
      "Enter unpaid break minutes (for example, 30 for a half-hour lunch).",
      "If a shift ran past midnight, switch on the overnight toggle for that row.",
      "Set your overtime rule and, optionally, an hourly rate to see gross pay.",
      "Read your totals, then print or export a clean report.",
    ],
    examples: [
      {
        title: "A standard day with lunch",
        body: "9:00 AM to 5:30 PM with a 30-minute unpaid lunch is 8 hours worked (8:30 of clock time minus 0:30 break).",
      },
      {
        title: "A full week",
        body: "Five 8-hour days totals 40:00, or 40.00 decimal hours. Add a sixth 6-hour day and weekly overtime (over 40) kicks in for 6:00 of OT.",
      },
    ],
    conversionTips: [
      "hh:mm is best for reading a schedule; decimal hours are what most payroll systems want.",
      "15 minutes = 0.25, 30 = 0.50, 45 = 0.75 — memorize these four and most conversions are instant.",
    ],
    faqs: [
      {
        q: "Is this time card calculator free?",
        a: "Yes. It is free, needs no account, and runs in your browser. Saved timesheets are stored only on your device.",
      },
      {
        q: "How do I handle an unpaid lunch?",
        a: "Type the break length in minutes in the break field for that day. The calculator subtracts it from the clock time so your worked total is accurate.",
      },
      {
        q: "Can it total an overnight shift?",
        a: "Yes. If your end time is earlier than your start time, it assumes the shift crossed midnight. You can also flip the overnight toggle on a row to be explicit.",
      },
      {
        q: "Does it round my punches?",
        a: "Only if you choose a rounding rule. By default it uses exact minutes. You can switch to 5-, 6-, or 15-minute rounding to match your employer.",
      },
    ],
    related: [
      { label: "Timesheet Calculator", href: "/timesheet-calculator" },
      { label: "Time Card with Lunch Break", href: "/time-card-calculator-with-lunch-break" },
      { label: "Work Hours Calculator", href: "/work-hours-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },

  "timesheet-calculator": {
    slug: "timesheet-calculator",
    answer:
      "A timesheet calculator totals an employee's hours across a full pay period, weekly or biweekly, subtracting breaks and separating regular hours from overtime so the numbers are payroll-ready.",
    overtimeNote:
      "Set the weekly threshold (commonly 40) and each week's extra hours are marked as overtime. In biweekly mode every week is judged on its own, so a heavy week and a light week never cancel out.",
    breaksNote:
      "Unpaid breaks are entered per day and deducted from that day's hours, so the timesheet reflects paid time only. Use 0 for any break that is paid.",
    breadcrumb: "Timesheet Calculator",
    h1: "Timesheet Calculator",
    seoTitle: "Timesheet Calculator — Weekly & Biweekly Hours",
    seoDescription:
      "Free timesheet calculator for weekly and biweekly periods. Track hours per day, subtract breaks, split regular and overtime, and export a clean timesheet for payroll.",
    intro: [
      "A timesheet calculator built for the way payroll actually works: enter each day's hours, choose weekly or biweekly, and get clean regular/overtime splits you can hand off.",
      "Switch to a 14-day biweekly grid for two-week pay periods, save employee presets, and reuse them next cycle.",
    ],
    howTo: [
      "Choose Weekly (7 days) or Biweekly (14 days) at the top of the calculator.",
      "Fill in start, end, and break minutes for each worked day.",
      "Pick an overtime rule that matches your jurisdiction or contract.",
      "Optionally add an hourly rate to estimate gross pay.",
      "Save the result to your device or export it as CSV for your records.",
    ],
    examples: [
      {
        title: "Biweekly with overtime",
        body: "Week one: 42 hours. Week two: 38 hours. With a weekly 40-hour rule, week one produces 2:00 of overtime while week two stays regular — the calculator keeps the periods separate.",
      },
      {
        title: "Part-time across a pay period",
        body: "Three 5-hour shifts a week over two weeks totals 30:00, or 30.00 decimal hours, with no overtime under a 40-hour weekly rule.",
      },
    ],
    conversionTips: [
      "Export to CSV to paste straight into a spreadsheet or payroll import.",
      "Save an employee preset so a worker's rate and overtime rule autofill next period.",
    ],
    faqs: [
      {
        q: "What's the difference between weekly and biweekly mode?",
        a: "Weekly mode shows 7 days; biweekly shows 14 days for two-week pay periods. Overtime thresholds you set apply to the period you choose.",
      },
      {
        q: "Can I save more than one employee?",
        a: "Yes. Save a preset per employee with their rate and overtime rule. Presets live in your browser only.",
      },
      {
        q: "Will my data be uploaded anywhere?",
        a: "No. Calculations and saved timesheets stay on your device using local storage. There is no account and no server copy.",
      },
    ],
    related: [
      { label: "Biweekly Timesheet Calculator", href: "/biweekly-timesheet-calculator" },
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Weekly Hours Calculator", href: "/work-hours-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },

  "work-hours-calculator": {
    slug: "work-hours-calculator",
    answer:
      "A work hours calculator figures out exactly how many hours you worked between two times, minus unpaid breaks — handy for checking a paycheck against your own count.",
    overtimeNote:
      "Turn on a weekly threshold to split your hours into regular and overtime, or leave it on None if you just want the raw total of hours worked.",
    breaksNote:
      "Subtract unpaid break time by entering the minutes for each day. If your breaks are paid, leave it at 0 and they count toward your total.",
    breadcrumb: "Work Hours Calculator",
    h1: "Work Hours Calculator",
    seoTitle: "Work Hours Calculator — Daily & Weekly Hours Worked",
    seoDescription:
      "Calculate hours worked from start and end times. Free work hours calculator with break deductions, weekly totals, decimal hours, and overtime for hourly workers.",
    intro: [
      "Figure out exactly how many hours you worked. Enter your shift times for each day and the work hours calculator returns daily and weekly totals, minus any unpaid breaks.",
      "It's ideal for double-checking a paycheck: compare your own count against what your employer reported.",
    ],
    howTo: [
      "Enter the time you started and finished each day.",
      "Add break minutes you weren't paid for.",
      "Read the daily total, then the weekly total in hh:mm and decimal hours.",
      "Use the overtime setting if you want regular and overtime split out.",
    ],
    examples: [
      {
        title: "Checking a paycheck",
        body: "You worked 8:00 AM–4:30 PM with a 45-minute lunch four days, and 8:00 AM–12:00 PM on Friday. That's 31:00 worked, or 31.00 decimal hours.",
      },
      {
        title: "A weekly total",
        body: "Five days of 7 hours 45 minutes each totals 38:45, which is 38.75 in decimal hours.",
      },
    ],
    conversionTips: [
      "If your pay stub uses decimals and your schedule uses hh:mm, this is the fastest way to compare them.",
      "Set the same rounding rule your employer uses so your numbers line up.",
    ],
    faqs: [
      {
        q: "How do I calculate hours worked between two times?",
        a: "Subtract the start time from the end time, then subtract unpaid breaks. This calculator does it for you and handles shifts that cross midnight.",
      },
      {
        q: "What if my hours don't match my employer's?",
        a: "Check the rounding rule and break minutes first — those are the most common causes of small differences. Then verify your start and end times.",
      },
    ],
    related: [
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Decimal Hours Calculator", href: "/decimal-hours-calculator" },
      { label: "Timesheet Calculator", href: "/timesheet-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },

  "time-card-calculator-with-lunch-break": {
    slug: "time-card-calculator-with-lunch-break",
    answer:
      "This time card calculator subtracts lunch and other unpaid breaks for you: enter your clock times and the break minutes, and it returns the hours you actually worked.",
    overtimeNote:
      "Breaks are removed before overtime is calculated, so overtime reflects your true worked hours rather than clock-to-clock time. Pick a weekly or daily + weekly rule as needed.",
    breaksNote:
      "This is the heart of this page: type the unpaid minutes (30 for a half-hour lunch, 60 for an hour) for each day and they come straight off that day's total. Every day can have a different break.",
    breadcrumb: "Time Card with Lunch Break",
    h1: "Time Card Calculator with Lunch Break",
    seoTitle: "Time Card Calculator with Lunch Break — Subtract Breaks",
    seoDescription:
      "Time card calculator that subtracts lunch and unpaid breaks automatically. Enter clock times and break minutes for accurate daily and weekly worked-hours totals.",
    intro: [
      "Unpaid lunches are where time cards go wrong. This calculator subtracts your break minutes from each day automatically, so your worked total is right the first time.",
      "Enter a break for every day independently — a 30-minute lunch one day and a 60-minute lunch the next are both handled.",
    ],
    howTo: [
      "Type your clock-in and clock-out times for the day.",
      "In the break field, enter the unpaid minutes (30 for a half-hour lunch, 60 for an hour).",
      "The worked total updates instantly with the break removed.",
      "Repeat for each day; the weekly total reflects every deduction.",
    ],
    examples: [
      {
        title: "The classic example",
        body: "9:00 AM to 5:30 PM with a 30-minute lunch = 8:00 worked. The clock span is 8:30; subtract the 0:30 break to get 8 hours.",
      },
      {
        title: "Two different breaks",
        body: "Monday with a 30-minute lunch and Tuesday with a 60-minute lunch, both 9:00 AM–6:00 PM, give 8:30 and 8:00 worked respectively.",
      },
    ],
    conversionTips: [
      "If your breaks are paid, leave the break field at 0 so nothing is deducted.",
      "Some states require specific meal breaks — verify your local rules, this tool only does the math.",
    ],
    faqs: [
      {
        q: "Does the calculator subtract lunch automatically?",
        a: "Yes. Whatever you enter in the break field is removed from that day's worked time. Set it to 0 for paid breaks.",
      },
      {
        q: "Can each day have a different break length?",
        a: "Yes. Break minutes are set per day, so you can mix 30-, 45-, and 60-minute breaks across the week.",
      },
      {
        q: "Are meal breaks required by law?",
        a: "It depends on your state and role. This tool only calculates time; check your jurisdiction's meal-and-rest-break rules separately.",
      },
    ],
    related: [
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Work Hours Calculator", href: "/work-hours-calculator" },
      { label: "Timesheet Calculator", href: "/timesheet-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },

  "biweekly-timesheet-calculator": {
    slug: "biweekly-timesheet-calculator",
    answer:
      "A biweekly timesheet calculator totals 14 days of work in one place, subtracting breaks and splitting overtime per week, so a two-week pay period is ready to hand to payroll.",
    overtimeNote:
      "Across a biweekly period the weekly threshold applies to each week separately. A 45-hour week earns overtime even when the other week is light — the two weeks are never averaged together.",
    breaksNote:
      "Enter unpaid breaks for each of the 14 days and they are deducted day by day. Paid breaks stay in the total at 0 minutes.",
    breadcrumb: "Biweekly Timesheet Calculator",
    h1: "Biweekly Timesheet Calculator",
    seoTitle: "Biweekly Timesheet Calculator — 14-Day Pay Periods",
    seoDescription:
      "Free biweekly timesheet calculator for 14-day pay periods. Track two weeks of hours, subtract breaks, split overtime per week, and export totals for payroll.",
    intro: [
      "Built for two-week pay periods. The biweekly timesheet calculator gives you a 14-day grid so you can enter both weeks at once and get a single period total.",
      "Overtime is evaluated against the rule you choose, and you can save the period as a recent timesheet to revisit later.",
    ],
    howTo: [
      "The calculator opens in Biweekly mode with 14 day rows.",
      "Enter start, end, and break minutes for each day you worked.",
      "Choose your overtime rule — weekly thresholds are applied to each week within the period.",
      "Add an hourly rate to see estimated gross pay for the period.",
      "Export to CSV or print a report for the pay run.",
    ],
    examples: [
      {
        title: "Biweekly with one heavy week",
        body: "Week one runs 45 hours (5 hours of overtime under a 40-hour rule); week two runs 32 hours. The period total is 77:00 with 5:00 of overtime.",
      },
      {
        title: "Steady two weeks",
        body: "Ten 8-hour days across two weeks totals 80:00, or 80.00 decimal hours, with no overtime under a weekly 40-hour rule.",
      },
    ],
    conversionTips: [
      "Set the overtime rule to match how your employer defines a workweek within the biweekly period.",
      "Save an employee preset to reuse the rate and rule for the next period.",
    ],
    faqs: [
      {
        q: "How is overtime handled across two weeks?",
        a: "With a weekly threshold, each week's hours over the limit count as overtime. The calculator keeps the two weeks distinct rather than summing the whole period against one threshold.",
      },
      {
        q: "Can I switch back to a single week?",
        a: "Yes. Toggle to Weekly mode any time; your time format and overtime rule carry over.",
      },
    ],
    related: [
      { label: "Timesheet Calculator", href: "/timesheet-calculator" },
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Work Hours Calculator", href: "/work-hours-calculator" },
    ],
    defaults: { mode: "biweekly", options: {} },
  },

  "minutes-to-decimal-payroll": {
    slug: "minutes-to-decimal-payroll",
    answer:
      "To convert minutes to decimal hours for payroll, divide the minutes by 60: 15 minutes is 0.25, 30 is 0.50, and 45 is 0.75. The calculator below does it for a whole timesheet automatically.",
    overtimeNote:
      "Once hours are in decimal form, overtime multiplies cleanly — set a weekly threshold and the tool splits regular and overtime decimal hours for you.",
    breaksNote:
      "Unpaid breaks are subtracted before the decimal conversion, so the decimal total reflects paid time only.",
    breadcrumb: "Minutes to Decimal (Payroll)",
    h1: "Minutes to Decimal Hours for Payroll",
    seoTitle: "Minutes to Decimal Payroll Converter — Chart & Calculator",
    seoDescription:
      "Convert minutes to decimal hours for payroll. See the full minute-to-decimal chart (15=0.25, 30=0.50, 45=0.75) and calculate a whole timesheet in decimal hours.",
    intro: [
      "Payroll systems want decimal hours, but timeclocks speak hours and minutes. This page converts minutes to decimals — and the calculator below outputs your whole week in decimal hours automatically.",
      "The rule is simple: divide minutes by 60. 15 minutes is a quarter hour (0.25), 30 is a half (0.50), 45 is three-quarters (0.75).",
    ],
    howTo: [
      "To convert by hand, divide the minutes by 60 (for example, 20 ÷ 60 = 0.33).",
      "Or enter your shift times below and read the decimal-hours total directly.",
      "Use the same number of decimal places your payroll system expects (usually two).",
    ],
    examples: [
      {
        title: "Quick conversions",
        body: "10 min = 0.17, 15 = 0.25, 20 = 0.33, 30 = 0.50, 40 = 0.67, 45 = 0.75, 50 = 0.83.",
      },
      {
        title: "A real timesheet",
        body: "Worked 7 hours 20 minutes? That's 7 + (20 ÷ 60) = 7.33 decimal hours.",
      },
    ],
    conversionTips: [
      "Rounding to two decimals can introduce a cent or two of difference — for money, calculate from exact minutes, then round the dollars.",
      "The four anchors to memorize: 15→0.25, 30→0.50, 45→0.75, 60→1.00.",
    ],
    faqs: [
      {
        q: "How do I convert minutes to decimal hours?",
        a: "Divide the minutes by 60. For example, 45 minutes ÷ 60 = 0.75 hours.",
      },
      {
        q: "Why does payroll use decimal hours?",
        a: "Decimal hours multiply cleanly by an hourly rate. 8.5 hours × $20 = $170, which is easier than working in hours and minutes.",
      },
      {
        q: "Is 0.50 the same as 30 minutes?",
        a: "Yes. Half an hour is 0.50 decimal hours, because 30 ÷ 60 = 0.5.",
      },
    ],
    related: [
      { label: "Decimal Hours Calculator", href: "/decimal-hours-calculator" },
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Work Hours Calculator", href: "/work-hours-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },

  "decimal-hours-calculator": {
    slug: "decimal-hours-calculator",
    answer:
      "A decimal hours calculator converts clock times into decimal hours — so 8 hours 15 minutes becomes 8.25 — which is the format most payroll systems expect.",
    overtimeNote:
      "Regular and overtime hours are both shown in decimal form, ready to multiply by a pay rate. Choose the overtime rule that matches your job.",
    breaksNote:
      "Break minutes are removed before the decimal total is calculated, so 8.25 means 8.25 hours actually worked.",
    breadcrumb: "Decimal Hours Calculator",
    h1: "Decimal Hours Calculator",
    seoTitle: "Decimal Hours Calculator — Convert Time to Decimals",
    seoDescription:
      "Decimal hours calculator. Enter clock times and instantly get totals in decimal hours for payroll, plus the hh:mm equivalent, break deductions, and overtime.",
    intro: [
      "Turn clock times into decimal hours without doing the division yourself. Enter your shifts and the decimal hours calculator returns the total payroll-ready, alongside the familiar hh:mm.",
      "It's the same engine as our time card calculator, tuned to put decimal hours front and center.",
    ],
    howTo: [
      "Enter start and end times for each day.",
      "Add any unpaid break minutes.",
      "Read the decimal-hours total — for example, 38.75 — next to the hh:mm total.",
      "Apply rounding if your payroll system expects it.",
    ],
    examples: [
      {
        title: "From hh:mm to decimal",
        body: "A 38:45 week is 38.75 decimal hours. The calculator shows both so you can copy whichever your system needs.",
      },
      {
        title: "Single shift",
        body: "8:00 AM to 4:15 PM with no break is 8:15, or 8.25 decimal hours.",
      },
    ],
    conversionTips: [
      "For pay, let the tool compute gross from exact minutes — rounding decimals first can cost a few cents.",
      "Decimal hours are the standard import format for most payroll software.",
    ],
    faqs: [
      {
        q: "What are decimal hours?",
        a: "Decimal hours express time as a number with a fractional part instead of minutes — 8 hours 15 minutes becomes 8.25.",
      },
      {
        q: "How do I get the hh:mm version back?",
        a: "Multiply the fractional part by 60. For 8.25, that's 0.25 × 60 = 15 minutes, so 8:15.",
      },
    ],
    related: [
      { label: "Minutes to Decimal (Payroll)", href: "/minutes-to-decimal-payroll" },
      { label: "Time Card Calculator", href: "/time-card-calculator" },
      { label: "Work Hours Calculator", href: "/work-hours-calculator" },
    ],
    defaults: { mode: "weekly", options: {} },
  },
};

export const PAGE_SLUGS = Object.keys(PAGES);

export function getPage(slug: string): PageContent | null {
  return PAGES[slug] ?? null;
}

export const VERIFY_DISCLAIMER = VERIFY_NOTE;
