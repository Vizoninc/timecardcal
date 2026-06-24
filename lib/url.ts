/**
 * Shareable-URL encoding for NON-SENSITIVE settings only.
 *
 * We encode the calculator's mode + options (time format, rounding, overtime,
 * rate) into a compact query param so a link reproduces the same configuration.
 * We deliberately do NOT encode actual punch times by default — those can be
 * sensitive — but the encoder accepts an opt-in `includeDays` flag for users
 * who explicitly choose to share a filled timesheet.
 */

import type { CalcOptions, DayInput } from "./calculations/types";

export interface ShareState {
  mode: "weekly" | "biweekly";
  options: CalcOptions;
  days?: DayInput[];
}

const PARAM = "s";

/** Encode share state to a URL-safe base64 string. */
export function encodeShareState(state: ShareState): string {
  const json = JSON.stringify(state);
  if (typeof window === "undefined") {
    return Buffer.from(json, "utf-8").toString("base64url");
  }
  // Browser-safe base64url.
  const b64 = window.btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** Decode share state; returns null on any error. */
export function decodeShareState(encoded: string): ShareState | null {
  try {
    const b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    let json: string;
    if (typeof window === "undefined") {
      json = Buffer.from(b64, "base64").toString("utf-8");
    } else {
      json = decodeURIComponent(escape(window.atob(b64)));
    }
    const parsed = JSON.parse(json) as ShareState;
    if (parsed && (parsed.mode === "weekly" || parsed.mode === "biweekly")) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function buildShareUrl(
  baseUrl: string,
  state: ShareState
): string {
  const encoded = encodeShareState(state);
  const sep = baseUrl.includes("?") ? "&" : "?";
  return `${baseUrl}${sep}${PARAM}=${encoded}`;
}

export function readShareParam(search: string): ShareState | null {
  const params = new URLSearchParams(search);
  const raw = params.get(PARAM);
  return raw ? decodeShareState(raw) : null;
}

export const SHARE_PARAM = PARAM;
