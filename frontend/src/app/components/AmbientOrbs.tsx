import { motion } from "motion/react";

interface AmbientOrbsProps {
  accentColor?: string;
}

export function AmbientOrbs({ accentColor = '#3B82F6' }: AmbientOrbsProps) {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Purple Orb — static */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, -100, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #8B5CF6 0%, transparent 70%)' }}
      />

      {/* Blue Orb — static */}
      <motion.div
        animate={{ x: [0, -80, 0], y: [0, 80, 0], scale: [1, 1.3, 1] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-1/4 w-[32rem] h-[32rem] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #3B82F6 0%, transparent 70%)' }}
      />

      {/* Indigo center Orb */}
      <motion.div
        animate={{ x: [0, 60, 0], y: [0, -60, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 w-80 h-80 rounded-full opacity-15 blur-3xl"
        style={{ background: 'radial-gradient(circle, #6366F1 0%, transparent 70%)' }}
      />

      {/* Dynamic accent orb — changes with selected level */}
      <motion.div
        animate={{ x: [0, -40, 40, 0], y: [0, 60, -40, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-1/3 w-72 h-72 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${accentColor} 0%, transparent 70%)`,
          opacity: 0.12,
          transition: 'background 1s ease'
        }}
      />
    </div>
  );
}
