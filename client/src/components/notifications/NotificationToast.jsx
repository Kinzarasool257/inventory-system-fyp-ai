// client/src/components/NotificationToast.jsx
import { useEffect } from "react";
import { useNotifications, SEVERITY, NOTIF_TYPES } from "../../context/NotificationContext";

const severityConfig = {
  [SEVERITY.CRITICAL]: {
    accent: "from-rose-500 to-red-600",
    ring: "ring-rose-200",
    text: "text-rose-900",
  },
  [SEVERITY.WARNING]: {
    accent: "from-amber-400 to-orange-500",
    ring: "ring-amber-200",
    text: "text-amber-900",
  },
  [SEVERITY.INFO]: {
    accent: "from-sky-400 to-blue-500",
    ring: "ring-sky-200",
    text: "text-sky-900",
  },
};

const typeIcons = {
  [NOTIF_TYPES.LOW_STOCK]: "📦",
  [NOTIF_TYPES.EXPIRY]: "⏰",
  [NOTIF_TYPES.ANOMALY]: "⚠️",
  [NOTIF_TYPES.FRAUD]: "🚨",
  [NOTIF_TYPES.DEMAND_FORECAST]: "📈",
  [NOTIF_TYPES.DYNAMIC_PRICING]: "💰",
  [NOTIF_TYPES.FAULT_DETECTED]: "🔧",
  [NOTIF_TYPES.SYSTEM]: "🔔",
};

const Toast = ({ notif, onDismiss }) => {
  const cfg = severityConfig[notif.severity] || severityConfig[SEVERITY.INFO];
  const icon = typeIcons[notif.type] || "🔔";

  // Auto-dismiss after 6 seconds (critical stays 10s)
  useEffect(() => {
    const duration = notif.severity === SEVERITY.CRITICAL ? 10000 : 6000;
    const timer = setTimeout(() => onDismiss(notif.id), duration);
    return () => clearTimeout(timer);
  }, [notif.id, notif.severity, onDismiss]);

  return (
    <div
      className={`relative w-[360px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl ring-1 ${cfg.ring} overflow-hidden`}
      style={{ animation: "slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)" }}
    >
      {/* Accent gradient bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${cfg.accent}`} />

      {/* Progress bar (countdown) */}
      <div
        className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r ${cfg.accent}`}
        style={{
          animation: `shrink ${notif.severity === SEVERITY.CRITICAL ? 10 : 6}s linear forwards`,
        }}
      />

      <div className="p-4 pl-5 flex items-start gap-3">
        <div className="text-2xl flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-bold ${cfg.text}`}>{notif.title}</p>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{notif.message}</p>
          {notif.warehouse && (
            <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
              {notif.warehouse}
            </span>
          )}
        </div>
        <button
          onClick={() => onDismiss(notif.id)}
          className="text-slate-400 hover:text-slate-700 transition p-0.5"
          aria-label="Dismiss"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const NotificationToast = () => {
  const { toastQueue, dismissToast } = useNotifications();

  // Show only the latest 3 toasts
  const visible = toastQueue.slice(-3);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-auto">
        {visible.map((notif) => (
          <Toast key={notif.id} notif={notif} onDismiss={dismissToast} />
        ))}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(40px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes shrink {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
    </>
  );
};

export default NotificationToast;