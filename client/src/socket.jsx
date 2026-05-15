import { io } from "socket.io-client";
import { useEffect } from "react";
import { useNotifications } from "./context/NotificationContext";

// ✅ Existing socket connection (UNCHANGED)
const socket = io("http://localhost:3002", {
  transports: ["websocket"],
});

// 🔔 NEW: Hook to listen for real-time notifications from backend
// Call this once inside your main dashboard component:
//   useSocketNotifications();
//
// Your backend should emit events like:
//   socket.emit("notification:new", {
//     type: "low_stock",
//     severity: "warning",
//     title: "Low stock on Book_1",
//     message: "Only 12 units left in Warehouse 1",
//     warehouse: "Warehouse 1"
//   });
export const useSocketNotifications = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    const handleNewNotification = (data) => {
      addNotification(data);
    };

    socket.on("notification:new", handleNewNotification);

    return () => {
      socket.off("notification:new", handleNewNotification);
    };
  }, [addNotification]);
};

export default socket;