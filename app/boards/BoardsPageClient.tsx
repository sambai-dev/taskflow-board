"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Loader2, Grid3x3, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoards, BoardWithTaskCount } from "@/lib/hooks/useBoards";
import { usePlan } from "@/lib/contexts/PlanContext";
import { BoardCard } from "@/components/BoardCard";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

interface BoardsPageClientProps {
  initialBoards: BoardWithTaskCount[];
}

const BOARD_COLORS = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

export function BoardsPageClient({ initialBoards }: BoardsPageClientProps) {
  const { boards, createBoard, deleteBoard, loading } =
    useBoards(initialBoards);
  const router = useRouter();
  const { isFreeUser } = usePlan();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isCreating, setIsCreating] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [newBoardColor, setNewBoardColor] = useState("bg-blue-500");
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [boardToDelete, setBoardToDelete] = useState<string | null>(null);

  const handleCreateBoard = async () => {
    if (!newBoardTitle.trim()) return;

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

  const handleDeleteBoard = async (boardId: string) => {
    await deleteBoard(boardId);
    setBoardToDelete(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar />
        <main className="ml-64 flex-1 bg-[#F8F9FC]">
          <TopBar title="Boards" />
          <div className="flex h-[calc(100vh-64px)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 bg-[#F8F9FC]">
        <TopBar title="Boards" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Boards</h1>
              <p className="text-gray-500 mt-1">
                {boards.length} {boards.length === 1 ? "board" : "boards"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={
                    viewMode === "grid"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-500 hover:text-gray-900"
                  }
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={
                    viewMode === "list"
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "text-gray-500 hover:text-gray-900"
                  }
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Board
              </Button>
            </div>
          </div>

          {/* Boards Grid/List */}
          {boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                <Grid3x3 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                No boards yet
              </h3>
              <p className="text-gray-500 mb-6 max-w-sm text-center">
                Create your first board to start organizing your tasks and
                projects in one place.
              </p>
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Board
              </Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "flex flex-col gap-4"
              }
            >
              {boards.map((board) => (
                <Link key={board.id} href={`/boards/${board.id}`}>
                  <BoardCard
                    board={board}
                    onDelete={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setBoardToDelete(board.id);
                    }}
                  />
                </Link>
              ))}

              {/* Create New Board Card (Always visible) */}
              <button
                onClick={() => setIsCreateDialogOpen(true)}
                className="group flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-6 hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 h-full min-h-[180px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-900/5 group-hover:scale-110 transition-transform duration-300">
                  <Plus className="h-6 w-6 text-blue-600" />
                </div>
                <span className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Create New Board
                </span>
              </button>
            </div>
          )}
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

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!boardToDelete}
        onOpenChange={() => setBoardToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Board</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              Are you sure you want to delete this board? This action cannot be
              undone.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setBoardToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => boardToDelete && handleDeleteBoard(boardToDelete)}
            >
              Delete
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
