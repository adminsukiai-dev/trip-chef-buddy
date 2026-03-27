import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import GrocerOrb, { OrbMood } from '@/components/GrocerOrb';
import TypingIndicator from '@/components/TypingIndicator';
import ProductCard from '@/components/ProductCard';
import FloatingCart from '@/components/FloatingCart';
import { PRODUCTS, Product } from '@/data/products';
import { streamGrocerChat, extractProductIds, stripProductTag } from '@/lib/grocer-stream';
import { toast } from 'sonner';

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
  const streamingContentRef = useRef('');

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() };
    
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);
    setBotMood('thinking');
    streamingContentRef.current = '';

    const assistantId = (Date.now() + 1).toString();

    // Build chat history for the API (exclude products, just role+content)
    const chatHistory = newMessages.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }));

    streamGrocerChat({
      messages: chatHistory,
      onDelta: (chunk) => {
        streamingContentRef.current += chunk;
        const displayContent = stripProductTag(streamingContentRef.current);
        
        setMessages(prev => {
          const last = prev[prev.length - 1];
          if (last?.id === assistantId) {
            return prev.map(m => m.id === assistantId ? { ...m, content: displayContent } : m);
          }
          return [...prev, {
            id: assistantId,
            role: 'assistant' as const,
            content: displayContent,
            timestamp: new Date(),
          }];
        });
        setIsTyping(false);
        setBotMood('presenting');
        scrollToBottom();
      },
      onDone: (fullText) => {
        // Extract product recommendations
        const productIds = extractProductIds(fullText);
        const products = productIds.length > 0 
          ? PRODUCTS.filter(p => productIds.includes(p.id)) 
          : undefined;
        const displayContent = stripProductTag(fullText);

        setMessages(prev => prev.map(m => 
          m.id === assistantId 
            ? { ...m, content: displayContent, products } 
            : m
        ));
        setIsTyping(false);
        setChatExpanded(true);

        // Determine mood from content
        if (fullText.toLowerCase().includes('birthday') || fullText.toLowerCase().includes('celebrat') || fullText.toLowerCase().includes('free delivery')) {
          setBotMood('celebrating');
          setTimeout(() => setBotMood('idle'), 3000);
        } else {
          setBotMood(products && products.length > 0 ? 'presenting' : 'idle');
        }
      },
      onError: (error) => {
        setIsTyping(false);
        setBotMood('idle');
        toast.error(error);
      },
    });
  }, [messages, isTyping, scrollToBottom]);

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
          <div className="flex items-center justify-center gap-[3px] mt-6">
            {[...Array(16)].map((_, i) => (
              <motion.div
                key={i}
                className="w-[2px] rounded-full"
                style={{ background: 'linear-gradient(180deg, hsl(130 54% 40%), hsl(42 50% 55%))' }}
                animate={{ height: [4, 12 + Math.random() * 24, 4], opacity: [0.3, 0.8, 0.3] }}
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

      <div className="flex items-center gap-2 px-5 py-2.5 z-10">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        <span className="text-[11px] font-medium text-white/50">Grocer is online</span>
      </div>

      <motion.div
        className="relative z-0 flex-shrink-0"
        animate={{ height: chatExpanded ? 100 : 180 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <GrocerOrb mood={botMood} className="h-full" size={chatExpanded ? 'sm' : 'md'} />
      </motion.div>

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
                <div className="max-w-[80%] space-y-3">
                  {msg.role === 'assistant' ? (
                    <div className="px-4 py-3.5"
                      style={{
                        borderRadius: 20, borderTopLeftRadius: 6,
                        background: '#FEFDFB', borderLeft: '2px solid #D4A843',
                        boxShadow: '0 2px 10px -3px rgba(0,0,0,0.06)',
                      }}>
                      <div className="leading-relaxed prose prose-sm prose-headings:font-display prose-strong:font-semibold"
                        style={{ fontSize: 15, color: '#2A2A2A' }}>
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  ) : (
                    <div className="px-4 py-3.5"
                      style={{
                        borderRadius: 20, borderTopRightRadius: 6,
                        background: '#1B5E20', color: 'white',
                        boxShadow: '0 2px 10px -3px rgba(0,0,0,0.1)',
                      }}>
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

      <div className="px-4 pb-1 z-10">
        <FloatingCart onViewCart={onViewCart} />
      </div>

      {messages.length <= 2 && (
        <div className="relative z-10 px-4 pb-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none"
            style={{ maskImage: 'linear-gradient(to right, black 90%, transparent)', WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent)' }}>
            {QUICK_ACTIONS.map((action) => (
              <motion.button key={action} whileTap={{ scale: 0.93 }} onClick={() => sendMessage(action)}
                className="flex-shrink-0 rounded-full font-medium transition-all active:bg-primary active:text-white"
                style={{ padding: '6px 14px', fontSize: 13, background: 'transparent', border: '1.5px solid hsl(130 54% 23%)', color: 'hsl(var(--foreground))' }}>
                {action}
              </motion.button>
            ))}
          </div>
        </div>
      )}

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
          style={{ background: 'rgba(0,0,0,0.04)', borderRadius: 50, padding: '10px 18px', fontSize: 14, color: '#2A2A2A' }}
          onFocus={e => { e.target.style.boxShadow = '0 0 0 2px rgba(212,168,67,0.2) inset'; e.target.style.background = 'rgba(0,0,0,0.06)'; }}
          onBlur={e => { e.target.style.boxShadow = 'none'; e.target.style.background = 'rgba(0,0,0,0.04)'; }}
        />
        <motion.button type="submit" whileTap={{ scale: 0.88 }} disabled={!input.trim() || isTyping}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 disabled:opacity-25 transition-opacity"
          style={{ background: '#D4A843' }}>
          <ArrowRight size={16} className="text-white" />
        </motion.button>
      </form>
    </div>
  );
};

export default ConciergeScreen;
