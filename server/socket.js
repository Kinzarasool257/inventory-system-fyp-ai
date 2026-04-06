module.exports = (io) => {
  console.log("✅ socket.js file LOADED successfully");

  io.on("connection", (socket) => {
    console.log("🔌 Socket CONNECTED:", socket.id);

    // ===============================
    // JOIN ROOM (ADMIN / USER)
    // ===============================
    socket.on("join", ({ userId, role }) => {
      console.log("📥 JOIN EVENT RECEIVED:", role, userId);

      if (role === "admin") {
        socket.join("admins");
        console.log("👑 Admin joined admins room");
      } else {
        socket.join(`user_${userId}`);
        console.log("👤 User joined room:", `user_${userId}`);
      }
    });

    // ===============================
    // USER → ADMIN MESSAGE
    // ===============================
    socket.on("userMessage", ({ userId, name, message }) => {
      console.log("💬 USER MESSAGE RECEIVED:", {
        userId,
        name,
        message,
      });

      io.to("admins").emit("newUserMessage", {
        userId,
        name,
        message,
        sender: "user",
      });
    });

    // ===============================
    // ADMIN → USER MESSAGE
    // ===============================
    socket.on("adminMessage", ({ userId, message }) => {
      console.log("📤 ADMIN MESSAGE TO USER:", userId);

      io.to(`user_${userId}`).emit("newAdminMessage", {
        message,
        sender: "admin",
      });
    });

    // ===============================
    // DISCONNECT
    // ===============================
    socket.on("disconnect", () => {
      console.log("❌ Socket DISCONNECTED:", socket.id);
    });
  });
};
