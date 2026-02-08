"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Circle, ArrowRight, CheckCircle, Layout } from "lucide-react";
import { getBoardColorClasses, cn } from "@/lib/utils";
import { BoardWithTaskCount } from "@/lib/hooks/useBoards";
import { formatDistanceToNow } from "date-fns";

interface BoardCardProps {
  board: BoardWithTaskCount;
  isNew?: boolean;
  onDelete?: (e: React.MouseEvent) => void;
}

export function BoardCard({ board, isNew, onDelete }: BoardCardProps) {
  const colors = getBoardColorClasses(board.color);

  const getStatusIcon = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes("todo") || lower.includes("to do")) return Circle;
    if (lower.includes("progress")) return ArrowRight;
    if (lower.includes("done") || lower.includes("complete"))
      return CheckCircle;
    return Layout; // Default icon
  };

  const getStatusColor = (count: number) => {
    if (count > 0) return colors.text;
    return "text-gray-300 dark:text-gray-600";
  };

  // Determine visible columns
  // Grid: show up to 4 columns to include "Done" if it's the 4th one.
  // List: show up to 4 columns as well, or more if needed? User said "add +1 once detected" if more columns created.
  // Actually user said "Can that +1 by like done... if more column were created... add +1"
  // So we show 4 columns (usually ToDo, Progress, Review, Done). If there are 5+, show +1.
  const visibleColumns = board.columnCounts?.slice(0, 4) || [];
  const remainingCount = (board.columnCounts?.length || 0) - 4;

  // Demo data transformation
  const displayTitle =
    board.title === "og" ? "Product Roadmap 2026" : board.title;

  return (
    <Card
      className={cn(
        "hover:shadow-xl transition-all duration-300 cursor-pointer group relative overflow-hidden flex flex-col h-full gap-0 hover:-translate-y-2 border border-gray-200",
        isNew
          ? `ring-2 ${colors.ring} shadow-[0_0_15px_${colors.shadow}] ${colors.border}`
          : "hover:border-blue-300/50",
      )}
    >
      {isNew && (
        <div className="absolute top-2 right-2 z-10">
          <Badge
            className={`${colors.badge} text-white ${colors.hover} shadow-sm animate-pulse`}
          >
            New
          </Badge>
        </div>
      )}

      <CardHeader className="p-5 pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-4 h-4 rounded-full ${board.color} shadow-sm ring-2 ring-white group-hover:scale-110 transition-transform`}
              title={`Board Color: ${board.color.replace("bg-", "").replace("-500", "")}`}
            />
            <CardTitle className="text-base font-bold truncate leading-tight group-hover:text-blue-600 transition-colors">
              {displayTitle}
            </CardTitle>
          </div>

          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mr-2 text-gray-400 hover:text-red-500 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
              onClick={onDelete}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
        {board.description && (
          <CardDescription className="text-xs line-clamp-1 mt-1 text-gray-500 ml-7">
            {board.description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="p-0 flex-grow">
        {/* Intentionally empty to keep it compact */}
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between text-xs text-muted-foreground mt-auto">
        {/* Task Status Row */}
        <div className="flex items-center gap-4">
          {board.columnCounts && board.columnCounts.length > 0 ? (
            visibleColumns.map((col) => {
              const Icon = getStatusIcon(col.title);
              const colorClass = getStatusColor(col.count);
              return (
                <div
                  key={col.id}
                  className="flex items-center gap-1.5 cursor-help group/stat"
                  title={`${col.count} tasks in ${col.title}`}
                >
                  <Icon
                    className={cn("w-4 h-4 transition-colors", colorClass)}
                  />
                  <span
                    className={cn(
                      "font-medium",
                      col.count > 0
                        ? colors.text
                        : "text-gray-400 dark:text-gray-500",
                    )}
                  >
                    {col.count}
                  </span>
                </div>
              );
            })
          ) : (
            <span className="text-gray-400 italic">No tasks</span>
          )}

          {remainingCount > 0 && (
            <span
              className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full"
              title={`${remainingCount} more columns`}
            >
              +{remainingCount}
            </span>
          )}
        </div>

        {/* Dates */}
        <div className="flex flex-col items-end ml-4 text-[11px] leading-tight">
          <span
            className="text-gray-400 font-medium whitespace-nowrap"
            title={new Date(board.created_at).toLocaleString()}
          >
            {board.title === "og"
              ? "Created 45m ago"
              : `Created ${formatDistanceToNow(new Date(board.created_at))} ago`}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
