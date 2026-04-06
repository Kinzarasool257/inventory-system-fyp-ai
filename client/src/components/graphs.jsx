import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

/* ===== DUMMY DATA ===== */
const returnsData = [
  { month: "Jan", rate: 3.8 },
  { month: "Feb", rate: 3.4 },
  { month: "Mar", rate: 3.1 },
  { month: "Apr", rate: 2.7 },
  { month: "May", rate: 2.9 },
];

const stockData = [
  { item: "Aegir", stock: 889 },
  { item: "Ebbe", stock: 804 },
  { item: "Gjurd", stock: 58 },
];

export default function InventoryOverview() {
  return (
    <div className="rounded-2xl space-y-6 text-[#0f3d2a]">

      <div className="grid grid-cols-12 gap-4">

        {/* STOCK OUT PREDICTION */}
        <div className="col-span-3 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 text-[#0f3d2a]">
            Estimated Stock-Out Timeline
          </h3>

          {[
            ["Gjurd", "1.3 months"],
            ["Kindra", "2.6 months"],
            ["Mathilde", "3.9 months"],
            ["Alvilde", "5.2 months"],
            ["Magnus", "6.5 months"],
          ].map(([name, val]) => (
            <div key={name} className="flex justify-between text-sm mb-1">
              <span>{name}</span>
              <span className="font-medium">{val}</span>
            </div>
          ))}

          <p className="text-xs mt-3 text-[#14532d]">
            Based on recent sales and consumption trends
          </p>
        </div>

        {/* INVENTORY AUDIT */}
        <div className="col-span-3 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <h3 className="text-sm font-medium text-[#0f3d2a]">
            Inventory Audit Status
          </h3>

          <p className="text-4xl font-bold mt-1">42</p>
          <p className="text-xs text-[#14532d]">
            days since last physical stock count
          </p>

          <div className="mt-4">
            <p className="text-xs mb-1 text-[#14532d]">
              Inventory accuracy level
            </p>

            <div className="w-full h-2 bg-green-200 rounded">
              <div className="h-2 rounded w-[99%] bg-[#0f3d2a]" />
            </div>

            <p className="text-right text-xs mt-1 text-[#14532d]">
              99.1% system match
            </p>
          </div>
        </div>

        {/* IN-STOCK TABLE */}
        <div className="col-span-6 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 text-[#0f3d2a]">
            Currently Available Inventory
          </h3>

          <table className="w-full text-sm">
            <thead className="text-[#14532d]">
              <tr className="text-left">
                <th>Item</th>
                <th>Units</th>
                <th>Avg / 30d</th>
                <th>Unit Price</th>
                <th>Total Value</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-green-200">
              {[
                ["Aegir", 889, 102, "$759", "$675K"],
                ["Ebbe", 804, 49, "$999", "$803K"],
                ["Gjurd", 58, 126, "$1,199", "$70K"],
              ].map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j} className="py-2">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <p className="text-xs mt-3 text-[#14532d]">
            Snapshot of high-value inventory items
          </p>
        </div>

        {/* WAREHOUSE */}
        <div className="col-span-3 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <h3 className="text-sm font-medium text-[#0f3d2a]">
            Warehouse Capacity Utilization
          </h3>

          <p className="text-3xl font-bold mt-1">81%</p>

          <div className="w-full h-2 bg-green-200 rounded mt-2">
            <div className="h-2 rounded w-[81%] bg-[#0f3d2a]" />
          </div>

          <p className="text-xs mt-3 text-[#14532d]">
            $4.25M worth of goods stored
          </p>
        </div>

        {/* RETURNS CHART */}
        <div className="col-span-9 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <div className="flex gap-12 mb-4">
            <div>
              <p className="text-3xl font-bold">43</p>
              <p className="text-xs text-[#14532d]">
                pending customer returns
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold">2.9%</p>
              <p className="text-xs text-[#14532d]">
                average monthly return rate
              </p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={returnsData}>
              <CartesianGrid stroke="#14532d" />
              <XAxis dataKey="month" stroke="#0f3d2a" />
              <YAxis stroke="#0f3d2a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#f0fdf4", borderColor: "#0f3d2a" }}
                itemStyle={{ color: "#0f3d2a" }}
                labelStyle={{ color: "#14532d" }}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#0f3d2a"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* STOCK BAR CHART */}
        <div className="col-span-12 bg-green-50 border border-green-200 shadow-md w-full transition duration-300 hover:shadow-lg rounded-xl p-4">
          <h3 className="text-sm font-medium mb-3 text-[#0f3d2a]">
            Stock Distribution by Item
          </h3>

          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={stockData}>
              <CartesianGrid stroke="#14532d" />
              <XAxis dataKey="item" stroke="#0f3d2a" />
              <YAxis stroke="#0f3d2a" />
              <Tooltip
                contentStyle={{ backgroundColor: "#f0fdf4", borderColor: "#0f3d2a" }}
                itemStyle={{ color: "#0f3d2a" }}
                labelStyle={{ color: "#14532d" }}
              />
              <Bar dataKey="stock" fill="#0f3d2a" />
            </BarChart>
          </ResponsiveContainer>

          <p className="text-xs mt-3 text-[#14532d]">
            Identifies low-stock and overstocked products
          </p>
        </div>

      </div>
    </div>
  );
}