import { motion } from 'framer-motion';
import { Leaf } from 'lucide-react';

export type BotMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

interface GrocerBotProps {
  mood?: BotMood;
  className?: string;
}

export default function GrocerBot({ mood = 'idle', className = '' }: GrocerBotProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        animate={{
          scale: mood === 'celebrating' ? [1, 1.15, 1] : mood === 'thinking' ? [1, 1.05, 1] : 1,
          rotate: mood === 'listening' ? [0, 3, -3, 0] : 0,
        }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, rgba(212,168,67,0.15), rgba(46,139,61,0.1))',
          border: '1px solid rgba(212,168,67,0.2)',
        }}
      >
        <Leaf size={28} className="text-accent" />
      </motion.div>
    </div>
  );
}
