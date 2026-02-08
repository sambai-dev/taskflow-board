import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { dashboardService } from "@/lib/services";
import { AnalyticsPageClient } from "./AnalyticsPageClient";

export default async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  const stats = await dashboardService.getTaskStats(supabase, userId);

  return <AnalyticsPageClient stats={stats} />;
}
