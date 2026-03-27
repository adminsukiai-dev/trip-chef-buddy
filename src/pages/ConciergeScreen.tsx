import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, ChevronDown } from 'lucide-react';
import GrocerAvatar from '@/components/GrocerAvatar';
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
  content: "Hey! I'm Grocer, your personal shopping assistant for your Orlando vacation. 🌴\n\nTell me about your trip and I'll stock your kitchen perfectly. When are you checking in, and where are you staying?",
  timestamp: new Date(),
};

function getAIResponse(userMsg: string, messages: Message[]): { content: string; products?: Product[] } {
  const lower = userMsg.toLowerCase();

  if (lower.includes('family') || lower.includes('checking in') || lower.includes('resort') || lower.includes('lodge') || lower.includes('hotel')) {
    return {
      content: "Awesome! I'll get everything ready for your family trip. How many nights are you staying? And any dietary needs I should know about — allergies, gluten-free, vegan, anything like that?",
    };
  }
  if (lower.includes('night') || lower.includes('days') || lower.includes('week')) {
    const breakfastItems = PRODUCTS.filter(p => ['1', '3', '11', '19', '8'].includes(p.id));
    return {
      content: "Perfect! Let me start building your list. Here's what I'd recommend for **breakfasts** — most families love these:",
      products: breakfastItems,
    };
  }
  if (lower.includes('snack') || lower.includes('park')) {
    const snackItems = PRODUCTS.filter(p => ['7', '13', '6', '10'].includes(p.id));
    return {
      content: "Great call! Here are my top **park day snack** picks — nothing melty, all easy to carry: 🎒",
      products: snackItems,
    };
  }
  if (lower.includes('milk')) {
    const milkItems = PRODUCTS.filter(p => p.subcategory === 'milk');
    return {
      content: "Here are the milk options I have available:",
      products: milkItems,
    };
  }
  if (lower.includes('wine') || lower.includes('beer')) {
    const drinks = PRODUCTS.filter(p => p.category === 'beer-wine');
    return {
      content: "Great taste! 🍷 Here's what I have — the Josh Cellars Cab is a guest favorite and under $15:",
      products: drinks,
    };
  }
  if (lower.includes('dinner') || lower.includes('easy meal')) {
    const dinnerItems = PRODUCTS.filter(p => ['15', '16', '9'].includes(p.id));
    return {
      content: "For **easy dinners** after long park days, here are some crowd-pleasers:",
      products: dinnerItems,
    };
  }
  if (lower.includes('checkout') || lower.includes('done') || lower.includes('that\'s it') || lower.includes('thats it')) {
    return {
      content: "Let's review your order! Head to your cart to see everything. Remember — spend $200+ and you get **free delivery plus a free bottle of wine!** 🎉\n\nAnything else before I wrap this up?",
    };
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return {
      content: "Hey there! Welcome to Garden Grocer! 🌿 Tell me about your upcoming Orlando trip — where are you staying and when do you arrive? I'll make sure your kitchen is stocked and ready!",
    };
  }

  // Default smart response
  const suggested = PRODUCTS.filter(p => p.popular).slice(0, 4);
  return {
    content: "Got it! Here are some popular items that might work. Just tap the + to add anything, or tell me more about what you need!",
    products: suggested,
  };
}

interface ConciergeScreenProps {
  onViewCart: () => void;
}

const ConciergeScreen = ({ onViewCart }: ConciergeScreenProps) => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [voiceMode, setVoiceMode] = useState(false);
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
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 800);
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <GrocerAvatar size="md" speaking={isTyping} />
        <div className="flex-1">
          <h2 className="text-sm font-semibold font-display">Grocer</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-xs text-muted-foreground">Online · Your personal shopper</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && <GrocerAvatar size="sm" />}
              <div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={msg.role === 'user' ? 'grocer-bubble-user' : 'grocer-bubble-ai'}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {msg.content.split('**').map((part, i) =>
                      i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                    )}
                  </p>
                </div>
                {msg.products && msg.products.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
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
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2.5"
          >
            <GrocerAvatar size="sm" speaking />
            <TypingIndicator />
          </motion.div>
        )}
      </div>

      {/* Floating cart */}
      <div className="px-4 pb-2">
        <FloatingCart onViewCart={onViewCart} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border bg-card">
        <motion.button
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setVoiceMode(!voiceMode)}
          className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-colors ${voiceMode ? 'bg-secondary' : 'bg-muted'}`}
        >
          {voiceMode && <span className="absolute inset-0 rounded-full border-2 border-secondary animate-pulse-ring" />}
          <Mic size={18} className={voiceMode ? 'text-secondary-foreground' : 'text-muted-foreground'} />
        </motion.button>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Tell Grocer what you need..."
          className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <motion.button
          type="submit"
          whileTap={{ scale: 0.9 }}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center disabled:opacity-40"
        >
          <Send size={16} className="text-primary-foreground" />
        </motion.button>
      </form>
    </div>
  );
};

export default ConciergeScreen;
