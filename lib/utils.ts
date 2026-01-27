import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getRelativeTime(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateString: string) {
  return getRelativeTime(dateString);
}

export function getBoardColorClasses(color: string) {
  const colors: Record<
    string,
    {
      ring: string;
      shadow: string;
      border: string;
      badge: string;
      hover: string;
      text: string;
    }
  > = {
    blue: {
      ring: "ring-blue-200",
      shadow: "blue-500/20",
      border: "border-blue-200",
      badge: "bg-blue-600",
      hover: "hover:bg-blue-700",
      text: "text-blue-600",
    },
    green: {
      ring: "ring-green-200",
      shadow: "green-500/20",
      border: "border-green-200",
      badge: "bg-green-600",
      hover: "hover:bg-green-700",
      text: "text-green-600",
    },
    purple: {
      ring: "ring-purple-200",
      shadow: "purple-500/20",
      border: "border-purple-200",
      badge: "bg-purple-600",
      hover: "hover:bg-purple-700",
      text: "text-purple-600",
    },
    orange: {
      ring: "ring-orange-200",
      shadow: "orange-500/20",
      border: "border-orange-200",
      badge: "bg-orange-600",
      hover: "hover:bg-orange-700",
      text: "text-orange-600",
    },
    pink: {
      ring: "ring-pink-200",
      shadow: "pink-500/20",
      border: "border-pink-200",
      badge: "bg-pink-600",
      hover: "hover:bg-pink-700",
      text: "text-pink-600",
    },
    gray: {
      ring: "ring-gray-200",
      shadow: "gray-500/20",
      border: "border-gray-200",
      badge: "bg-gray-600",
      hover: "hover:bg-gray-700",
      text: "text-gray-600",
    },
  };
  return colors[color] || colors.gray;
}

/**
 * Returns Tailwind background color class for task priority
 */
export function getPriorityColor(priority: "low" | "medium" | "high"): string {
  const colors: Record<"low" | "medium" | "high", string> = {
    high: "bg-red-500",
    medium: "bg-yellow-500",
    low: "bg-green-500",
  };
  return colors[priority] ?? "bg-gray-500";
}

export function sortBoards<
  T extends { taskCount?: number; created_at: string },
>(boards: T[]): T[] {
  return boards.sort((a, b) => {
    const countA = a.taskCount || 0;
    const countB = b.taskCount || 0;

    // If one has tasks and the other doesn't
    if (countA > 0 && countB === 0) return -1;
    if (countA === 0 && countB > 0) return 1;

    // If both have tasks, sort by count descending
    if (countA !== countB) {
      return countB - countA;
    }

    // Tie-breaker (or if both have 0 tasks): Sort by created date
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return dateB - dateA;
  });
}
