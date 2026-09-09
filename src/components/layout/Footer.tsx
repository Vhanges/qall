import Link from "next/link";
import { QallLogo } from "@/components/ui/QallLogo";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Why Qall", href: "/why-qall" },
    { label: "Pricing", href: "/contact#booking" },
  ],
  Company: [
    { label: "About", href: "/why-qall" },
    { label: "Contact", href: "/contact#booking" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "Support", href: "/contact#booking" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-950">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <QallLogo height={44} layout="horizontal" />
            </Link>
            <p className="text-sm text-white leading-relaxed max-w-xs">
              The performance engine for modern insurance brokerages.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-dark-200 mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white hover:text-orange-500 transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white">
            &copy; {new Date().getFullYear()} Qall. All rights reserved.
          </p>
          <p className="text-xs text-white">
            Built for the insurance industry that demands more.
          </p>
        </div>
      </div>
    </footer>
  );
}
