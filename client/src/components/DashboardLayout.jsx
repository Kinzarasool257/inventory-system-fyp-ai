import Sidebar from "./sidebar";
import Header from "./header";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Right Section */}
      <div className="flex-1 bg-[#171A30] flex flex-col">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}

export default DashboardLayout;