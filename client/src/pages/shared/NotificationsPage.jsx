// client/src/pages/NotificationsPage.jsx
import { useState, useMemo } from "react";
import { useNotifications, SEVERITY, NOTIF_TYPES } from "../../context/NotificationContext";

const typeMeta = {
  [NOTIF_TYPES.LOW_STOCK]: { icon: "📦", label: "Low Stock" },
  [NOTIF_TYPES.EXPIRY]: { icon: "⏰", label: "Expiry" },
  [NOTIF_TYPES.ANOMALY]: { icon: "⚠️", label: "Anomaly" },
  [NOTIF_TYPES.FRAUD]: { icon: "🚨", label: "Fraud" },
  [NOTIF_TYPES.DEMAND_FORECAST]: { icon: "📈", label: "Forecast" },
  [NOTIF_TYPES.DYNAMIC_PRICING]: { icon: "💰", label: "Pricing" },
  [NOTIF_TYPES.FAULT_DETECTED]: { icon: "🔧", label: "Fault" },
  [NOTIF_TYPES.SYSTEM]: { icon: "🔔", label: "System" },
};

const severityBadge = {
  [SEVERITY.CRITICAL]: "bg-rose-100 text-rose-700 border-rose-200",
  [SEVERITY.WARNING]: "bg-amber-100 text-amber-700 border-amber-200",
  [SEVERITY.INFO]: "bg-sky-100 text-sky-700 border-sky-200",
};

const formatDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const NotificationsPage = () => {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  } = useNotifications();

  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      if (filterType !== "all" && n.type !== filterType) return false;
      if (filterSeverity !== "all" && n.severity !== filterSeverity) return false;
      if (showUnreadOnly && n.read) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          n.title.toLowerCase().includes(q) ||
          n.message.toLowerCase().includes(q) ||
          (n.warehouse && n.warehouse.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [notifications, filterType, filterSeverity, showUnreadOnly, searchQuery]);

  const stats = useMemo(
    () => ({
      total: notifications.length,
      unread: notifications.filter((n) => !n.read).length,
      critical: notifications.filter((n) => n.severity === SEVERITY.CRITICAL).length,
    }),
    [notifications]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-slate-100 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-end justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight">
              Notification Center
            </h1>
            <p className="text-slate-500 mt-1">
              All your alerts, anomalies, and system updates
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 rounded-xl bg-white/70 backdrop-blur ring-1 ring-slate-200 hover:bg-white text-sm font-semibold text-slate-700 transition shadow-sm"
            >
              Mark all read
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl bg-rose-50 ring-1 ring-rose-200 hover:bg-rose-100 text-sm font-semibold text-rose-700 transition shadow-sm"
            >
              Clear all
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 ring-1 ring-slate-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 ring-1 ring-sky-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-sky-600">Unread</p>
            <p className="text-3xl font-black text-sky-700 mt-1">{stats.unread}</p>
          </div>
          <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 ring-1 ring-rose-200 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-rose-600">Critical</p>
            <p className="text-3xl font-black text-rose-700 mt-1">{stats.critical}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/70 backdrop-blur-md rounded-2xl p-5 ring-1 ring-slate-200 shadow-sm mb-6">
          <div className="flex flex-wrap gap-3 items-center">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 min-w-[200px] px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All types</option>
              {Object.entries(typeMeta).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.icon} {meta.label}
                </option>
              ))}
            </select>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              <option value="all">All severities</option>
              <option value={SEVERITY.CRITICAL}>🔴 Critical</option>
              <option value={SEVERITY.WARNING}>🟡 Warning</option>
              <option value={SEVERITY.INFO}>🔵 Info</option>
            </select>
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 ring-1 ring-slate-200 cursor-pointer hover:bg-slate-100 transition">
              <input
                type="checkbox"
                checked={showUnreadOnly}
                onChange={(e) => setShowUnreadOnly(e.target.checked)}
                className="accent-sky-500"
              />
              <span className="text-sm font-medium text-slate-700">Unread only</span>
            </label>
          </div>
        </div>

        {/* List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-12 text-center ring-1 ring-slate-200">
              <div className="text-6xl mb-4 opacity-40">🔍</div>
              <p className="text-slate-600 font-semibold">No notifications match your filters</p>
            </div>
          ) : (
            filtered.map((notif) => {
              const meta = typeMeta[notif.type] || typeMeta[NOTIF_TYPES.SYSTEM];
              return (
                <div
                  key={notif.id}
                  onClick={() => markAsRead(notif.id)}
                  className={`group bg-white/80 backdrop-blur-md rounded-2xl p-5 ring-1 ring-slate-200 shadow-sm hover:shadow-md transition cursor-pointer ${
                    !notif.read ? "ring-sky-200 bg-sky-50/40" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl flex-shrink-0">{meta.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-bold text-slate-800">{notif.title}</h3>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-sky-500" />
                        )}
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                            severityBadge[notif.severity]
                          }`}
                        >
                          {notif.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed">{notif.message}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-slate-500">
                        <span className="font-semibold">{meta.label}</span>
                        {notif.warehouse && (
                          <>
                            <span>•</span>
                            <span className="font-medium">{notif.warehouse}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>{formatDate(notif.timestamp)}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition p-2"
                      aria-label="Delete"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a1 1 0 011-1h4a1 1 0 011 1v3" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;