import { motion } from 'framer-motion';

export type OrbMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

interface GrocerOrbProps {
  mood?: OrbMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GrocerOrb({ mood = 'idle', className = '', size = 'md' }: GrocerOrbProps) {
  const dotSize = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;
  const isRippling = mood === 'presenting' || mood === 'celebrating';
  const isListening = mood === 'listening';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: dotSize * 3, height: dotSize * 3 }}>
        {/* Ripple rings */}
        {isRippling && [0, 1, 2].map(i => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: '50%', left: '50%',
              width: dotSize, height: dotSize,
              x: '-50%', y: '-50%',
              border: '1.5px solid',
              borderColor: 'hsl(42 50% 55% / 0.3)',
            }}
            animate={{
              scale: [1, 2.5],
              opacity: [0.4, 0],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
          />
        ))}

        {/* Core dot */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%',
            width: dotSize, height: dotSize,
            x: '-50%', y: '-50%',
            background: isListening
              ? 'radial-gradient(circle, hsl(42 55% 65%) 0%, hsl(130 45% 35%) 100%)'
              : 'radial-gradient(circle, hsl(130 40% 45%) 0%, hsl(130 54% 23%) 100%)',
            boxShadow: isListening
              ? '0 0 24px 6px hsl(42 55% 55% / 0.35)'
              : '0 0 16px 4px hsl(130 45% 30% / 0.25)',
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}
