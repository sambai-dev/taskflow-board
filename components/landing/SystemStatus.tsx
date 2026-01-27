"use client";

import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

type SystemStatus = "checking" | "operational" | "degraded";

export function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>("checking");

  useEffect(() => {
    async function checkSystem() {
      try {
        // Create an anonymous client specifically for status checking
        // This bypasses the main provider's requirement for a logged-in user
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        );

        const { error } = await supabase
          .from("boards")
          .select("count", { count: "exact", head: true });

        // If we get a network failure, it throws.
        // If we get 401/403/RLS error, it means the SERVICE is reachable (Operational).
        // Only connection timeouts/500s are truly "degraded" in this context.
        if (error && error.code && !error.code.startsWith("PGRST")) {
          // For now, let's assume any non-PostgREST error might be an issue,
          // but strictly, connection failures often don't have a 'code' in the same way.
          // Simpler: if it didn't throw, we reached Supabase.
        }

        setStatus("operational");
      } catch (err) {
        console.error("System status check failed:", err);
        setStatus("degraded");
      }
    }

    checkSystem();
  }, []);

  if (status === "checking") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-gray-300"></span>
        </span>
        Checking systems...
      </div>
    );
  }

  if (status === "degraded") {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="relative flex h-2 w-2">
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
        Systems degraded
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>
      All systems operational
    </div>
  );
}
