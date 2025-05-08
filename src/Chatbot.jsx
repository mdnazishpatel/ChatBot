import React, { useState, useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatBot.css";

const genAI = new GoogleGenerativeAI("AIzaSyBqlhzr_wkgBWPmxMPardwDPw7F82VYA_8");

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom of messages when new messages or loading state changes
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);
    setInput("");
    setLoading(true);
    setShowIntro(false);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(userMessage);
      const response = result.response.text();

      setMessages((prev) => [
        ...prev,
        { type: "ai", text: formatResponse(response) },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: "ai", text: "⚠️ Something went wrong. Please try again later." },
      ]);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatResponse = (text) => {
    return text
      .split("\n")
      .filter((line) => line.trim() !== "")
      .map((line, i) => <div key={i}>{line.replace(/\*/g, "•")}</div>);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="header-left">
          <div className="logo-pulse"></div>
          <h2>Sikandar's AI Assistant</h2>
        </div>
        <div className="header-right">
          <div className="status-indicator online"></div>
          <span>Online</span>
        </div>
      </div>

      <div className="chat-box">
        {showIntro && (
          <div className="intro-message">
            <div className="intro-icon">🤖</div>
            <h3>Welcome to Sikandar's AI Assistant</h3>
            <p>I'm here to help answer your questions and assist with information.</p>
            <div className="suggestion-chips">
              <button onClick={() => setInput("Tell me a fun fact")}>
                Tell me a fun fact
              </button>
              <button onClick={() => setInput("What can you help me with?")}>
                What can you help me with?
              </button>
              <button onClick={() => setInput("How does AI work?")}>
                How does AI work?
              </button>
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`message-wrapper ${msg.type}-wrapper`}>
            <div className={`avatar ${msg.type}-avatar`}>
              {msg.type === "user" ? "👤" : "🤖"}
            </div>
            <div className={`message ${msg.type}`}>
              {typeof msg.text === "string" ? msg.text : msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <div className="message-wrapper ai-wrapper">
            <div className="avatar ai-avatar">🤖</div>
            <div className="message ai typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="input-area">
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="chat-input"
          placeholder="Ask me anything..."
          rows={1}
        />
        <button 
          onClick={sendMessage} 
          className={`send-button ${input.trim() ? "active" : ""}`}
          disabled={!input.trim()}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </button>
      </div>

      <footer className="chat-footer">
        <div className="footer-pulse"></div>
        <p>Designed with 💙 by Sikandar | Premium AI Experience</p>
      </footer>
    </div>
  );
}

export default ChatBot;
