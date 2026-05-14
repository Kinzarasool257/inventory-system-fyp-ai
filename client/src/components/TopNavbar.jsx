import React, { useState } from 'react';
import { Bell, Menu, Truck, BrainCircuit, ShieldAlert, AlertTriangle, User } from 'lucide-react';

const TopNavbar = ({ setSidebarOpen, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, type: 'Logistics', msg: 'Shipment #402 dispatched from Warehouse 01', time: '5m ago', icon: <Truck size={14}/>, color: 'blue' },
    { id: 2, type: 'Smart Alert', msg: 'System: Product "Books_1" likely to go out of stock in 2 days', time: '12m ago', icon: <BrainCircuit size={14}/>, color: 'indigo' },
    { id: 3, type: 'Incident', msg: 'WH3: Inventory mismatch detected for Product ID 102', time: '1h ago', icon: <ShieldAlert size={14}/>, color: 'rose' },
    { id: 4, type: 'Operational', msg: 'WH2: Item "Milk Pack" is below threshold (5 units left)', time: '2h ago', icon: <AlertTriangle size={14}/>, color: 'amber' }
  ];

  return (
    <nav className="h-20 bg-[#e2eff5]/80 backdrop-blur-md border-b border-[#d1e2e8] flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors">
          <Menu size={20} className="text-[#2b3a4a]"/>
        </button>
        {/* Updated Title: Welcome Admin ! (Italicized and Professional) */}
        <h2 className="text-xl font-black italic text-[#4b7291] tracking-tight text-left">
          Welcome Admin !
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* NOTIFICATION CENTER */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-white border-2 border-[#2b3a4a] text-[#2b3a4a] rounded-xl hover:bg-slate-50 transition-all relative shadow-sm"
          >
            <Bell size={22} strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ff8a8a] rounded-full border-2 border-[#e2eff5]"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-[#d1e2e8] overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc] flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#2b3a4a]">System Intelligence Notifications</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-5 border-b border-[#f1f5f9] hover:bg-[#e2eff5]/30 transition-colors flex gap-4">
                    {/* Icon color changed to match the Bell Icon color (#4b7291) */}
                    <div className={`p-3 bg-white text-[#4b7291] border border-[#d1e2e8] rounded-xl h-fit shadow-sm`}>{n.icon}</div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        {/* Text labels updated to the Bell color theme */}
                        <span className={`text-[9px] font-black uppercase text-[#4b7291]`}>{n.type}</span>
                        <span className="text-[9px] font-bold text-[#94a3b8]">{n.time}</span>
                      </div>
                      <p className="text-xs font-bold text-[#2b3a4a] leading-relaxed">{n.msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ADMIN PROFILE SECTION */}
        <div className="relative">
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-4 border-l border-[#d1e2e8] cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black uppercase text-[#2b3a4a] tracking-tighter leading-none">Maham Ahmed</p>
              {/* Email color updated to match the Bell color theme */}
              <p className="text-[9px] font-bold text-[#4b7291]">maham26@gmail.com</p>
            </div>
            {/* User Icon Background updated to match the Bell color theme (#4b7291) */}
            <div className="w-10 h-10 rounded-2xl bg-[#4b7291] text-white flex items-center justify-center font-black shadow-lg group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-[#d1e2e8] p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#f1f5f9]">
                    <p className="text-[10px] font-black uppercase text-[#94a3b8]">Account Role</p>
                    <p className="text-xs font-bold text-[#2b3a4a]">System Administrator</p>
                </div>
                <button className="w-full text-left p-3 hover:bg-[#e2eff5]/50 rounded-2xl text-xs font-bold text-[#4b7291] transition-colors">Profile Settings</button>
                <button className="w-full text-left p-3 hover:bg-red-50 rounded-2xl text-xs font-bold text-[#ff8a8a] transition-colors">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;