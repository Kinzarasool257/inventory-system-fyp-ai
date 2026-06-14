// client/src/components/ManagerNotificationBell.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Package, Clock, ShieldAlert, BrainCircuit, DollarSign, TrendingUp, Wrench } from 'lucide-react';
import { useNotifications, NOTIF_TYPES } from '../../context/NotificationContext';

// Icon mapping per notification type
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

const typeLabelMap = {
  [NOTIF_TYPES.LOW_STOCK]: 'Low Stock',
  [NOTIF_TYPES.EXPIRY]: 'Expiry Alert',
  [NOTIF_TYPES.ANOMALY]: 'Anomaly',
  [NOTIF_TYPES.FRAUD]: 'Fraud Detected',
  [NOTIF_TYPES.DEMAND_FORECAST]: 'Smart Forecast',
  [NOTIF_TYPES.DYNAMIC_PRICING]: 'Pricing Update',
  [NOTIF_TYPES.FAULT_DETECTED]: 'Faulty Product',
  [NOTIF_TYPES.SYSTEM]: 'System',
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const ManagerNotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const wrapperRef = useRef(null);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {/* 🔔 Bell Button — styled to match the FULL INTELLIGENCE REPORT button next to it */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 bg-white border-2 border-[#2b3a4a] text-[#2b3a4a] rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        aria-label="Notifications"
      >
        <Bell size={20} strokeWidth={2.5} />
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-[#ff8a8a] rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* 🔔 Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-4 w-96 bg-white rounded-[2rem] shadow-2xl border border-[#d1e2e8] overflow-hidden animate-in fade-in zoom-in duration-200 z-50">
          {/* Header */}
          <div className="p-6 border-b border-[#f1f5f9] bg-[#f8fafc] flex justify-between items-center">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-[#2b3a4a]">
                Warehouse Alerts
              </h3>
              <p className="text-[10px] font-bold text-[#94a3b8] mt-0.5">
                {unreadCount === 0 ? 'All caught up' : `${unreadCount} unread`}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[10px] font-black uppercase tracking-wider text-[#4b7291] hover:text-[#2b3a4a] transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell size={32} className="text-[#d1e2e8] mx-auto mb-3" strokeWidth={2} />
                <p className="text-xs font-bold text-[#94a3b8]">No alerts yet</p>
                <p className="text-[10px] font-medium text-[#94a3b8] mt-1">
                  Stock & anomaly alerts will appear here
                </p>
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
                    {typeIconMap[n.type] || <BrainCircuit size={14} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-black uppercase text-[#4b7291] flex items-center gap-1.5">
                        {typeLabelMap[n.type] || 'System'}
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#ff8a8a]" />}
                      </span>
                      <span className="text-[9px] font-bold text-[#94a3b8]">
                        {timeAgo(n.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-[#2b3a4a] leading-relaxed mb-1">
                      {n.title}
                    </p>
                    <p className="text-[11px] font-medium text-[#64748b] leading-relaxed">
                      {n.message}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-4 border-t border-[#f1f5f9] bg-[#f8fafc]">
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate('/notifications');
                }}
                className="w-full text-center text-[11px] font-black uppercase tracking-wider text-[#4b7291] hover:text-[#2b3a4a] transition-colors"
              >
                View all alerts →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ManagerNotificationBell;