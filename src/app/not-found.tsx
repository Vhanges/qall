import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <div className="text-center px-6">
        <p className="text-8xl font-bold text-orange-500 mb-4">404</p>
        <h1 className="font-heading font-bold text-3xl text-dark-50 mb-4">
          Page Not Found
        </h1>
        <p className="text-white mb-8 max-w-md mx-auto">
          The page you&apos;re looking for doesn&apos;t exist. Let&apos;s get you back on track.
        </p>
        <Button href="/">Back to Home</Button>
      </div>
    </div>
  );
}
