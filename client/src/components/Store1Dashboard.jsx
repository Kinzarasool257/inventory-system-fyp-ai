// export default function AdminDashboard() {
//   return (
//     <div>
//       <h2>Admin Dashboard</h2>
//       <p>Only accessible by Store1 role</p>
//     </div>
//   );
// }
import DashboardLayout from "./DashboardLayout";
import InventoryOverview from "./graphchart";

function StatCard({ value, title, subtext, svgPath }) {
  return (
    <div className="flex-1 p-4 text-white flex items-center justify-between">
      <div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-sm text-blue-400">{title}</p>
        <p className="text-xs opacity-60 mt-1">{subtext}</p>
      </div>

      <div className="w-24 h-12">
        <svg viewBox="0 0 100 40" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          <path d={`${svgPath} L100 40 L0 40 Z`} fill="url(#areaGradient)" />
          <path d={svgPath} fill="none" stroke="#7582F5" strokeWidth="2" />
        </svg>
      </div>
    </div>
  );
}

export default function Store1Dashboard() {
  return (
    <DashboardLayout>
      {/* Top Info Bar */}
      <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
        <div className="flex items-center gap-3">
          <span className="text-white font-medium">Dashboard</span>
          <span>ICE Market data</span>
          <span>|</span>
          <span>Own analysis</span>
          <span>|</span>
          <span>Historic market data</span>
        </div>

        <div className="flex items-center gap-4">
          <span>Settings</span>
          <span>Analytics</span>
          <span>Watchlist</span>
        </div>
      </div>

      {/* Small summary cards */}
      <div className="bg-[#1E213A] rounded-lg shadow-md flex divide-x divide-[#1E213A] mb-6">
        <StatCard value="32,451" title="Visits" subtext="+14.00 (+0.50%)" svgPath="M0 38 L20 25 L40 35 L60 20 L80 30 L100 10" />
        <StatCard value="15,236" title="Impressions" subtext="+138.97 (+0.54%)" svgPath="M0 35 L20 30 L40 25 L60 35 L80 20 L100 30" />
        <StatCard value="7,688" title="Conversions" subtext="+57.62 (+0.76%)" svgPath="M0 30 L20 20 L40 40 L60 30 L80 35 L100 25" />
        <StatCard value="1,553" title="Downloads" subtext="+138.97 (+0.54%)" svgPath="M0 35 L20 25 L40 15 L60 40 L80 25 L100 30" />
      </div>

      {/* Graphs / Main Dashboard Content */}
      <InventoryOverview />
    </DashboardLayout>
  );
}