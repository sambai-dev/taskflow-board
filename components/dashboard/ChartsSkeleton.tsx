"use client";

import { Card } from "@/components/ui/card";

/**
 * Loading skeleton for DashboardCharts component.
 * Displays animated placeholder cards while Recharts loads (~250KB).
 */
export function ChartsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {[1, 2].map((i) => (
        <Card
          key={i}
          className="border-gray-200 bg-white p-6 shadow-sm animate-pulse"
        >
          {/* Header skeleton */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="h-5 w-24 bg-gray-200 rounded mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded mb-1" />
              <div className="h-4 w-32 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-36 bg-gray-100 rounded" />
          </div>

          {/* Chart area skeleton */}
          <div className="h-[300px] w-full flex items-end gap-2 pt-8">
            {Array.from({ length: 8 }).map((_, j) => (
              <div
                key={j}
                className="flex-1 bg-gray-100 rounded-t"
                style={{ height: `${40 + Math.random() * 50}%` }}
              />
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
