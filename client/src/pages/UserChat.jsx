import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import socket from "../socket";

export default function UserChat() {
  const { user } = useAuth();

  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesEndRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Socket join + listen admin messages
  useEffect(() => {
    if (!user) return;

    socket.emit("join", {
      role: "user",
      userId: user.id,
    });

    const handler = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    socket.on("newAdminMessage", handler);

    return () => socket.off("newAdminMessage", handler);
  }, [user]);

  // Send message
  const sendMessage = () => {
    if (!msg.trim()) return;

    socket.emit("userMessage", {
      userId: user.id,
      name: user.name,
      message: msg,
    });

    setMessages((prev) => [
      ...prev,
      { message: msg, sender: "user" },
    ]);

    setMsg("");
  };

  if (!user) return <p>Loading chat...</p>;

  return (
    <div
      style={{
        height: "90vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f3f4f6",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* CHAT CARD */}
      <div
        style={{
          width: "420px",
          height: "100%",
          background: "#ffffff",
          borderRadius: "14px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 8px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "14px",
            background: "#16a34a",
            color: "#ffffff",
            fontWeight: "600",
            textAlign: "center",
            borderTopLeftRadius: "14px",
            borderTopRightRadius: "14px",
          }}
        >
          Chat with Admin
        </div>

        {/* MESSAGES */}
        <div
          style={{
            flexGrow: 1,
            padding: "14px",
            overflowY: "auto",
            background: "#f9fafb",
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent:
                  m.sender === "user"
                    ? "flex-end"
                    : "flex-start",
                marginBottom: "10px",
              }}
            >
              <div
                style={{
                  padding: "10px 14px",
                  borderRadius: "18px",
                  background:
                    m.sender === "user"
                      ? "#16a34a"
                      : "#e5e7eb",
                  color:
                    m.sender === "user"
                      ? "#ffffff"
                      : "#111827",
                  maxWidth: "75%",
                  fontSize: "14px",
                  lineHeight: "1.4",
                  boxShadow:
                    "0 2px 5px rgba(0,0,0,0.1)",
                }}
              >
                {m.message}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div
          style={{
            padding: "12px",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type a message..."
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "999px",
              border: "1px solid #d1d5db",
              outline: "none",
              fontSize: "14px",
            }}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
          />

          <button
            onClick={sendMessage}
            style={{
              padding: "10px 18px",
              borderRadius: "999px",
              border: "none",
              background: "#16a34a",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
              boxShadow:
                "0 3px 6px rgba(0,0,0,0.15)",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
