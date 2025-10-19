import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import axios from "axios";
import { API } from "../App";

const Chatbot = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Olá! Sou o assistente virtual da LuxDrop.pt. Como posso ajudar?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post(`${API}/ai/chatbot`, {
        message: userMessage,
        session_id: sessionId
      });

      setMessages(prev => [...prev, { role: "assistant", content: response.data.response }]);
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Desculpe, ocorreu um erro. Por favor, tente novamente ou contacte support@luxdrop.pt" 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all hover:scale-110 z-50"
        data-testid="chatbot-open-btn"
      >
        <MessageCircle className="w-6 h-6 text-black" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[500px] glass rounded-2xl shadow-2xl flex flex-col z-50" data-testid="chatbot-window">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#D4AF37] to-[#FFD700] p-4 rounded-t-2xl flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-black" />
          <h3 className="font-bold text-black" data-testid="chatbot-title">Assistente LuxDrop</h3>
        </div>
        <button 
          onClick={onClose} 
          className="p-1 hover:bg-black/10 rounded-full transition-colors"
          data-testid="chatbot-close-btn"
        >
          <X className="w-5 h-5 text-black" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" data-testid="chatbot-messages">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            data-testid={`chat-message-${idx}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === "user"
                  ? "bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-black"
                  : "bg-white/10 text-white"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start" data-testid="chatbot-loading">
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-[#D4AF37] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white/10">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escreva a sua mensagem..."
            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-[#D4AF37] text-sm"
            disabled={loading}
            data-testid="chatbot-input"
          />
          <button
            onClick={sendMessage}
            disabled={loading || !input.trim()}
            className="btn-gold px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="chatbot-send-btn"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;