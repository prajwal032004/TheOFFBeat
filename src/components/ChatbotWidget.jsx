import React, { useState, useRef, useEffect } from 'react';
import { sendChatbotMessage } from '../services/api';
import { MessageSquare, X, Send, Bot, User, Sparkles, Play, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatbotWidget({ onPlaySong }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "Hey there! I'm BeatBot, TheOFFBeat's AI assistant. Ask me for song recommendations, band details, or booking info!",
      songs: []
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [vulgarError, setVulgarError] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    setVulgarError('');
    const userMsg = { sender: 'user', text: query.trim() };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await sendChatbotMessage(query.trim());
      const data = res.data || {};

      if (data.blocked) {
        setVulgarError(data.reply || 'Vulgarity blocked');
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply || '⚠️ Please keep conversation respectful and free of vulgar language.',
            isBlocked: true
          }
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'bot',
            text: data.reply || 'Here is what I found for you:',
            songs: data.songs || []
          }
        ]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "I'm having trouble connecting to beat server. Please try again shortly!"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    "🔥 What's your latest song?",
    "🎵 Recommend popular music",
    "👤 Tell me about the duo"
  ];


  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-brand-red text-white flex items-center justify-center shadow-glow-red hover:shadow-glow-red-lg border border-red-400/30 cursor-pointer"
        aria-label="Open AI Assistant"
      >
        {isOpen ? <X size={24} /> : <Bot size={28} className="animate-pulse" />}
      </motion.button>

      {/* Chat Window Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[580px] h-[80vh] bg-dark-950/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3.5 bg-dark-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red/50 text-brand-red flex items-center justify-center">
                  <Bot size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider flex items-center gap-1.5">
                    <span>BeatBot AI</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                  </h4>
                  <p className="text-[10px] text-gray-400">TheOFFBeat Intelligent Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar bg-gradient-to-b from-dark-950 via-black to-dark-950">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-brand-red text-white rounded-br-none shadow-glow-red'
                        : msg.isBlocked
                        ? 'bg-red-950/90 border border-red-500/50 text-red-300 rounded-bl-none'
                        : 'bg-dark-900 border border-white/10 text-gray-200 rounded-bl-none'
                    }`}
                  >
                    {msg.sender === 'bot' && msg.isBlocked && (
                      <div className="flex items-center gap-1 font-bold text-[11px] mb-1 text-red-400">
                        <AlertTriangle size={13} />
                        <span>MODERATION WARNING</span>
                      </div>
                    )}
                    <p>{msg.text}</p>
                  </div>

                  {/* Inline Playable Song Recommendations */}
                  {msg.songs && msg.songs.length > 0 && (
                    <div className="mt-2.5 w-full space-y-2">
                      {msg.songs.map((song) => (
                        <div
                          key={song.id}
                          className="flex items-center gap-3 p-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 rounded-xl transition-all"
                        >
                          <img
                            src={song.thumbnail_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=200&q=80"}
                            alt={song.title}
                            className="w-12 h-12 rounded-lg object-cover shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h5 className="text-xs font-bold text-white truncate">{song.title}</h5>
                            <p className="text-[10px] text-gray-400 truncate">{song.release_type || 'Single'} • {song.duration || '3:30'}</p>
                          </div>
                          {onPlaySong && (
                            <button
                              onClick={() => onPlaySong(song)}
                              className="p-2 rounded-full bg-brand-red text-white shadow-glow-red hover:scale-105 transition-transform shrink-0 cursor-pointer"
                              title="Play song"
                            >
                              <Play size={14} className="fill-white translate-x-0.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex items-center gap-2 text-xs text-gray-400 bg-dark-900/60 p-2.5 rounded-xl border border-white/5 w-fit">
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 rounded-full bg-brand-red animate-bounce [animation-delay:0.4s]" />
                  <span>BeatBot is searching...</span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-3 py-2 bg-dark-900/80 border-t border-white/5 flex gap-1.5 overflow-x-auto no-scrollbar">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-brand-red/80 border border-white/10 text-[10px] font-semibold text-gray-300 hover:text-white whitespace-nowrap transition-colors cursor-pointer shrink-0"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-3 bg-dark-900 border-t border-white/10 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask BeatBot about music..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="p-2 rounded-xl bg-brand-red hover:bg-red-600 disabled:opacity-50 text-white transition-all shadow-glow-red cursor-pointer shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
