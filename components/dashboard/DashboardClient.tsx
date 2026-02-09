"use client";

import dynamic from "next/dynamic";

import { useBoards, BoardWithTaskCount } from "@/lib/hooks/useBoards";
import { useRouter } from "next/navigation";
import { useSupabase } from "@/lib/supabase/SupabaseProvider";
import { useUser } from "@clerk/nextjs";
import { taskService } from "@/lib/services";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { usePlan } from "@/lib/contexts/PlanContext";
import { Task } from "@/lib/supabase/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

// Layout Components
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { UpgradeBanner } from "./UpgradeBanner";

// Dashboard Components
import { StatsCards } from "./StatsCards";
import { ChartsSkeleton } from "./ChartsSkeleton";

// Lazy-load Recharts (~250KB) - loads after initial page render
const DashboardCharts = dynamic(
  () => import("./DashboardCharts").then((mod) => mod.DashboardCharts),
  { ssr: false, loading: () => <ChartsSkeleton /> },
);
import { TasksTable } from "./TasksTable";

interface DashboardClientProps {
  initialBoards: BoardWithTaskCount[];
  stats: {
    totalBoards: number;
    activeBoards: number;
    totalTasks: number;
    completionRate: number;
    tasksByStatus: { name: string; value: number }[];
    tasksCreatedLast30Days: { date: string; count: number }[];
  };
  recentTasks: (Task & {
    board_title: string;
    column_title: string;
    board_id: string;
  })[];
}

const BOARD_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export default function DashboardClient({
  initialBoards,
  stats,
  recentTasks,
}: DashboardClientProps) {
  const { createBoard, boards, loading } = useBoards(initialBoards);
  const router = useRouter();
  const { isFreeUser } = usePlan();

  // Local State
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("bg-blue-500");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  // Export State
  const { supabase } = useSupabase();
  const { user } = useUser();

  // Handlers
  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

    // Free user limit check
    if (isFreeUser && boards.length >= 1) {
      setShowUpgradeDialog(true);
      setIsCreateDialogOpen(false);
      return;
    }

    setIsCreating(true);
    try {
      const newBoard = await createBoard({
        title: newBoardTitle,
        description: "",
        color: newBoardColor,
      });
      if (newBoard) {
        setNewBoardTitle("");
        setNewBoardColor("bg-blue-500");
        setIsCreateDialogOpen(false);
        router.push(`/boards/${newBoard.id}`);
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleExportDashboard = async () => {
    if (!supabase || !user) return;

    try {
      // Fetch all recent tasks (limit 1000 for export)
      const allTasks = await taskService.getRecentTasks(
        supabase,
        user.id,
        1000,
      );

      const headers = [
        "Task Name",
        "Status",
        "Priority",
        "Board",
        "Created At",
      ];
      const csvContent = [
        headers.join(","),
        ...allTasks.map((task) =>
          [
            `"${task.title.replace(/"/g, '""')}"`,
            task.column_title,
            task.priority,
            `"${task.board_title.replace(/"/g, '""')}"`,
            new Date(task.created_at).toLocaleDateString(),
          ].join(","),
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute(
          "download",
          `dashboard_export_${new Date().toISOString().split("T")[0]}.csv`,
        );
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!supabase) return;
    try {
      await taskService.deleteTask(supabase, taskId);
      router.refresh();
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleBulkDelete = async (taskIds: string[]) => {
    if (!supabase) return;
    try {
      await Promise.all(
        taskIds.map((id) => taskService.deleteTask(supabase, id)),
      );
      router.refresh();
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 bg-[#F8F9FC]">
          <TopBar />
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 bg-[#F8F9FC]">
        {/* Top Bar */}
        <TopBar title="Dashboard" />

        {/* Page Content */}
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 mt-1">
                Overview of your workspace activity
              </p>
            </div>
            {/* Top export button removed */}
          </div>

          {/* Upgrade Banner */}
          <UpgradeBanner />

          {/* KPI Cards */}
          <StatsCards stats={stats} />

          {/* Charts Section */}
          <DashboardCharts
            data={{
              tasksByStatus: stats.tasksByStatus,
              tasksCreatedLast30Days: stats.tasksCreatedLast30Days,
            }}
          />

          {/* Tasks Table */}
          <TasksTable
            tasks={recentTasks}
            onExport={handleExportDashboard}
            onDelete={handleDeleteTask}
            onBulkDelete={handleBulkDelete}
          />
        </div>
      </main>

      {/* Create Board Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Board</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Board Title</Label>
              <Input
                id="title"
                placeholder="Enter board title..."
                value={newBoardTitle}
                onChange={(e) => setNewBoardTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreateBoard()}
              />
            </div>
            <div className="space-y-2">
              <Label>Color</Label>
              <div className="flex gap-2">
                {BOARD_COLORS.map((color) => (
                  <button
                    key={color}
                    className={`h-8 w-8 rounded-full ${color} ${
                      newBoardColor === color
                        ? "ring-2 ring-offset-2 ring-blue-600"
                        : ""
                    }`}
                    onClick={() => setNewBoardColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBoard}
              disabled={isCreating || !newBoardTitle.trim()}
            >
              {isCreating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Board
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Upgrade Dialog */}
      <Dialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upgrade to Pro</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              You&apos;ve reached the limit of 1 board on the free plan. Upgrade
              to Pro for unlimited boards and premium features.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowUpgradeDialog(false)}
            >
              Maybe Later
            </Button>
            <Button onClick={() => router.push("/pricing")}>View Plans</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
