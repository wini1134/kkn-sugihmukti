import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart } from 'lucide-react';

export const MemoryParticles: React.FC = () => {
  // Generate a set of ambient floating memory particles
  const particles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 8 + 4,
    duration: Math.random() * 12 + 10,
    delay: Math.random() * 5,
    isSparkle: i % 3 === 0,
    isHeart: i === 7 || i === 14,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden opacity-60">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: `${p.x}vw`,
            y: `${p.y}vh`,
            opacity: 0,
            scale: 0.5,
          }}
          animate={{
            y: [`${p.y}vh`, `${(p.y - 30 + 100) % 100}vh`],
            x: [`${p.x}vw`, `${p.x + (p.id % 2 === 0 ? 3 : -3)}vw`],
            opacity: [0, 0.7, 0.8, 0],
            scale: [0.6, 1.1, 0.9, 0.5],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
          className="absolute text-[#e0a84d] drop-shadow-[0_0_8px_rgba(224,168,77,0.6)]"
        >
          {p.isSparkle ? (
            <Sparkles className="w-4 h-4 text-[#e2b76e]" />
          ) : p.isHeart ? (
            <Heart className="w-3.5 h-3.5 text-[#e57373] fill-[#e57373]/30" />
          ) : (
            <div
              className="rounded-full bg-amber-300/60 blur-[1px]"
              style={{ width: `${p.size}px`, height: `${p.size}px` }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};
