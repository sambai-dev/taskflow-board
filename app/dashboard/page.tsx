import { createClient } from "@/lib/supabase/server";
import { boardService, taskService, dashboardService } from "@/lib/services";
import { sortBoards } from "@/lib/utils";
import DashboardClient from "@/components/dashboard/DashboardClient";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  const supabase = await createClient();
  const [boards, taskStats, recentTasks] = await Promise.all([
    boardService.getBoardsWithTaskCount(supabase, userId),
    dashboardService.getTaskStats(supabase, userId),
    taskService.getRecentTasks(supabase, userId, 5),
  ]);

  const sortedBoards = sortBoards(boards);

  return (
    <DashboardClient
      initialBoards={sortedBoards}
      stats={taskStats}
      recentTasks={recentTasks}
    />
  );
}
