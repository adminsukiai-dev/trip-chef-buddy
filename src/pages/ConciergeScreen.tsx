import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, MessageCircle, Volume2 } from 'lucide-react';
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
  content: "Hey! I'm Grocer — your personal shopping assistant for your Orlando vacation! 🌴\n\nTell me about your trip and I'll stock your kitchen perfectly. Where are you staying and when do you check in?",
  timestamp: new Date(),
};

function getAIResponse(userMsg: string, _messages: Message[]): { content: string; products?: Product[]; mood: OrbMood } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('family') || lower.includes('checking in') || lower.includes('resort') || lower.includes('lodge') || lower.includes('hotel')) {
    return {
      content: "Great resort! I deliver there all the time 🏨\n\nHow many nights are you staying? And any dietary needs I should know about — allergies, gluten-free, vegan?",
      mood: 'presenting',
    };
  }
  if (lower.includes('night') || lower.includes('days') || lower.includes('week')) {
    const items = PRODUCTS.filter(p => ['1', '3', '11', '19', '8'].includes(p.id));
    return {
      content: "Perfect! Let me build your list. Here's what I'd recommend for **breakfasts** — most families love these:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('snack') || lower.includes('park')) {
    const items = PRODUCTS.filter(p => ['7', '13', '6', '10'].includes(p.id));
    return {
      content: "Park day essentials! 🎒 Nothing melty, all easy to carry:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('milk')) {
    const items = PRODUCTS.filter(p => p.subcategory === 'milk');
    return { content: "Here are our milk options:", products: items, mood: 'presenting' };
  }
  if (lower.includes('wine') || lower.includes('beer')) {
    const items = PRODUCTS.filter(p => p.category === 'beer-wine');
    return {
      content: "Great taste! 🍷 The Josh Cellars Cab is a guest favorite — under $15:",
      products: items,
      mood: 'presenting',
    };
  }
  if (lower.includes('dinner') || lower.includes('easy meal')) {
    const items = PRODUCTS.filter(p => ['15', '16', '9'].includes(p.id));
    return { content: "Easy dinners after long park days:", products: items, mood: 'presenting' };
  }
  if (lower.includes('checkout') || lower.includes('done') || lower.includes("that's it")) {
    return {
      content: "Let's review your order! 🎉 Head to your cart to check everything. Spend $200+ for **free delivery + a free bottle of wine!**",
      mood: 'celebrating',
    };
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      content: "Hey there! Welcome to Garden Grocer! 🌿 Tell me about your Orlando trip — where are you staying?",
      mood: 'idle',
    };
  }
  if (lower.includes('birthday')) {
    return {
      content: "A birthday on vacation — how exciting! 🎂 Let me add some celebration essentials. Want me to include cake, candles, party plates, and balloons?",
      mood: 'celebrating',
    };
  }
  if (lower.includes('sunscreen') || lower.includes('forget')) {
    const items = PRODUCTS.filter(p => ['10', '6'].includes(p.id));
    return {
      content: "Psst — most families forget these! Want me to add them? ☀️",
      products: items,
      mood: 'presenting',
    };
  }

  const suggested = PRODUCTS.filter(p => p.popular).slice(0, 4);
  return {
    content: "Here are some popular picks! Tap + to add anything, or tell me more about what you need:",
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
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
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

      if (response.mood === 'celebrating') {
        setTimeout(() => setBotMood('idle'), 3000);
      }
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

  // Voice mode — full-screen orb
  if (voiceMode) {
    return (
      <div className="flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/30">
        {/* Subtle status */}
        <div className="flex items-center gap-2 px-5 py-3 z-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-muted-foreground">Grocer is listening</span>
          <button
            onClick={toggleVoice}
            className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle size={14} />
            <span>Chat</span>
          </button>
        </div>

        {/* Full-screen orb */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <GrocerOrb mood={botMood} className="h-72 w-full" size="lg" />

          {/* Circular waveform */}
          <div className="flex items-center justify-center gap-[3px] mt-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[3px] rounded-full bg-primary/60"
                animate={{
                  height: [6, 14 + Math.random() * 20, 6],
                  opacity: [0.4, 0.9, 0.4],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 0.5 + Math.random() * 0.3,
                  delay: i * 0.05,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </div>

          {/* Transcription area */}
          <div className="mt-6 px-8 text-center">
            <p className="text-sm text-muted-foreground italic">Tap the mic and speak naturally...</p>
          </div>
        </div>

        {/* Voice controls */}
        <div className="flex items-center justify-center gap-6 pb-8 pt-4 z-10">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={toggleVoice}
            className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-lg"
          >
            <span className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse-ring" />
            <span className="absolute inset-[-4px] rounded-full border border-accent/30 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
            <Mic size={26} className="text-primary-foreground" />
          </motion.button>
        </div>

        {/* Floating cart */}
        <div className="px-4 pb-3 z-10">
          <FloatingCart onViewCart={onViewCart} />
        </div>
      </div>
    );
  }

  // Chat mode
  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
      {/* Minimal status */}
      <div className="flex items-center gap-2 px-5 py-3 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[11px] font-medium text-muted-foreground">Grocer is online</span>
        <button
          onClick={toggleVoice}
          className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
        >
          <Volume2 size={13} />
          <span>Voice</span>
        </button>
      </div>

      {/* Orb area */}
      <motion.div
        className="relative z-0 flex-shrink-0"
        animate={{ height: chatExpanded ? 140 : 220 }}
        transition={{ duration: 0.4, ease: 'easeInOut' }}
      >
        <GrocerOrb mood={botMood} className="h-full" size={chatExpanded ? 'sm' : 'md'} />
      </motion.div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 z-10">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
              className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] space-y-2 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={msg.role === 'user' ? 'grocer-bubble-user' : 'grocer-bubble-ai'}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                    {msg.products.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <TypingIndicator />
          </motion.div>
        )}
      </div>

      {/* Floating cart */}
      <div className="px-4 pb-1 z-10">
        <FloatingCart onViewCart={onViewCart} />
      </div>

      {/* Frosted glass input bar */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 px-4 py-3 z-10 grocer-input-glass"
      >
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={toggleVoice}
          className="w-10 h-10 rounded-full bg-muted/60 flex items-center justify-center transition-colors hover:bg-muted"
        >
          <Mic size={18} className="text-muted-foreground" />
        </motion.button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tell Grocer what you need..."
          className="flex-1 bg-muted/40 rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground/60 focus:bg-muted/60 transition-colors"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center disabled:opacity-30 transition-opacity"
        >
          <Send size={15} className="text-primary-foreground" />
        </motion.button>
      </form>
    </div>
  );
};

export default ConciergeScreen;
