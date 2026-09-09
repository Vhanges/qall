"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on route change
  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <div
      className={`fixed inset-0 z-[49] md:hidden transition-all duration-500 ${
        isOpen ? "visible" : "invisible"
      }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-dark-950/95 backdrop-blur-md transition-opacity duration-500 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-dark-900 border-l border-white/5 transition-transform duration-500 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6 pb-8">
          <nav className="flex flex-col gap-2">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className={`px-4 py-3 text-lg font-medium rounded-lg transition-all duration-300 ${
                    isActive
                      ? "text-orange-500 bg-orange-500/5"
                      : "text-white hover:text-dark-50 hover:bg-white/5"
                  }`}
                  style={{
                    transitionDelay: isOpen ? `${i * 50 + 100}ms` : "0ms",
                    opacity: isOpen ? 1 : 0,
                    transform: isOpen ? "translateX(0)" : "translateX(20px)",
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto">
            <Button href="/contact#booking" className="w-full" onClick={onClose}>
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
