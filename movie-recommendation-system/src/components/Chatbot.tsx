import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, Flame, Lightbulb, Star, X } from 'lucide-react';
import type { ChatMessage, Movie } from '../types';

interface ChatbotProps {
  userId: string;
  onSelectMovie: (id: number) => void;
  onClose?: () => void;
}

export default function Chatbot({ userId, onSelectMovie, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "ai",
      text: "Welcome! I am BUDDY, your AI movie companion. Ask me for recommendations based on your desired mood, particular visual style, favorite directors, or actor preferences!\n\nE.g., Try asking: 'I want a sci-fi masterpiece with high rating' or 'Suggest grand Telugu action films Starring Prabhas or Allu Arjun'.",
      timestamp: new Date().toISOString()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presetSuggestions = [
    "I want an intellectual sci-fi film",
    "Highly rated anime recommendations",
    "A romantic movie in Los Angeles",
    "Dark thrillers with a mystery"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          userId,
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] }))
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed chat request");

      const aiMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: data.text,
        timestamp: new Date().toISOString(),
        suggestedMovies: data.suggestedMovies || []
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'ai',
        text: "I experienced an error connecting to my critical systems. Please ensure the Gemini credentials match.",
        timestamp: new Date().toISOString()
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden font-sans relative shadow-2xl">
      {/* Header */}
      <div className="px-6 py-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/15 border border-blue-500/15 text-blue-500 rounded-xl">
            <Sparkles className="w-5 h-5 shadow" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white leading-none">BUDDY Chatbot</h2>
            <p className="text-[10px] uppercase font-mono text-white/30 font-semibold tracking-wider mt-1">
              Your Personalized Smart Movie Companion
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            title="Minimize Chat"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Messages Scroll Box */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((m) => {
          const isAI = m.sender === 'ai';
          return (
            <div key={m.id} className={`flex gap-3.5 max-w-[85%] ${isAI ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border uppercase font-bold text-[8px] tracking-tighter select-none shadow text-white font-sans ${
                isAI ? 'bg-blue-600/15 border-blue-500/20 text-blue-500' : 'bg-neutral-800 border-neutral-700 text-neutral-300'
              }`}>
                {isAI ? 'BUDDY' : 'ME'}
              </div>

              <div className="space-y-3 flex-1">
                <div className={`px-4.5 py-3 rounded-2xl leading-relaxed text-sm whitespace-pre-wrap ${
                  isAI
                    ? 'bg-neutral-950 border border-white/5 text-neutral-200'
                    : 'bg-blue-600 text-white shadow-md shadow-blue-950/10 font-medium'
                }`}>
                  {m.text}

                  {/* Suggested Movies Carousel Inside Chat */}
                  {isAI && m.suggestedMovies && m.suggestedMovies.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-white/5 space-y-2.5">
                      <div className="text-[10px] font-bold text-blue-500 uppercase tracking-widest font-mono flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5" />
                        Matched Search Catalog Items:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {m.suggestedMovies.map((movie) => (
                          <div
                            id={`chat_suggested_${movie.id}`}
                            key={movie.id}
                            onClick={() => onSelectMovie(movie.id)}
                            className="bg-neutral-900 hover:bg-neutral-850 p-2 border border-white/5 rounded-xl cursor-pointer flex gap-3 transition-colors duration-150 group"
                          >
                            <img
                              src={movie.posterUrl}
                              alt={movie.title}
                              referrerPolicy="no-referrer"
                              className="w-10 h-14 object-cover rounded-lg bg-neutral-950 shrink-0"
                            />
                            <div className="overflow-hidden flex flex-col justify-center">
                              <h4 className="text-xs font-bold text-white group-hover:text-blue-500 transition-colors truncate">
                                {movie.title}
                              </h4>
                              <p className="text-[10px] text-neutral-500 truncate mt-0.5">
                                {movie.director}
                              </p>
                              <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold mt-1">
                                <Star className="w-2.5 h-2.5 fill-current" />
                                <span>{movie.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3.5 max-w-[85%] mr-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border bg-blue-600/15 border-blue-500/20 text-blue-500 font-bold text-[8px] tracking-tighter select-none shadow">
              BUDDY
            </div>
            <div className="bg-neutral-950 border border-white/5 px-4 py-3.5 rounded-2xl flex items-center gap-1.5 shadow">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-150" />
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce delay-300" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestions Bar */}
      <div className="px-6 py-2 bg-[#050505] flex flex-wrap gap-2 items-center border-t border-white/5">
        <span className="text-[9px] uppercase tracking-wider font-bold text-white/30 font-mono flex items-center gap-1">
          <Lightbulb className="w-3 h-3 text-blue-500" /> Quick Ask:
        </span>
        {presetSuggestions.map((prompt) => (
          <button
            id={`preset_prompt_${prompt.replace(/\s+/g, '_')}`}
            onClick={() => handleSendMessage(prompt)}
            disabled={loading}
            key={prompt}
            className="px-2.5 py-1 text-[10px] font-semibold text-neutral-400 hover:text-white bg-neutral-950 hover:bg-neutral-800 border border-white/5 hover:border-white/10 rounded-lg transition-all duration-150 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(inputValue); }}
        className="p-4 border-t border-white/5 bg-black/40 flex gap-3"
      >
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask BUDDY..."
          disabled={loading}
          className="flex-1 bg-neutral-950 border border-white/5 focus:border-blue-500 rounded-2xl px-5 text-sm outline-none text-white placeholder-neutral-600 transition-all duration-150"
        />
        <button
          id="send_chat_btn"
          disabled={!inputValue.trim() || loading}
          type="submit"
          className="p-3.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white rounded-2xl transition-all duration-150 flex items-center justify-center shadow shadow-blue-950/30 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
