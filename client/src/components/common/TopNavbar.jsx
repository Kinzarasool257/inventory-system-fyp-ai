import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Menu, Truck, BrainCircuit, ShieldAlert, AlertTriangle, User, Package, Clock, DollarSign, TrendingUp, Wrench } from 'lucide-react';
import { useNotifications, NOTIF_TYPES, SEVERITY } from '../../context/NotificationContext';

// 🎨 Map notification types → icons (matches your existing aesthetic)
const typeIconMap = {
  [NOTIF_TYPES.LOW_STOCK]: <Package size={14} />,
  [NOTIF_TYPES.EXPIRY]: <Clock size={14} />,
  [NOTIF_TYPES.ANOMALY]: <ShieldAlert size={14} />,
  [NOTIF_TYPES.FRAUD]: <ShieldAlert size={14} />,
  [NOTIF_TYPES.DEMAND_FORECAST]: <TrendingUp size={14} />,
  [NOTIF_TYPES.DYNAMIC_PRICING]: <DollarSign size={14} />,
  [NOTIF_TYPES.FAULT_DETECTED]: <Wrench size={14} />,
  [NOTIF_TYPES.SYSTEM]: <BrainCircuit size={14} />,
};

// 🎨 Map notification types → short labels (shown in the panel header)
const typeLabelMap = {
  [NOTIF_TYPES.LOW_STOCK]: 'Low Stock',
  [NOTIF_TYPES.EXPIRY]: 'Expiry Alert',
  [NOTIF_TYPES.ANOMALY]: 'Anomaly',
  [NOTIF_TYPES.FRAUD]: 'Fraud',
  [NOTIF_TYPES.DEMAND_FORECAST]: 'Smart Forecast',
  [NOTIF_TYPES.DYNAMIC_PRICING]: 'Pricing Update',
  [NOTIF_TYPES.FAULT_DETECTED]: 'Faulty Product',
  [NOTIF_TYPES.SYSTEM]: 'System',
};

// Relative time formatter (e.g. "5m ago")
const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const TopNavbar = ({ setSidebarOpen, isSidebarOpen }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // 🔔 Pull live notifications from the global context
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="h-20 bg-[#e2eff5]/80 backdrop-blur-md border-b border-[#d1e2e8] flex items-center justify-between px-10 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors">
          <Menu size={20} className="text-[#2b3a4a]"/>
        </button>
        <h2 className="text-xl font-black italic text-[#4b7291] tracking-tight text-left">
          Welcome Admin !
        </h2>
      </div>

      <div className="flex items-center gap-6">
        {/* NOTIFICATION CENTER */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 bg-white border-2 border-[#2b3a4a] text-[#2b3a4a] rounded-xl hover:bg-slate-50 transition-all relative shadow-sm"
          >
            <Bell size={22} strokeWidth={2.5} />
            {/* 🔔 Badge only shows when there are unread notifications */}
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#ff8a8a] rounded-full border-2 border-[#e2eff5] flex items-center justify-center text-[10px] font-black text-white">
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-[#d1e2e8] overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
              <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc] flex justify-between items-center">
                <h3 className="text-xs font-black uppercase tracking-widest text-[#2b3a4a]">System Intelligence Notifications</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[10px] font-black uppercase tracking-wider text-[#4b7291] hover:text-[#2b3a4a] transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <Bell size={32} className="text-[#d1e2e8] mx-auto mb-3" strokeWidth={2}/>
                    <p className="text-xs font-bold text-[#94a3b8]">No notifications yet</p>
                    <p className="text-[10px] font-medium text-[#94a3b8] mt-1">Alerts will appear here in real time</p>
                  </div>
                ) : (
                  notifications.slice(0, 10).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markAsRead(n.id)}
                      className={`p-5 border-b border-[#f1f5f9] hover:bg-[#e2eff5]/30 transition-colors flex gap-4 cursor-pointer ${
                        !n.read ? 'bg-[#e2eff5]/20' : ''
                      }`}
                    >
                      <div className="p-3 bg-white text-[#4b7291] border border-[#d1e2e8] rounded-xl h-fit shadow-sm">
                        {typeIconMap[n.type] || <BrainCircuit size={14}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[9px] font-black uppercase text-[#4b7291] flex items-center gap-1.5">
                            {typeLabelMap[n.type] || 'System'}
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a8a]" />}
                          </span>
                          <span className="text-[9px] font-bold text-[#94a3b8]">{timeAgo(n.timestamp)}</span>
                        </div>
                        <p className="text-xs font-bold text-[#2b3a4a] leading-relaxed mb-1">{n.title}</p>
                        <p className="text-[11px] font-medium text-[#64748b] leading-relaxed">{n.message}</p>
                        {n.warehouse && (
                          <span className="inline-block mt-2 text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-[#e2eff5] text-[#4b7291] tracking-wider">
                            {n.warehouse}
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {/* 🔔 Footer with "View all" link */}
              {notifications.length > 0 && (
                <div className="p-4 border-t border-[#f1f5f9] bg-[#f8fafc]">
                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/notifications');
                    }}
                    className="w-full text-center text-[11px] font-black uppercase tracking-wider text-[#4b7291] hover:text-[#2b3a4a] transition-colors"
                  >
                    View all notifications →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ADMIN PROFILE SECTION */}
        <div className="relative" ref={profileRef}>
          <div 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-3 pl-4 border-l border-[#d1e2e8] cursor-pointer group"
          >
            <div className="text-right hidden md:block">
              <p className="text-[11px] font-black uppercase text-[#2b3a4a] tracking-tighter leading-none">Maham Ahmed</p>
              <p className="text-[9px] font-bold text-[#4b7291]">maham26@gmail.com</p>
            </div>
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