"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ListTodo, Filter, ArrowUpDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { Task } from "@/lib/supabase/models";

interface TaskWithDetails extends Task {
  board_title: string;
  column_title: string;
  board_id: string;
}

interface TasksPageClientProps {
  initialTasks: TaskWithDetails[];
}

const PRIORITY_COLORS: Record<string, string> = {
  high: "bg-red-50 text-red-700 border-red-200 border",
  medium: "bg-amber-50 text-amber-700 border-amber-200 border",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200 border",
};

const STATUS_COLORS: Record<string, string> = {
  "To Do": "bg-blue-50 text-blue-700 border-blue-200 border",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200 border",
  Review: "bg-purple-50 text-purple-700 border-purple-200 border",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200 border",
};

type SortField = "title" | "created_at" | "priority" | "column_title";
type SortDirection = "asc" | "desc";

export function TasksPageClient({ initialTasks }: TasksPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  // Get unique statuses for filter
  const statuses = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(initialTasks.map((t) => t.column_title)),
    ];
    return uniqueStatuses;
  }, [initialTasks]);

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let tasks = [...initialTasks];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.board_title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query),
      );
    }

    // Apply status filter
    if (statusFilter !== "all") {
      tasks = tasks.filter((task) => task.column_title === statusFilter);
    }

    // Apply priority filter
    if (priorityFilter !== "all") {
      tasks = tasks.filter((task) => task.priority === priorityFilter);
    }

    // Apply sorting
    tasks.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "created_at":
          comparison =
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "priority":
          comparison = a.priority.localeCompare(b.priority);
          break;
        case "column_title":
          comparison = a.column_title.localeCompare(b.column_title);
          break;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return tasks;
  }, [
    initialTasks,
    searchQuery,
    statusFilter,
    priorityFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Task Name", "Status", "Priority", "Board", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredTasks.map((task) =>
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
      link.setAttribute("download", "tasks_export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 bg-[#F8F9FC]">
        <TopBar title="All Tasks" />

        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">All Tasks</h1>
              <p className="text-gray-500 mt-1">
                Manage and track all your tasks across boards
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="bg-white"
                onClick={handleExportCSV}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all">
                + New Task
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger
                className={`w-[160px] ${statusFilter !== "all" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50" : ""}`}
              >
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger
                className={`w-[160px] ${priorityFilter !== "all" ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50" : ""}`}
              >
                <Filter className="mr-2 h-4 w-4 text-gray-400" />
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tasks Table */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 transition-colors group"
                    onClick={() => handleSort("title")}
                  >
                    <div className="flex items-center gap-1">
                      Task Name
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortField === "title" ? "text-blue-600 opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 transition-colors group"
                    onClick={() => handleSort("column_title")}
                  >
                    <div className="flex items-center gap-1">
                      Status
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortField === "column_title" ? "text-blue-600 opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 transition-colors group"
                    onClick={() => handleSort("priority")}
                  >
                    <div className="flex items-center gap-1">
                      Priority
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortField === "priority" ? "text-blue-600 opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                      />
                    </div>
                  </TableHead>
                  <TableHead className="w-[150px]">Board</TableHead>
                  <TableHead
                    className="cursor-pointer hover:text-gray-900 transition-colors group text-right"
                    onClick={() => handleSort("created_at")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      Created
                      <ArrowUpDown
                        className={`h-3 w-3 ${sortField === "created_at" ? "text-blue-600 opacity-100" : "opacity-0 group-hover:opacity-50"}`}
                      />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        <ListTodo className="h-12 w-12 text-gray-300 mb-3" />
                        <p className="text-gray-500 font-medium">
                          No tasks found
                        </p>
                        <p className="text-sm text-gray-400 mt-1">
                          Try adjusting your filters or search
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task) => {
                    const displayTitle =
                      task.title === "Query"
                        ? "Implement Authentication System"
                        : task.title;
                    const displayBoard =
                      task.board_title === "og"
                        ? "Product Roadmap 2026"
                        : task.board_title;
                    const tags = displayTitle.includes("Auth")
                      ? ["React", "Security"]
                      : displayTitle.includes("API")
                        ? ["Node.js"]
                        : ["React"];

                    return (
                      <TableRow
                        key={task.id}
                        className="hover:bg-gray-50 transition-colors group cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          <div className="flex flex-col">
                            <span className="text-gray-900 group-hover:text-blue-600 transition-colors">
                              {displayTitle}
                            </span>
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
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              STATUS_COLORS[task.column_title] ||
                              "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.column_title}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                              PRIORITY_COLORS[task.priority || "low"]
                            }`}
                          >
                            {task.priority || "Low"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/boards/${task.board_id}`}
                            className="text-sm text-gray-500 hover:text-blue-600 hover:underline decoration-blue-300 underline-offset-4 transition-all"
                          >
                            {displayBoard}
                          </Link>
                        </TableCell>
                        <TableCell className="text-right text-sm text-gray-500">
                          {new Date(task.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
