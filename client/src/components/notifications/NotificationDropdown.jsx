// client/src/components/NotificationDropdown.jsx
import { useNavigate } from "react-router-dom";
import { useNotifications, SEVERITY, NOTIF_TYPES } from "../context/NotificationContext";

// Icon + color mapping per notification type
const typeConfig = {
  [NOTIF_TYPES.LOW_STOCK]: {
    icon: "📦",
    label: "Low Stock",
  },
  [NOTIF_TYPES.EXPIRY]: {
    icon: "⏰",
    label: "Expiry Alert",
  },
  [NOTIF_TYPES.ANOMALY]: {
    icon: "⚠️",
    label: "Anomaly",
  },
  [NOTIF_TYPES.FRAUD]: {
    icon: "🚨",
    label: "Fraud Detected",
  },
  [NOTIF_TYPES.DEMAND_FORECAST]: {
    icon: "📈",
    label: "Demand Forecast",
  },
  [NOTIF_TYPES.DYNAMIC_PRICING]: {
    icon: "💰",
    label: "Pricing Update",
  },
  [NOTIF_TYPES.FAULT_DETECTED]: {
    icon: "🔧",
    label: "Faulty Product",
  },
  [NOTIF_TYPES.SYSTEM]: {
    icon: "🔔",
    label: "System",
  },
};

const severityStyles = {
  [SEVERITY.CRITICAL]: "border-l-rose-500 bg-rose-50/50",
  [SEVERITY.WARNING]: "border-l-amber-500 bg-amber-50/50",
  [SEVERITY.INFO]: "border-l-sky-500 bg-sky-50/50",
};

const severityDot = {
  [SEVERITY.CRITICAL]: "bg-rose-500",
  [SEVERITY.WARNING]: "bg-amber-500",
  [SEVERITY.INFO]: "bg-sky-500",
};

// Relative time formatter
const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const NotificationDropdown = ({ onClose }) => {
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const handleItemClick = (notif) => {
    markAsRead(notif.id);
    // Optional: route to specific page based on type
    // e.g. if (notif.type === NOTIF_TYPES.LOW_STOCK) navigate(`/inventory/${notif.warehouse}`);
  };

  return (
    <div
      className="absolute right-0 top-full mt-3 w-[400px] max-h-[560px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ring-slate-200/60 overflow-hidden z-50 animate-slide-down"
      style={{ animation: "slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/70 bg-gradient-to-r from-slate-50 to-white flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-base tracking-tight">
            Notifications
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {unreadCount === 0
              ? "All caught up"
              : `${unreadCount} unread ${unreadCount === 1 ? "alert" : "alerts"}`}
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline transition"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
        {notifications.length === 0 ? (
          <div className="px-5 py-12 text-center">
            <div className="text-5xl mb-3 opacity-40">🔔</div>
            <p className="text-sm text-slate-500 font-medium">No notifications yet</p>
            <p className="text-xs text-slate-400 mt-1">
              Stock alerts and anomalies will appear here
            </p>
          </div>
        ) : (
          notifications.slice(0, 20).map((notif) => {
            const cfg = typeConfig[notif.type] || typeConfig[NOTIF_TYPES.SYSTEM];
            return (
              <div
                key={notif.id}
                onClick={() => handleItemClick(notif)}
                className={`group relative px-5 py-3.5 border-l-4 cursor-pointer transition-all hover:bg-slate-50/80 ${
                  severityStyles[notif.severity]
                } ${!notif.read ? "" : "opacity-70"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl flex-shrink-0 mt-0.5">{cfg.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                        {cfg.label}
                      </span>
                      {!notif.read && (
                        <span className={`w-1.5 h-1.5 rounded-full ${severityDot[notif.severity]}`} />
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-800 leading-snug">
                      {notif.title}
                    </p>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                      {notif.message}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {notif.warehouse && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                          {notif.warehouse}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400 font-medium">
                        {timeAgo(notif.timestamp)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeNotification(notif.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition p-1"
                    aria-label="Dismiss"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="px-5 py-3 border-t border-slate-200/70 bg-slate-50/60 flex items-center justify-between">
          <button
            onClick={clearAll}
            className="text-xs font-semibold text-slate-500 hover:text-rose-600 transition"
          >
            Clear all
          </button>
          <button
            onClick={() => {
              onClose();
              navigate("/notifications");
            }}
            className="text-xs font-bold text-sky-600 hover:text-sky-700 transition"
          >
            View all →
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.5);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;