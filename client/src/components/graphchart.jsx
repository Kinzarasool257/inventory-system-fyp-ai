import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

/* ===== IMAGE-MATCHED DATA ===== */

const salesData = [
  { name: "Jan", revenue: 60, sales: 20 },
  { name: "Feb", revenue: 75, sales: 35 },
  { name: "Mar", revenue: 65, sales: 30 },
  { name: "Apr", revenue: 120, sales: 70 },
  { name: "May", revenue: 140, sales: 50 },
  { name: "Jun", revenue: 110, sales: 45 },
];

const profitData = [
  { month: "Jan", value: 80 },
  { month: "Feb", value: 90 },
  { month: "Mar", value: 70 },
  { month: "Apr", value: 85 },
  { month: "May", value: 75 },
  { month: "Jun", value: 88 },
];

/* ================= COMPONENT ================= */

export default function InventoryOverview() {
  return (
    <div className="grid grid-cols-12 gap-6">

      {/* ================= SALES STATISTICS OVERVIEW ================= */}
      <div className="col-span-8 bg-[#1e2235] border border-[#2a2f4a] rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-white text-sm font-medium">
              Sales Statistics Overview
            </h3>
            <p className="text-xs text-gray-400">
              Lorem ipsum is placeholder text commonly used
            </p>
          </div>

          <div className="flex gap-4 text-xs text-gray-400">
            <span className="cursor-pointer hover:text-white">1D</span>
            <span className="cursor-pointer hover:text-white">5D</span>
            <span className="cursor-pointer hover:text-white">1M</span>
            <span className="cursor-pointer hover:text-white">1Y</span>
          </div>
        </div>

        {/* STATS */}
        <div className="flex gap-12 mb-6">
          <div>
            <p className="text-gray-400 text-xs">Total Cost</p>
            <p className="text-white text-lg font-semibold">
              15,263 <span className="text-xs text-gray-400">89.5%</span>
            </p>
          </div>

          <div>
            <p className="text-gray-400 text-xs">Total Revenue</p>
            <p className="text-white text-lg font-semibold">
              $753,098 <span className="text-xs text-gray-400">105%</span>
            </p>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-purple-400">
              ● Revenue
            </span>
            <span className="flex items-center gap-1 text-green-400">
              ● Sales
            </span>
          </div>
        </div>

        {/* LINE CHART */}
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={salesData}>
            <CartesianGrid stroke="#2a2f4a" />
            <XAxis dataKey="name" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#14182b",
                borderColor: "#2a2f4a",
                color: "#fff",
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#a78bfa"
              strokeWidth={3}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#34d399"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* ================= NET PROFIT MARGIN ================= */}
      <div className="col-span-4 bg-[#1e2235] border border-[#2a2f4a] rounded-xl p-6">
        <h3 className="text-white text-sm font-medium mb-1">
          Net Profit Margin
        </h3>
        <p className="text-xs text-gray-400 mb-6">
          Started collecting data from February 2019
        </p>

        <ResponsiveContainer width="100%" height={260}>
          <RadarChart data={profitData}>
            <PolarGrid stroke="#2a2f4a" />
            <PolarAngleAxis dataKey="month" stroke="#9ca3af" />
            <PolarRadiusAxis stroke="#9ca3af" />
            <Radar
              name="Sales"
              dataKey="value"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-6 text-sm mt-4">
          <span className="text-blue-400">● Sales</span>
          <span className="text-purple-400">● Orders</span>
        </div>
      </div>

    </div>
  );
}
