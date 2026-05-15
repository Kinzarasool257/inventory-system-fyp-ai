// client/src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificationContext = createContext(null);

// Notification categories matching the FYP proposal
export const NOTIF_TYPES = {
  LOW_STOCK: "low_stock",
  EXPIRY: "expiry",
  ANOMALY: "anomaly",
  FRAUD: "fraud",
  DEMAND_FORECAST: "demand_forecast",
  DYNAMIC_PRICING: "dynamic_pricing",
  FAULT_DETECTED: "fault_detected",
  SYSTEM: "system",
};

// Severity drives color + sort priority
export const SEVERITY = {
  CRITICAL: "critical", // red    — fraud, expired stock, anomalies
  WARNING: "warning",   // amber  — low stock, fault detected
  INFO: "info",         // blue   — pricing, forecast suggestions
};

export const NotificationProvider = ({ children, role = "admin", warehouseId = null }) => {
  const [notifications, setNotifications] = useState([]);
  const [toastQueue, setToastQueue] = useState([]);

  // Load from localStorage on mount so notifications persist across reloads
  useEffect(() => {
    const stored = localStorage.getItem(`notifications_${role}_${warehouseId || "all"}`);
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored notifications", e);
      }
    }
  }, [role, warehouseId]);

  // Persist whenever notifications change
  useEffect(() => {
    localStorage.setItem(
      `notifications_${role}_${warehouseId || "all"}`,
      JSON.stringify(notifications.slice(0, 100)) // cap at 100 to avoid bloat
    );
  }, [notifications, role, warehouseId]);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: notif.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      type: notif.type || NOTIF_TYPES.SYSTEM,
      severity: notif.severity || SEVERITY.INFO,
      title: notif.title,
      message: notif.message,
      warehouse: notif.warehouse || null,
      timestamp: notif.timestamp || new Date().toISOString(),
      read: false,
      meta: notif.meta || {},
    };

    setNotifications((prev) => [newNotif, ...prev]);
    setToastQueue((prev) => [...prev, newNotif]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToastQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Filter by warehouse for managers; admin sees everything
  const visibleNotifications =
    role === "admin"
      ? notifications
      : notifications.filter((n) => !n.warehouse || n.warehouse === warehouseId);

  const unreadCount = visibleNotifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
        unreadCount,
        toastQueue,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAll,
        dismissToast,
        role,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotifications must be used inside NotificationProvider");
  return ctx;
};