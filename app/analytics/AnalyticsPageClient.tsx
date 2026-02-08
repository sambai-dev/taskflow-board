"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  TrendingUp,
  CheckCircle2,
  ListTodo,
  Trello,
  Calendar,
} from "lucide-react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";

interface AnalyticsStats {
  totalBoards: number;
  activeBoards: number;
  totalTasks: number;
  completionRate: number;
  tasksByStatus: { name: string; value: number }[];
  tasksCreatedLast30Days: { date: string; count: number }[];
}

interface AnalyticsPageClientProps {
  stats: AnalyticsStats;
}

const CHART_COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444"];

export function AnalyticsPageClient({ stats }: AnalyticsPageClientProps) {
  // Format data for line chart
  const lineData = stats.tasksCreatedLast30Days.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }),
    tasks: item.count,
  }));

  // Calculate trends
  const last7Days = stats.tasksCreatedLast30Days.slice(-7);
  const previous7Days = stats.tasksCreatedLast30Days.slice(-14, -7);
  const last7Total = last7Days.reduce((sum, d) => sum + d.count, 0);
  const prev7Total = previous7Days.reduce((sum, d) => sum + d.count, 0);
  const weeklyTrend =
    prev7Total > 0 ? ((last7Total - prev7Total) / prev7Total) * 100 : 0;

  const statCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks.toString(),
      change: `${weeklyTrend >= 0 ? "+" : ""}${weeklyTrend.toFixed(1)}%`,
      changeType: weeklyTrend >= 0 ? "positive" : "negative",
      icon: ListTodo,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate}%`,
      change: "Tasks completed",
      changeType: "neutral",
      icon: CheckCircle2,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      title: "Total Boards",
      value: stats.totalBoards.toString(),
      change: `${stats.activeBoards} active`,
      changeType: "neutral",
      icon: Trello,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "This Week",
      value: last7Total.toString(),
      change: "Tasks created",
      changeType: "neutral",
      icon: TrendingUp,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 bg-[#F8F9FC]">
        <TopBar title="Analytics" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
              <p className="text-gray-500 mt-1">
                Track your productivity and task metrics
              </p>
            </div>
            <Button variant="outline" className="text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              Last 30 days
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card
                key={stat.title}
                className="border-gray-200 bg-white p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <span
                        className={`text-sm font-medium ${
                          stat.changeType === "positive"
                            ? "text-emerald-600"
                            : stat.changeType === "negative"
                              ? "text-red-600"
                              : "text-gray-500"
                        }`}
                      >
                        {stat.change === "+0.0%" ? "0%" : stat.change}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {stat.title === "Completion Rate"
                          ? "vs last month"
                          : "from last month"}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.iconBg}`}
                  >
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts Layout - Left Main, Right Sidebar */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {/* Tasks Over Time */}
              <Card className="border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Tasks Created
                    </h3>
                    <p className="text-sm text-gray-500">Last 14 days</p>
                  </div>
                </div>

                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={lineData.slice(-14)}>
                      <defs>
                        <linearGradient
                          id="analyticsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#3B82F6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#3B82F6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F3F4F6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 11 }}
                        interval={2}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="tasks"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#analyticsGradient)"
                        activeDot={{ r: 6, strokeWidth: 4, stroke: "#E0E7FF" }}
                        dot={{
                          r: 4,
                          fill: "#3B82F6",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Bar Chart */}
              <Card className="border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Daily Activity
                    </h3>
                    <p className="text-sm text-gray-500">
                      Tasks created per day (last 10 days)
                    </p>
                  </div>
                </div>

                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={lineData.slice(-10)}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#F3F4F6"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="date"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 11 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6B7280", fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        cursor={{ fill: "#F9FAFB" }}
                        contentStyle={{
                          backgroundColor: "#fff",
                          border: "none",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                          padding: "12px",
                        }}
                      />
                      <Bar
                        dataKey="tasks"
                        fill="#3B82F6"
                        radius={[4, 4, 0, 0]}
                        barSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              {/* Tasks by Status */}
              <Card className="border-gray-200 bg-white p-6 shadow-sm h-full">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      Distribution
                    </h3>
                    <p className="text-sm text-gray-500">By Status</p>
                  </div>
                </div>

                {stats.tasksByStatus.length === 0 ? (
                  <div className="h-72 flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">No task data available</p>
                    </div>
                  </div>
                ) : (
                  <div className="h-[400px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.tasksByStatus}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {stats.tasksByStatus.map((entry, index) => {
                            // Correct mapping for status colors if possible
                            let fill =
                              CHART_COLORS[index % CHART_COLORS.length];
                            if (entry.name === "Todo" || entry.name === "To Do")
                              fill = "#3B82F6"; // Blue
                            if (entry.name === "In Progress") fill = "#F59E0B"; // Yellow/Orange
                            if (
                              entry.name === "Done" ||
                              entry.name === "Completed"
                            )
                              fill = "#10B981"; // Green
                            return (
                              <Cell
                                key={`cell-${index}`}
                                fill={fill}
                                strokeWidth={0}
                              />
                            );
                          })}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            padding: "12px",
                          }}
                        />
                        <Legend
                          verticalAlign="middle"
                          align="center"
                          layout="vertical"
                          iconType="circle"
                          wrapperStyle={{ paddingTop: "20px" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
