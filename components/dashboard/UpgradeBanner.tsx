"use client";

import { Zap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { usePlan } from "@/lib/contexts/PlanContext";

export function UpgradeBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const router = useRouter();
  const { isFreeUser } = usePlan();

  // Only show for free users and if not dismissed
  if (!isFreeUser || isDismissed) return null;

  return (
    <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-400/20 blur-2xl" />
      <div className="absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-blue-700/20 blur-2xl" />

      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold">Unlock premium features</h3>
            <p className="text-sm text-blue-100">
              Upgrade to Pro for unlimited boards & real-time insights
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="bg-white text-blue-600 hover:bg-blue-50 font-medium"
            onClick={() => router.push("/pricing")}
          >
            Upgrade Now
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => setIsDismissed(true)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
