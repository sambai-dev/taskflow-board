"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";

export function LandingButtons() {
  const { isSignedIn, isLoaded } = useUser();

  // While loading, we can show a skeleton or just the "Get Started" button as a fallback
  // Since we redirect logged-in users anyway via LandingAuthCheck, showing a default "Get Started"
  // that might flick over is acceptable, OR we can show nothing until loaded.
  // Given the design, a "Get Started" button is a safe default for SSG/SEO.

  // However, if we want to avoid layout shift, we can render the "Get Started" button by default
  // and replace it if signed in.

  if (!isLoaded) {
    return (
      <Button
        size="lg"
        disabled
        className="bg-white text-blue-600 text-lg px-10 py-6 h-auto font-semibold shadow-xl border-none opacity-80 pointer-events-none"
      >
        Get Started
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    );
  }

  if (isSignedIn) {
    return (
      <Link href="/dashboard">
        <Button
          size="lg"
          className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 h-auto font-semibold shadow-xl border-none hover:scale-105 transition-all duration-200"
        >
          Go to Dashboard
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </Link>
    );
  }

  return (
    <SignUpButton mode="modal">
      <Button
        size="lg"
        className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-10 py-6 h-auto font-semibold shadow-xl border-none hover:scale-105 transition-all duration-200"
      >
        Get Started for Free
        <ArrowRight className="ml-2 h-5 w-5" />
      </Button>
    </SignUpButton>
  );
}
