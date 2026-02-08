import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { taskService } from "@/lib/services";
import { TasksPageClient } from "./TasksPageClient";

export default async function TasksPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createClient();
  // Fetch all tasks (using a higher limit)
  const tasks = await taskService.getRecentTasks(supabase, userId, 100);

  return <TasksPageClient initialTasks={tasks} />;
}
