import { motion, AnimatePresence } from 'framer-motion';

export type OrbMood = 'idle' | 'listening' | 'thinking' | 'presenting' | 'celebrating' | 'sad';

interface GrocerOrbProps {
  mood?: OrbMood;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function GrocerOrb({ mood = 'idle', className = '', size = 'md' }: GrocerOrbProps) {
  const dotSize = size === 'sm' ? 36 : size === 'lg' ? 64 : 48;
  const isSpeaking = mood === 'presenting' || mood === 'celebrating';
  const isListening = mood === 'listening';
  const isThinking = mood === 'thinking';

  // Aura color based on mood
  const coreGradient = isListening
    ? 'radial-gradient(circle, hsl(42 60% 70%) 0%, hsl(42 50% 50%) 40%, hsl(130 45% 30%) 100%)'
    : isSpeaking
    ? 'radial-gradient(circle, hsl(150 50% 60%) 0%, hsl(130 50% 40%) 40%, hsl(130 54% 20%) 100%)'
    : isThinking
    ? 'radial-gradient(circle, hsl(170 40% 50%) 0%, hsl(130 45% 30%) 100%)'
    : 'radial-gradient(circle, hsl(140 45% 50%) 0%, hsl(130 54% 23%) 100%)';

  const glowColor = isListening
    ? 'hsl(42 60% 55% / 0.5)'
    : isSpeaking
    ? 'hsl(150 50% 45% / 0.45)'
    : 'hsl(130 45% 30% / 0.2)';

  const outerGlow = isListening
    ? '0 0 30px 10px hsl(42 60% 55% / 0.3), 0 0 60px 20px hsl(42 50% 50% / 0.15)'
    : isSpeaking
    ? '0 0 25px 8px hsl(150 50% 45% / 0.3), 0 0 50px 18px hsl(130 50% 35% / 0.12)'
    : isThinking
    ? '0 0 20px 6px hsl(170 40% 40% / 0.2)'
    : '0 0 16px 4px hsl(130 45% 30% / 0.15)';

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative" style={{ width: dotSize * 4, height: dotSize * 4 }}>

        {/* Speaking aura flashes — quick bursts of light */}
        <AnimatePresence>
          {isSpeaking && [0, 1, 2, 3].map(i => (
            <motion.div
              key={`flash-${i}`}
              className="absolute rounded-full"
              style={{
                top: '50%', left: '50%',
                width: dotSize * 0.6, height: dotSize * 0.6,
                x: '-50%', y: '-50%',
                background: `radial-gradient(circle, hsl(150 55% 55% / 0.4) 0%, transparent 70%)`,
              }}
              animate={{
                scale: [0.8, 2.2, 0.8],
                opacity: [0, 0.6, 0],
                rotate: [i * 90, i * 90 + 45, i * 90],
              }}
              transition={{
                duration: 1.2 + i * 0.15,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeInOut',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Ripple rings when speaking */}
        <AnimatePresence>
          {isSpeaking && [0, 1, 2].map(i => (
            <motion.div
              key={`ripple-${i}`}
              className="absolute rounded-full"
              style={{
                top: '50%', left: '50%',
                width: dotSize, height: dotSize,
                x: '-50%', y: '-50%',
                border: '1px solid',
                borderColor: 'hsl(150 50% 50% / 0.25)',
              }}
              animate={{
                scale: [1, 3],
                opacity: [0.35, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.65,
                ease: 'easeOut',
              }}
            />
          ))}
        </AnimatePresence>

        {/* Thinking orbit — a small dot circling */}
        {isThinking && (
          <motion.div
            className="absolute"
            style={{
              top: '50%', left: '50%',
              width: 6, height: 6,
              marginTop: -3, marginLeft: -3,
              borderRadius: '50%',
              background: 'hsl(170 50% 60%)',
              boxShadow: '0 0 8px 2px hsl(170 50% 60% / 0.5)',
            }}
            animate={{
              x: [dotSize * 0.8, 0, -dotSize * 0.8, 0, dotSize * 0.8],
              y: [0, -dotSize * 0.8, 0, dotSize * 0.8, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* Outer halo — soft ambient ring */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%',
            width: dotSize * 1.8, height: dotSize * 1.8,
            x: '-50%', y: '-50%',
            border: '1px solid',
            borderColor: isListening ? 'hsl(42 50% 55% / 0.15)' : 'hsl(130 40% 40% / 0.1)',
          }}
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Core orb */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%',
            width: dotSize, height: dotSize,
            x: '-50%', y: '-50%',
            background: coreGradient,
            boxShadow: outerGlow,
          }}
          animate={{
            scale: isSpeaking ? [1, 1.08, 0.97, 1.04, 1] : [1, 1.04, 1],
          }}
          transition={{
            duration: isSpeaking ? 1.5 : 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Inner highlight — glass reflection */}
        <motion.div
          className="absolute rounded-full"
          style={{
            top: '50%', left: '50%',
            width: dotSize * 0.5, height: dotSize * 0.35,
            x: '-50%', y: `calc(-50% - ${dotSize * 0.12}px)`,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, transparent 100%)',
            filter: 'blur(2px)',
          }}
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}
