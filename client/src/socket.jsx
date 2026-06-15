import { io } from "socket.io-client";

// 🌐 Dynamic Backend Path Fallback configuration matching your production Railway server path
const baseUrl = import.meta.env.VITE_API_BASE_URL || "https://inventory-system-fyp-ai-production.up.railway.app";

// ✅ Production-ready dynamic socket cluster connection point initialization
const socket = io(baseUrl, {
  transports: ["websocket"],
});

export default socket;