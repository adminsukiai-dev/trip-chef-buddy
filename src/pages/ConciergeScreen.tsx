import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GrocerOrb, { OrbMood } from '@/components/GrocerOrb';
import TypingIndicator from '@/components/TypingIndicator';
import ProductCard from '@/components/ProductCard';
import FloatingCart from '@/components/FloatingCart';
import { PRODUCTS, Product } from '@/data/products';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
  timestamp: Date;
}

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Welcome to Garden Grocer. I'm your personal shopping concierge for your Orlando vacation.\n\nTell me about your trip — where are you staying, when you arrive, and who's coming — and I'll build the perfect grocery list for you.",
  timestamp: new Date(),
};

const QUICK_ACTIONS = [
  "Start my order",
  "Park day essentials",
  "What's on sale",
  "Reorder last trip",
  "Birthday supplies",
];

function getAIResponse(userMsg: string, _messages: Message[]): { content: string; products?: Product[]; mood: OrbMood } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('family') || lower.includes('checking in') || lower.includes('resort') || lower.includes('lodge') || lower.includes('hotel') || lower.includes('start my order')) {
    return {
      content: "I know that property well — your groceries will be held at bell services on arrival.\n\nHow many nights is your stay? And any dietary needs I should know about — allergies, gluten-free, vegan?",
      mood: 'presenting',
    };
  }
  if (lower.includes('night') || lower.includes('days') || lower.includes('week')) {
    const items = PRODUCTS.filter(p => ['1', '3', '11', '19', '8'].includes(p.id));
    return {
      content: "Here's what I'd recommend for **breakfasts** to start — most families love these:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('snack') || lower.includes('park')) {
    const items = PRODUCTS.filter(p => ['7', '13', '6', '10'].includes(p.id));
    return {
      content: "**Park day essentials** — nothing melty, all easy to carry in a backpack:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('milk')) {
    const items = PRODUCTS.filter(p => p.subcategory === 'milk');
    return { content: "Here are our **milk options** — I carry organic and dairy-free as well:", products: items, mood: 'presenting' };
  }
  if (lower.includes('wine') || lower.includes('beer')) {
    const items = PRODUCTS.filter(p => p.category === 'beer-wine');
    return {
      content: "The **Josh Cellars Cab** is our guest favorite — under $15. Here's what I have:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('dinner') || lower.includes('easy meal')) {
    const items = PRODUCTS.filter(p => ['15', '16', '9'].includes(p.id));
    return { content: "**Easy dinners** after long park days — minimal prep required:", products: items, mood: 'presenting' };
  }
  if (lower.includes('checkout') || lower.includes('done') || lower.includes("that's it") || lower.includes("that's everything")) {
    return {
      content: "Let's review your order. Head to your cart to check everything.\n\nSpend **$200+** for free delivery and a complimentary bottle of wine.",
      mood: 'celebrating',
    };
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      content: "Welcome! Tell me about your Orlando trip — where are you staying and when do you arrive?",
      mood: 'idle',
    };
  }
  if (lower.includes('birthday')) {
    return {
      content: "A birthday on vacation — let me handle that. I can add **cake, candles, party plates, balloons, and treat bags**. Want me to put together a celebration pack?",
      mood: 'celebrating',
    };
  }
  if (lower.includes('sunscreen') || lower.includes('forget') || lower.includes('sale')) {
    const items = PRODUCTS.filter(p => ['10', '6', '4'].includes(p.id));
    return {
      content: "Most families forget these — want me to add them?",
      products: items,
      mood: 'presenting',
    };
  }

  const suggested = PRODUCTS.filter(p => p.popular).slice(0, 4);
  return {
    content: "Here are some popular picks. Tap **+** to add anything, or tell me more about what you need:",
    products: suggested,
    mood: 'presenting',
  };
}

interface ConciergeScreenProps {
  onViewCart: () => void;
}

const ConciergeScreen = ({ onViewCart }: ConciergeScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [botMood, setBotMood] = useState<OrbMood>('idle');
  const [voiceMode, setVoiceMode] = useState(false);
  const [chatExpanded, setChatExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setBotMood('thinking');

    setTimeout(() => {
      const response = getAIResponse(text, [...messages, userMsg]);
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.content,
        products: response.products,
        timestamp: new Date(),
      };
      setIsTyping(false);
      setBotMood(response.mood);
      setMessages(prev => [...prev, aiMsg]);
      setChatExpanded(true);
      if (response.mood === 'celebrating') setTimeout(() => setBotMood('idle'), 3000);
    }, 1200 + Math.random() * 800);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const toggleVoice = () => {
    setVoiceMode(!voiceMode);
    setBotMood(voiceMode ? 'idle' : 'listening');
  };

  // Voice mode
  if (voiceMode) {
    return (
      <div className="flex flex-col h-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #060E08 0%, #0D2818 40%, #0D2818 100%)' }}>
        <div className="flex items-center justify-between px-5 py-3 z-10">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-white/50">Listening</span>
          </div>
          <button onClick={toggleVoice} className="text-[11px] text-white/40 hover:text-white/70 transition-colors">
            Back to Chat
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          <GrocerOrb mood={botMood} className="h-80 w-full" size="lg" />

          {/* Waveform */}
          <div className="flex items-center justify-center gap-[3px] mt-6">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] rounded-full"
                style={{ background: 'linear-gradient(180deg, hsl(130 54% 40%), hsl(42 50% 55%))' }}
                animate={{
                  height: [4, 12 + Math.random() * 24, 4],
                  opacity: [0.3, 0.8, 0.3],
                }}
                transition={{ repeat: Infinity, duration: 0.4 + Math.random() * 0.3, delay: i * 0.04, ease: 'easeInOut' }}
              />
            ))}
          </div>

          <p className="mt-8 text-sm text-white/40 italic font-light">Tap the mic and speak naturally...</p>
        </div>

        <div className="flex items-center justify-center pb-8 pt-4 z-10">
          <motion.button whileTap={{ scale: 0.9 }} onClick={toggleVoice}
            className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(130 54% 23%), hsl(130 40% 30%))' }}>
            <span className="absolute inset-0 rounded-full border border-accent/30 animate-pulse-ring" />
            <Mic size={24} className="text-white" />
          </motion.button>
        </div>

        <div className="px-4 pb-4 z-10">
          <FloatingCart onViewCart={onViewCart} />
        </div>
      </div>
    );
  }

  // Chat mode
  return (
    <div className="flex flex-col h-full relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0D2818 0%, #1a3a24 30%, #f5f0e8 85%, #FAF7F2 100%)' }}>

      {/* Status bar */}
      <div className="flex items-center gap-2 px-5 py-2.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-medium text-white/50">Grocer is online</span>
      </div>

      {/* Orb area */}
      <motion.div
        className="relative z-0 flex-shrink-0"
        animate={{ height: chatExpanded ? 100 : 180 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <GrocerOrb mood={botMood} className="h-full" size={chatExpanded ? 'sm' : 'md'} />
      </motion.div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 z-10 scrollbar-none">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const prevMsg = messages[idx - 1];
            const sameSender = prevMsg && prevMsg.role === msg.role;
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 14, x: msg.role === 'user' ? 12 : -12 }}
                animate={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ marginTop: idx === 0 ? 0 : sameSender ? 12 : 20 }}
              >
                <div className="max-w-[85%] space-y-3">
                  {msg.role === 'assistant' ? (
                    <div
                      className="px-4 py-3.5"
                      style={{
                        borderRadius: 20,
                        borderTopLeftRadius: 6,
                        background: '#FEFDFB',
                        borderLeft: '2px solid #D4A843',
                        boxShadow: '0 2px 10px -3px rgba(0,0,0,0.06)',
                      }}
                    >
                      <div className="leading-relaxed prose prose-sm prose-headings:font-display prose-strong:font-semibold"
                        style={{ fontSize: 15, color: '#2A2A2A' }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="px-4 py-3.5"
                      style={{
                        borderRadius: 20,
                        borderTopRightRadius: 6,
                        background: '#1B5E20',
                        color: 'white',
                        boxShadow: '0 2px 10px -3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <p style={{ fontSize: 15 }} className="leading-relaxed">{msg.content}</p>
                    </div>
                  )}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                      {msg.products.map(product => (
                        <ProductCard key={product.id} product={product} />
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} style={{ marginTop: 20 }}>
            <TypingIndicator />
          </motion.div>
        )}
      </div>

      {/* Floating cart */}
      <div className="px-4 pb-1 z-10">
        <FloatingCart onViewCart={onViewCart} />
      </div>

      {/* Quick action chips */}
      {messages.length <= 2 && (
        <div className="relative z-10 px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none"
            style={{ maskImage: 'linear-gradient(to right, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent)' }}>
            {QUICK_ACTIONS.map((action) => (
              <motion.button
                key={action}
                whileTap={{ scale: 0.93 }}
                onClick={() => sendMessage(action)}
                className="flex-shrink-0 rounded-full font-medium transition-all active:bg-primary active:text-white"
                style={{
                  padding: '6px 14px',
                  fontSize: 13,
                  background: 'transparent',
                  border: '1.5px solid hsl(130 54% 23%)',
                  color: 'hsl(var(--foreground))',
                }}
              >
                {action}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <form onSubmit={handleSubmit}
        className="flex items-center gap-2.5 px-4 py-3 z-10"
        style={{
          background: 'rgba(255,255,255,0.7)',
          backdropFilter: 'blur(24px) saturate(1.4)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
          borderTop: '1px solid rgba(255,255,255,0.35)',
        }}>
        <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={toggleVoice}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: '#1B5E20' }}>
          <Mic size={16} className="text-white" />
        </motion.button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tell Grocer what you need..."
          className="flex-1 outline-none placeholder:italic transition-all"
          style={{
            background: 'rgba(0,0,0,0.04)',
            borderRadius: 50,
            padding: '10px 18px',
            fontSize: 14,
            color: '#2A2A2A',
          }}
          onFocus={e => { e.target.style.boxShadow = '0 0 0 2px rgba(212,168,67,0.2) inset'; e.target.style.background = 'rgba(0,0,0,0.06)'; }}
          onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(0,0,0,0.04)'; }}
        />
        <motion.button type="submit" whileTap={{ scale: 0.88 }} disabled={!input.trim()}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-25 transition-opacity"
          style={{ background: '#D4A843' }}>
          <ArrowRight size={16} className="text-white" />
        </motion.button>
      </form>
    </div>
  );
};

export default ConciergeScreen;
