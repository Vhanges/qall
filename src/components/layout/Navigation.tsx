"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Navigation({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeLink = NAV_LINKS.find((l) => l.href === pathname);

  const handleEnter = useCallback(() => {
    if (leaveTimer.current) { clearTimeout(leaveTimer.current); leaveTimer.current = null; }
    setIsOpen(true);
  }, []);

  const handleLeave = useCallback(() => {
    leaveTimer.current = setTimeout(() => setIsOpen(false), 150);
  }, []);

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Burger trigger */}
      <button
        className="relative flex items-center justify-center w-10 h-10 rounded-lg text-white hover:text-dark-50 hover:bg-white/5 transition-colors duration-300 cursor-pointer"
        onClick={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="Open navigation"
      >
        {isOpen ? (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 4h14M2 9h14M2 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Dropdown panel */}
      <div
        className={`absolute top-full left-0 mt-1 w-48 rounded-xl border border-white/10 bg-dark-900/95 backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-200 z-50 ${
          isOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        {NAV_LINKS.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => { setIsOpen(false); onLinkClick?.(); }}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-200 ${
                isActive
                  ? "text-orange-500 bg-orange-500/5"
                  : "text-white hover:text-dark-50 hover:bg-white/5"
              }`}
            >
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
              )}
              {!isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
              )}
              {link.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
