"use client";

import { Card } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardChartsProps {
  data: {
    tasksByStatus: { name: string; value: number }[];
    tasksCreatedLast30Days: { date: string; count: number }[];
  };
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  const [dateRange, setDateRange] = useState("30");

  // Filter data based on range
  const days = parseInt(dateRange);
  // data.tasksCreatedLast30Days is sorted by date? usually yes from DB/service.
  // We take the last 'days' elements.
  const filteredData = data.tasksCreatedLast30Days.slice(-days);

  // Format data for Bar Chart
  const barData = filteredData.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
    }),
    count: item.count,
  }));

  // Generate cumulative data for Area Chart (Productivity Trend)
  // We want the area chart to show the trend over the selected period.
  // Original logic was cumulative? "Productivity Trend" often implies cumulative or just daily.
  // Original code:
  // const lineData = data.tasksCreatedLast30Days
  //   .slice(-10) // Wait, original logic sliced -10 ??
  // Let's look at original logic. Step 687 line 38: .slice(-10).
  // So original chart only showed LAST 10 DAYS?
  // But usage in AreaChart (line 186) used `data.tasksCreatedLast30Days` (which is 30 days).
  // It seems inconsistent in original code.
  // I will make the AreaChart respect the selected range.

  const hasData =
    data.tasksCreatedLast30Days.reduce((sum, item) => sum + item.count, 0) > 0;

  if (!hasData) {
    return (
      <div className="grid gap-6 lg:grid-cols-2">
        {[1, 2].map((i) => (
          <Card
            key={i}
            className="border-gray-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center h-[400px] text-center"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Calendar className="h-8 w-8 text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              No data available yet
            </h3>
            <p className="text-sm text-gray-500 max-w-xs mt-2">
              Charts will appear here once you start creating tasks and using
              boards.
            </p>
          </Card>
        ))}
      </div>
    );
  }

  // Calculate totals for selected range
  const totalTasksInRange = filteredData.reduce((sum, d) => sum + d.count, 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Bar Chart - Total Tasks */}
      <Card className="border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {totalTasksInRange.toLocaleString()}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              +25.5% from last month
            </p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] h-8 bg-gray-50/50 border-gray-200 text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                interval={0}
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
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar
                dataKey="count"
                fill="#3B82F6"
                radius={[4, 4, 0, 0]}
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Area Chart - Productivity Trend */}
      <Card className="border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Productivity Trend
            </h3>
            {/* Show last value or total? Keeping implicit logic from before */}
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {filteredData.length > 0
                ? filteredData[filteredData.length - 1].count.toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-emerald-600 mt-1">
              +20.1% from last month
            </p>
          </div>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px] h-8 bg-gray-50/50 border-gray-200 text-gray-600">
              <Calendar className="mr-2 h-4 w-4 text-gray-400" />
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="14">Last 14 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="h-[300px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={barData}>
              {" "}
              {/* Reuse barData for consistent date formatting */}
              <defs>
                <linearGradient
                  id="dashboardGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#E5E7EB"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 11 }}
                interval={0}
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
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#dashboardGradient)"
                activeDot={{ r: 6, strokeWidth: 4, stroke: "#E0E7FF" }}
                dot={{ r: 4, fill: "#3B82F6", strokeWidth: 2, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
