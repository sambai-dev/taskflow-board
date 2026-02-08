"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="antialiased">
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Critical Error
            </h1>
            <p className="text-gray-600 mb-6">
              A critical error occurred in the application. Please try
              refreshing the page.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-400 mb-4 font-mono">
                Error ID: {error.digest}
              </p>
            )}
            <Button onClick={reset} className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}
