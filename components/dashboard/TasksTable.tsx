"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Eye,
  Calendar,
  Download,
  MoreHorizontal,
  ClipboardList,
  ArrowUpDown,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  board_title: string;
  column_title: string;
  priority: string;
  created_at: string;
  board_id: string;
}

interface TasksTableProps {
  tasks: Task[];
  onExport?: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  onBulkDelete?: (taskIds: string[]) => Promise<void>;
}

const tabs = [
  { id: "all", label: "All tasks" },
  { id: "todo", label: "To Do" },
  { id: "inprogress", label: "In Progress" },
  { id: "review", label: "Review" },
  { id: "done", label: "Done" },
];

export function TasksTable({
  tasks,
  onExport,
  onDelete,
  onBulkDelete,
}: TasksTableProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedTasks, setSelectedTasks] = useState<Set<string>>(new Set());

  // Filter tasks locally
  const filteredTasks = tasks.filter((task) => {
    if (activeTab === "all") return true;
    const status = task.column_title.toLowerCase();
    if (activeTab === "todo") return status === "to do";
    if (activeTab === "inprogress") return status === "in progress";
    if (activeTab === "review") return status === "review";
    if (activeTab === "done") return status === "done";
    return true;
  });

  const showControls = tasks.length > 5;

  const toggleSelectAll = () => {
    if (selectedTasks.size === filteredTasks.length) {
      setSelectedTasks(new Set());
    } else {
      setSelectedTasks(new Set(filteredTasks.map((t) => t.id)));
    }
  };

  const toggleSelectTask = (taskId: string) => {
    const newSelected = new Set(selectedTasks);
    if (newSelected.has(taskId)) {
      newSelected.delete(taskId);
    } else {
      newSelected.add(taskId);
    }
    setSelectedTasks(newSelected);
  };

  const handleBulkDeleteAction = async () => {
    if (onBulkDelete && selectedTasks.size > 0) {
      if (
        confirm(`Are you sure you want to delete ${selectedTasks.size} tasks?`)
      ) {
        await onBulkDelete(Array.from(selectedTasks));
        setSelectedTasks(new Set());
      }
    }
  };

  const handleDeleteAction = async (taskId: string) => {
    if (onDelete) {
      if (confirm("Are you sure you want to delete this task?")) {
        await onDelete(taskId);
      }
    }
  };

  const handleRowClick = (boardId: string) => {
    router.push(`/boards/${boardId}`);
  };

  return (
    <Card className="border-gray-200 bg-white shadow-sm overflow-visible">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">
        <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
        <div className="flex items-center gap-2">
          {selectedTasks.size > 0 ? (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDeleteAction}
              className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete ({selectedTasks.size})
            </Button>
          ) : (
            <>
              {showControls && (
                <>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Eye className="mr-2 h-4 w-4" />
                    View all
                  </Button>
                  <Button variant="outline" size="sm" className="text-gray-600">
                    <Calendar className="mr-2 h-4 w-4" />
                    Last 30 days
                  </Button>
                </>
              )}
              <Button
                variant="outline"
                size="sm"
                className="text-gray-600"
                onClick={onExport}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      {tasks.length > 0 && (
        <div className="flex gap-1 border-b border-gray-200 px-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              {tab.id === "todo" &&
                tasks.filter((t) => t.column_title.toLowerCase() === "to do")
                  .length > 0 && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-600">
                    {
                      tasks.filter(
                        (t) => t.column_title.toLowerCase() === "to do",
                      ).length
                    }
                  </span>
                )}
            </button>
          ))}
        </div>
      )}

      {/* Table */}
      <div className="overflow-visible">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-12">
                <div className="flex items-center justify-center p-1">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4 cursor-pointer"
                    checked={
                      filteredTasks.length > 0 &&
                      selectedTasks.size === filteredTasks.length
                    }
                    onChange={toggleSelectAll}
                  />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-600 cursor-pointer hover:text-gray-900 group">
                <div className="flex items-center gap-1">
                  TASK NAME
                  <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                STATUS
              </TableHead>
              <TableHead className="font-semibold text-gray-600 cursor-pointer hover:text-gray-900 group">
                <div className="flex items-center gap-1">
                  PRIORITY
                  <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TableHead>
              <TableHead className="font-semibold text-gray-600">
                BOARD
              </TableHead>
              <TableHead className="font-semibold text-gray-600 cursor-pointer hover:text-gray-900 group">
                <div className="flex items-center gap-1">
                  DATE
                  <ArrowUpDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="py-16 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                      <ClipboardList className="h-6 w-6 text-gray-400" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">
                      No tasks found
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">
                      Get started by creating your first board and task
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/boards")}
                    >
                      Go to Boards
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((task) => {
                const displayTitle =
                  task.title === "Query"
                    ? "Implement Authentication System"
                    : task.title;
                const displayBoard = task.board_title;
                const date = new Date(task.created_at);
                const tags = displayTitle.includes("Auth")
                  ? ["React", "Security"]
                  : displayTitle.includes("API")
                    ? ["Node.js"]
                    : ["React"];

                return (
                  <TableRow
                    key={task.id}
                    className={`hover:bg-gray-50 transition-colors cursor-pointer group ${
                      selectedTasks.has(task.id) ? "bg-blue-50/50" : ""
                    }`}
                    onClick={() => handleRowClick(task.board_id)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center p-1">
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-600 h-4 w-4 cursor-pointer"
                          checked={selectedTasks.has(task.id)}
                          onChange={() => toggleSelectTask(task.id)}
                        />
                      </div>
                    </TableCell>
                    {/* TASK NAME */}
                    <TableCell className="font-medium">
                      <div>
                        <p className="text-gray-900 group-hover:text-blue-600 transition-colors">
                          {displayTitle}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </TableCell>
                    {/* STATUS */}
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          task.column_title === "To Do"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : task.column_title === "In Progress"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : task.column_title === "Done"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-gray-50 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {task.column_title}
                      </span>
                    </TableCell>
                    {/* PRIORITY */}
                    <TableCell>
                      <div className="flex items-center">
                        <span
                          className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            task.priority === "High"
                              ? "bg-red-500"
                              : task.priority === "Medium"
                                ? "bg-yellow-500"
                                : "bg-blue-500"
                          }`}
                        />
                        <span className="text-sm text-gray-600">
                          {task.priority}
                        </span>
                      </div>
                    </TableCell>
                    {/* BOARD */}
                    <TableCell>
                      <Button
                        variant="link"
                        className="h-auto p-0 text-gray-600 hover:text-blue-600 hover:no-underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRowClick(task.board_id);
                        }}
                      >
                        {displayBoard}
                      </Button>
                    </TableCell>
                    {/* DATE */}
                    <TableCell className="text-gray-500 text-sm">
                      {formatDistanceToNow(date, { addSuffix: true })}
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-gray-600"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleRowClick(task.board_id)}
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Board
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => handleDeleteAction(task.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete Task
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination - Hide if few tasks */}
      {filteredTasks.length > 10 && (
        <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
          <p className="text-sm text-gray-500">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
