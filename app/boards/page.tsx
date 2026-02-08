import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { boardService } from "@/lib/services";
import { BoardsPageClient } from "./BoardsPageClient";
import { PlanProvider } from "@/lib/contexts/PlanContext";

export default async function BoardsPage() {
  const { userId, has } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const hasProPlan = has({ plan: "pro_user" });
  const hasEnterprisePlan = has({ plan: "enterprise_user" });

  const supabase = await createClient();
  const boards = await boardService.getBoardsWithTaskCount(supabase, userId);

  return (
    <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>
      <BoardsPageClient initialBoards={boards} />
    </PlanProvider>
  );
}
