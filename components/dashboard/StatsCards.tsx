"use client";

import { Trello, Activity, CheckSquare, Percent } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardsProps {
  stats: {
    totalBoards: number;
    activeBoards: number;
    totalTasks: number;
    completionRate: number;
  };
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Boards",
      value: stats.totalBoards.toString(),
      change: stats.totalBoards > 0 ? "+12%" : "0%",
      trend: stats.totalBoards > 0 ? ("up" as const) : ("neutral" as const),
      icon: Trello,
      iconBg: "bg-blue-100/80 from-blue-100 to-blue-200 bg-gradient-to-br",
      iconColor: "text-blue-700",
    },
    {
      title: "Active Boards",
      value: stats.activeBoards.toString(),
      change: stats.activeBoards > 0 ? "+8%" : "0%",
      trend: stats.activeBoards > 0 ? ("up" as const) : ("neutral" as const),
      icon: Activity,
      iconBg:
        "bg-purple-100/80 from-purple-100 to-purple-200 bg-gradient-to-br",
      iconColor: "text-purple-700",
    },
    {
      title: "Total Tasks",
      value: stats.totalTasks.toLocaleString(),
      change: stats.totalTasks > 0 ? "+15%" : "0%",
      trend: stats.totalTasks > 0 ? ("up" as const) : ("neutral" as const),
      icon: CheckSquare,
      iconBg:
        "bg-emerald-100/80 from-emerald-100 to-emerald-200 bg-gradient-to-br",
      iconColor: "text-emerald-700",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change:
        stats.completionRate > 0
          ? stats.completionRate >= 50
            ? "+5%"
            : "-3%"
          : "0%",
      trend:
        stats.completionRate > 0
          ? stats.completionRate >= 50
            ? ("up" as const)
            : ("down" as const)
          : ("neutral" as const),
      icon: Percent,
      iconBg:
        "bg-orange-100/80 from-orange-100 to-orange-200 bg-gradient-to-br",
      iconColor: "text-orange-700",
    },
  ];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card
          key={card.title}
          className="relative overflow-hidden border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300 group"
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.iconBg.replace("/80", "")} shadow-sm group-hover:scale-110 transition-transform duration-300`}
            >
              <card.icon className={`h-6 w-6 ${card.iconColor}`} />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm font-medium text-gray-500">{card.title}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold text-gray-900 tracking-tight">
                {card.value}
              </span>
              <div
                className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
                  card.trend === "up"
                    ? "text-emerald-700 bg-emerald-50"
                    : card.trend === "down"
                      ? "text-red-700 bg-red-50"
                      : "text-gray-500 bg-gray-100"
                }`}
              >
                {card.change}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
