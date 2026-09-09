"use client";

import { useEffect } from "react";

export default function CrmMockupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const prevBg = document.body.style.backgroundColor;
    const prevColor = document.body.style.color;
    document.body.style.backgroundColor = "#F6F7F9";
    document.body.style.color = "#111827";
    return () => {
      document.body.style.backgroundColor = prevBg;
      document.body.style.color = prevColor;
    };
  }, []);

  return <>{children}</>;
}
