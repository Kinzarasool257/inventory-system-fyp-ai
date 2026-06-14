// client/src/context/NotificationContext.jsx
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const NotificationContext = createContext(null);

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

export const SEVERITY = {
  CRITICAL: "critical",
  WARNING: "warning",
  INFO: "info",
};

export const NotificationProvider = ({ children, role = "admin", warehouseId = null }) => {
  const [notifications, setNotifications] = useState([]);
  const [toastQueue, setToastQueue] = useState([]);

  // 🔧 FIX: Track seen IDs in a ref to deduplicate without re-renders
  const seenIdsRef = useRef(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(`notifications_${role}_${warehouseId || "all"}`);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setNotifications(parsed);
        // Rebuild the seen IDs set from stored notifications
        parsed.forEach(n => seenIdsRef.current.add(n.id));
      } catch (e) {
        console.error("Failed to parse stored notifications", e);
      }
    }
  }, [role, warehouseId]);

  // Persist whenever notifications change
  useEffect(() => {
    localStorage.setItem(
      `notifications_${role}_${warehouseId || "all"}`,
      JSON.stringify(notifications.slice(0, 100))
    );
  }, [notifications, role, warehouseId]);

  const addNotification = useCallback((notif) => {
    const id = notif.id || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // 🔧 FIX: Deduplicate using ref — no re-render needed
    if (seenIdsRef.current.has(id)) {
      return; // already added, skip
    }
    seenIdsRef.current.add(id);

    const newNotif = {
      id,
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
    seenIdsRef.current.clear();
  }, []);

  const dismissToast = useCallback((id) => {
    setToastQueue((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // 🔧 FIX: More flexible warehouse matching
  // Admin sees everything. Manager sees:
  //   - notifications with no warehouse (system-wide)
  //   - notifications matching their warehouseId in ANY format
  const visibleNotifications =
    role === "admin"
      ? notifications
      : notifications.filter((n) => {
          if (!n.warehouse) return true; // system-wide
          if (!warehouseId) return true; // no warehouse set, show all
          // Normalize: "WH-1" === "WH-1", "Warehouse 1" matches "warehouse 1", etc.
          const notifWh = String(n.warehouse).toLowerCase().replace(/[\s-_]/g, "");
          const userWh = String(warehouseId).toLowerCase().replace(/[\s-_]/g, "");
          return notifWh.includes(userWh) || userWh.includes(notifWh);
        });

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