import { createClient } from "@/lib/supabase/server";
import { boardService } from "@/lib/services";
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
  const boards = await boardService.getBoardsWithTaskCount(supabase, userId);
  const sortedBoards = sortBoards(boards);

  return <DashboardClient initialBoards={sortedBoards} />;
}
