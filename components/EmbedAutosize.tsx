"use client";

import { useEffect } from "react";

/**
 * Reports the widget's height to the parent window so an embedding site can
 * auto-resize the iframe (no inner scrollbars). Safe no-op when not framed.
 */
export function EmbedAutosize() {
  useEffect(() => {
    const post = () => {
      const height = Math.ceil(document.documentElement.scrollHeight);
      try {
        window.parent?.postMessage({ type: "tcc-embed-height", height }, "*");
      } catch {
        /* cross-origin parent may reject; ignore */
      }
    };
    post();
    const ro = new ResizeObserver(post);
    ro.observe(document.body);
    window.addEventListener("load", post);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", post);
    };
  }, []);
  return null;
}
