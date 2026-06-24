"use client";

import { useEffect, useMemo, useState } from "react";
import { SITE } from "../lib/seo/site";

/**
 * Self-serve embed-code generator. Site owners pick options, preview the
 * widget live, and copy a ready-to-paste snippet (iframe + branded link +
 * optional auto-resize script). Uses the live origin so the snippet always
 * points at wherever the site is actually hosted.
 */
export function EmbedBuilder() {
  const [mode, setMode] = useState<"weekly" | "biweekly">("weekly");
  const [autoresize, setAutoresize] = useState(true);
  const [copied, setCopied] = useState(false);
  const [origin, setOrigin] = useState(SITE.url);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") setOrigin(window.location.origin);
    setMounted(true);
  }, []);

  const src = `${origin}/embed?mode=${mode}`;

  const snippet = useMemo(() => {
    const iframe = `<iframe src="${src}" title="Time Card Calculator" width="100%" height="900" style="border:0;width:100%;max-width:720px" loading="lazy"></iframe>`;
    const attribution = `<p style="font:13px/1.4 system-ui,sans-serif;margin:8px 0"><a href="${origin}" target="_blank" rel="noopener">Time Card Calculator</a> by ${SITE.name}</p>`;
    const resize = autoresize
      ? `\n<script>window.addEventListener("message",function(e){if(e.data&&e.data.type==="tcc-embed-height"){var f=document.querySelector('iframe[src^="${origin}/embed"]');if(f){f.style.height=e.data.height+"px";}}});</script>`
      : "";
    return `${iframe}\n${attribution}${resize}`;
  }, [src, origin, autoresize]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked; user can select manually */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls + code */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink-900">Build your embed code</h2>

        <fieldset className="mt-4">
          <legend className="text-sm font-semibold text-ink-900">Default pay period</legend>
          <div className="mt-2 flex rounded-lg border border-slate-300 p-0.5">
            {(["weekly", "biweekly"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                  mode === m ? "bg-brand-600 text-white" : "text-ink-700 hover:bg-slate-100"
                }`}
              >
                {m === "weekly" ? "Weekly (7 days)" : "Biweekly (14 days)"}
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-4 flex items-center gap-2 text-sm text-ink-800">
          <input
            type="checkbox"
            checked={autoresize}
            onChange={(e) => setAutoresize(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-brand-600 focus:ring-brand-100"
          />
          Include auto-resize script (recommended — removes the inner scrollbar)
        </label>

        <label htmlFor="snippet" className="mt-5 block text-sm font-semibold text-ink-900">
          Copy &amp; paste this where you want the calculator:
        </label>
        <textarea
          id="snippet"
          readOnly
          value={mounted ? snippet : "Loading embed code…"}
          onClick={(e) => (e.target as HTMLTextAreaElement).select()}
          rows={7}
          className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 p-3 font-mono text-xs text-ink-800 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
        />
        <button type="button" onClick={copy} className="btn-primary mt-3">
          {copied ? "Copied!" : "Copy embed code"}
        </button>
        <p className="mt-3 text-xs text-ink-700">
          Free to use. Keeping the small attribution link is appreciated and helps
          others find the tool.
        </p>
      </div>

      {/* Live preview */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
        <h2 className="text-lg font-bold text-ink-900">Live preview</h2>
        <p className="mt-1 text-sm text-ink-700">Exactly how it will look on your page.</p>
        <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
          {mounted ? (
            <iframe
              src={src}
              title="Time Card Calculator preview"
              className="h-[640px] w-full"
              loading="lazy"
            />
          ) : (
            <div className="grid h-[640px] place-items-center text-sm text-slate-400">
              Loading preview…
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
