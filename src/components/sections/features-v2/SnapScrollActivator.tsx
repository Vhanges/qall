"use client";

import { useEffect } from "react";

export function SnapScrollActivator() {
  useEffect(() => {
    document.documentElement.classList.add("snap-active");
    return () => {
      document.documentElement.classList.remove("snap-active");
    };
  }, []);

  return null;
}
