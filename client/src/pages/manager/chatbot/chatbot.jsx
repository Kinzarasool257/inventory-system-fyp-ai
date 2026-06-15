import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Bot, User, Send, ArrowLeft, Trash2 } from 'lucide-react';
import bgImage from "../../../images/bg.jpg";
// 🪙 Custom project logo asset import link
import projectLogo from "../../../assets/Smart Stock (4).png";
import "./chatbot.css";

export default function Chatbot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeting, setGreeting] = useState("Good day");
  
  const chatBoxEndRef = useRef(null);
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://inventory-system-fyp-ai-production.up.railway.app';

  useEffect(() => {
    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting("Good morning");
    else if (hrs < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  useEffect(() => {
    chatBoxEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${baseUrl}/chatbot`, {
        question: currentInput,
      });

      const botMessage = {
        role: "bot",
        text: res.data.answer,
        data: res.data.data || null,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "❌ Connection timeout or database error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="chatbot-screen-wrapper"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="chatbot-dark-overlay"></div>

      {/* FIXED TRANSPARENT TOP HEADER CONTROL BAR */}
      <header className="chatbot-header-clean">
        <button onClick={() => navigate(-1)} className="header-back-minimal">
          <ArrowLeft size={16} />
        </button>
        
        {/* CUSTOM PNG IMAGE BRANDING NODE */}
        <div className="header-central-brand">
          <img src={projectLogo} alt="SmartStock Logo" className="brand-image-logo" />
          <span>SmartStock Manager</span>
        </div>

        <button onClick={() => setMessages([])} className="header-clear-minimal">
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </header>

      {/* CLEAN CENTERED SINGLE WORKSPACE VIEWPORT */}
      <div className="chatbot-body-layout-centered">
        <div className="chatbot-main-workspace-wrapper">
          <div className="chatbot-messages-workspace custom-scrollbar">
            {messages.length === 0 ? (
              <div className="chatbot-hero-view">
                <h1 className="hero-greeting-text">
                  {greeting},<br />
                  <span className="hero-accent-text">What can I help you with today?</span>
                </h1>
                
                {/* 🎯 UPDATED CHIP MATRICES LOADED FROM YOUR TESTING PROMPTS */}
                <div className="hero-suggestion-matrix">
                  <button onClick={() => setInput("Show dead stock products")} className="suggestion-pill">Show dead stock products</button>
                  <button onClick={() => setInput("Total revenue generated")} className="suggestion-pill">Total revenue generated</button>
                  <button onClick={() => setInput("Which top 5 products sold the most?")} className="suggestion-pill">Which top 5 products sold the most?</button>
                </div>
              </div>
            ) : (
              <div className="messages-flow-container">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-row-node ${msg.role === "user" ? "user-row" : "bot-row"}`}>
                    
                    {msg.role === "bot" && (
                      <div className="avatar-wrapper bot-avatar">
                        <Bot size={14} />
                      </div>
                    )}

                    <div className="message-bubble-wrapper">
                      <div className="message-text-content">{msg.text}</div>

                      {/* Attached Analytics Report Data Grid Matrix */}
                      {msg.data && Array.isArray(msg.data) && msg.data.length > 0 && (
                        <div className="message-attached-table-wrapper">
                          <div className="table-scroll-axis">
                            <table>
                              <thead>
                                <tr>
                                  {Object.keys(msg.data[0]).map((key) => (
                                    <th key={key}>{key.replace(/_/g, " ")}</th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody>
                                {msg.data.map((row, idx) => (
                                  <tr key={idx}>
                                    {Object.values(row).map((val, i) => (
                                      <td key={i}>{typeof val === 'number' ? val.toLocaleString() : String(val)}</td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>

                    {msg.role === "user" && (
                      <div className="avatar-wrapper user-avatar">
                        <User size={14} />
                      </div>
                    )}

                  </div>
                ))}
              </div>
            )}

            {loading && (
              <div className="chat-row-node bot-row loading-row-node">
                <div className="avatar-wrapper bot-avatar">
                  <Bot size={14} />
                </div>
                <div className="loading-bubble-animation">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={chatBoxEndRef} />
          </div>

          {/* CHAT INPUT BAR CONTAINER */}
          <footer className="chatbot-control-footer-floating">
            <div className="floating-input-wrapper">
              <input
                value={input}
                disabled={loading}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Ask anything about stock metrics, predictive analysis..."
                className="chatbot-terminal-input-minimal"
              />
              <button 
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className="chatbot-terminal-send-btn-minimal"
              >
                <Send size={14} />
              </button>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}