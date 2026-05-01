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
    <nav className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-slate-100 rounded-lg">
          <Menu size={20}/>
        </button>
        <h2 className="text-sm font-black uppercase text-slate-400 tracking-widest text-left">Admin Console</h2>
      </div>

      <div className="flex items-center gap-6">
        {/* NOTIFICATION CENTER */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all relative"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">System Intelligence Notifications</h3>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-5 border-b border-slate-50 hover:bg-slate-50 transition-colors flex gap-4">
                    <div className={`p-3 bg-${n.color}-50 text-${n.color}-600 rounded-xl h-fit`}>{n.icon}</div>
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-[9px] font-black uppercase text-${n.color}-600`}>{n.type}</span>
                        <span className="text-[9px] font-bold text-slate-400">{n.time}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed">{n.msg}</p>
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
            className="flex items-center gap-3 pl-4 border-l border-slate-200 cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black uppercase text-slate-800 tracking-tighter leading-none">Maham Ahmed</p>
              <p className="text-[9px] font-bold text-indigo-600">maham26@gmail.com</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-lg shadow-indigo-100 group-hover:scale-105 transition-transform">
              <User size={20} />
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-slate-50">
                    <p className="text-[10px] font-black uppercase text-slate-400">Account Role</p>
                    <p className="text-xs font-bold text-slate-800">System Administrator</p>
                </div>
                <button className="w-full text-left p-3 hover:bg-slate-50 rounded-2xl text-xs font-bold text-slate-600 transition-colors">Profile Settings</button>
                <button className="w-full text-left p-3 hover:bg-rose-50 rounded-2xl text-xs font-bold text-rose-600 transition-colors">Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;