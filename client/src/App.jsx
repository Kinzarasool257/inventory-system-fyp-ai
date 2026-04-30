import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./components/Login";
import Signup from "./components/Signup";
import Sidebar from "./components/sidebar";
import Header from "./components/header";
import Dashboard from "./components/dashboard"; // small stat card
import InventoryOverview from "./components/graphs"; // 👈 MIDDLE DASHBOARD UI
import FileUpload from "./components/FileUpload";
import StoreAdminView from "./components/StoreDashboardView";
import AdminChat from "./pages/AdminChat";
import UserChat from "./pages/UserChat";
import StockDashboard from "./StockDashboard";

/* ================= DASHBOARD LAYOUT ================= */
function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 bg-gray-100 flex flex-col">
        
        {/* Header */}
        <Header />

        {/* MAIN DASHBOARD CONTENT */}
        <main className="p-6 space-y-6">

          {/* Small summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Dashboard title="Total Stock Value" value="$4.25M" />
            <Dashboard title="Warehouse Usage" value="81%" />
            <Dashboard title="Return Rate" value="2.9%" />
          </div>

          {/* 🔥 IMAGE DASHBOARD (GRAPHS + TABLES) */}
          <InventoryOverview />

        </main>
      </div>
    </div>
  );
}

/* ================= APP ROUTES ================= */
function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Auth pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        {/* <Route path="/dashboard" element={<DashboardLayout />} /> */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* Other pages */}
        <Route path="/FileUpload" element={<FileUpload />} />
        <Route path="/admin-chat" element={<AdminChat />} />
        <Route path="/user-chat" element={<UserChat />} />
        <Route path="stock" element={<StockDashboard />} />
        <Route path="/view" element={<StoreAdminView />} />
        


      </Routes>
    </Router>
  );
}

export default App;

