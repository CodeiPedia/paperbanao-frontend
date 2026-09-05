"use client";
import { useState, useRef, useEffect } from "react";
import { api } from "@/lib/api";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I'm the PaperBanao assistant. Ask me anything about features, pricing, or how to use the tool. 🙂" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const newMessages = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const history = newMessages.slice(-7, -1); // last few turns, excluding the just-added message (sent separately)
      const data = await api.supportChat(text, history);
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Sorry, something went wrong. Please email sk142464@gmail.com — or try again in a moment.` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {open && (
        <div className="chat-widget-panel">
          <div className="chat-widget-header">
            <span>💬 Ask PaperBanao</span>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="chat-widget-close">✕</button>
          </div>
          <div className="chat-widget-messages" ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble chat-bubble-${m.role}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="chat-bubble chat-bubble-assistant chat-bubble-loading">Typing…</div>}
          </div>
          <form onSubmit={handleSend} className="chat-widget-input-row">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question…"
              className="chat-widget-input"
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()} className="chat-widget-send">➤</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="chat-widget-fab"
        aria-label={open ? "Close chat" : "Open support chat"}
      >
        {open ? "✕" : "💬"}
      </button>
    </div>
  );
}
