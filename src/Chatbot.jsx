import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "./ChatBot.css"; // External CSS for styling

const genAI = new GoogleGenerativeAI("AIzaSyBqlhzr_wkgBWPmxMPardwDPw7F82VYA_8");

function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prev) => [...prev, { type: "user", text: input }]);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(input);
    const response = await result.response;
    const text = response.text();

    setMessages((prev) => [
      ...prev,
      { type: "ai", text: formatResponse(text) },
    ]);
    setInput("");
  };

  const formatResponse = (text) => {
    return text.replace(/\n/g, "<br/>").replace(/\*/g, "•");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-title">🤖 Sikandar's ChatBot</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`message ${msg.type}`}
            dangerouslySetInnerHTML={{ __html: msg.text }}
          />
        ))}
      </div>
      <div className="input-area">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          className="chat-input"
          placeholder="Ask anything..."
        />
        <button onClick={sendMessage} className="send-button">
          Send
        </button>
      </div>
      <footer className="chat-footer">
        <p>🖤 Designed by Sikandar | A Simple ChatBot Project</p>
      </footer>
    </div>
  );
}

export default ChatBot;
