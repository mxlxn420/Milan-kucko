"use client";

import { useEffect } from "react";

/**
 * iOS Safari fix: billentyűzet bezárásakor automatikusan visszaállítja
 * a zoom szintet, anélkül hogy véglegesen letiltaná a felhasználói zoomot.
 */
export default function ViewportFix() {
  useEffect(() => {
    const resetZoom = () => {
      const viewport = document.querySelector('meta[name="viewport"]') as HTMLMetaElement | null;
      if (!viewport) return;
      viewport.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
      requestAnimationFrame(() => {
        viewport.setAttribute("content", "width=device-width, initial-scale=1");
      });
    };

    document.addEventListener("focusout", resetZoom);
    return () => document.removeEventListener("focusout", resetZoom);
  }, []);

  return null;
}
