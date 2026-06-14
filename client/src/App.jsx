import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 🔐 Authentication Components (pages/auth/)
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";

// 🏗️ Shared Core Layout Components (components/common/)
import Sidebar from "./components/common/sidebar"; 
import Header from "./components/common/header";   
import Dashboard from "./pages/manager/dashboard"; 

// 📊 Data Visualization Features (components/charts/)
import InventoryOverview from "./components/charts/graphs"; 

// 📂 Operational Assets & Forms (components/forms/)
import FileUpload from "./components/forms/FileUpload";

// 🏪 Warehouse Management Panes (pages/manager/ & pages/admin/)
import StoreAdminView from "./pages/manager/StoreDashboardView"; 
import AdminChat from "./pages/admin/AdminChat";
import UserChat from "./pages/shared/UserChat";
import StockDashboard from "./pages/shared/StockDashboard";
import Chatbot from "./pages/manager/chatbot/chatbot"
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

          {/* GRAPHS + TABLES */}
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chatbot" element={<Chatbot />} />
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