import { motion } from "motion/react";

export type KnowledgeLevel = 'kid' | 'teen' | 'adult' | 'professional' | 'expert';

interface LevelSelectorProps {
  selectedLevel: KnowledgeLevel;
  onLevelChange: (level: KnowledgeLevel) => void;
}

const levels = [
  { id: 'kid'          as KnowledgeLevel, emoji: '🧒', title: 'Kid',          description: 'Simple & fun',        color: '#F97316', gradient: 'linear-gradient(135deg,#F97316,#FB923C)', glow: 'rgba(249,115,22,0.35)'  },
  { id: 'teen'         as KnowledgeLevel, emoji: '🎧', title: 'Teen',         description: 'Relatable & clear',   color: '#A855F7', gradient: 'linear-gradient(135deg,#A855F7,#C084FC)', glow: 'rgba(168,85,247,0.35)'  },
  { id: 'adult'        as KnowledgeLevel, emoji: '👤', title: 'Adult',        description: 'Balanced & practical',color: '#3B82F6', gradient: 'linear-gradient(135deg,#3B82F6,#60A5FA)', glow: 'rgba(59,130,246,0.35)'  },
  { id: 'professional' as KnowledgeLevel, emoji: '💼', title: 'Professional', description: 'Detailed & precise',  color: '#14B8A6', gradient: 'linear-gradient(135deg,#14B8A6,#2DD4BF)', glow: 'rgba(20,184,166,0.35)'  },
  { id: 'expert'       as KnowledgeLevel, emoji: '🎓', title: 'Expert',       description: 'Technical & deep',    color: '#F59E0B', gradient: 'linear-gradient(135deg,#F59E0B,#FBBF24)', glow: 'rgba(245,158,11,0.35)'  },
];

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Knowledge Level</h2>
        <p className="text-white/55">Select how you want information explained to you</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto"
      >
        {levels.map((level, index) => {
          const isSelected = selectedLevel === level.id;
          return (
            <motion.button
              key={level.id}
              onClick={() => onLevelChange(level.id)}
              whileHover={{ scale: 1.04, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.08 }}
              style={{ willChange: 'transform' }}
            >
              {/*
                Removed: backdrop-blur-xl (was on every card = 5 GPU backdrop samples per frame)
                Removed: hover glow div with filter:blur(20px) behind each card
                Replaced with: box-shadow transition — GPU composited, zero repaint cost
              */}
              <div
                className="relative rounded-2xl p-6"
                style={{
                  background: isSelected ? level.gradient : 'rgba(14,17,32,0.9)',
                  border: `2px solid ${isSelected ? level.color : 'rgba(255,255,255,0.09)'}`,
                  boxShadow: isSelected
                    ? `0 0 36px ${level.glow}, 0 8px 24px rgba(0,0,0,0.35)`
                    : '0 4px 16px rgba(0,0,0,0.25)',
                  transition: 'background 0.2s ease, border-color 0.2s ease, box-shadow 0.25s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = `0 0 24px ${level.glow}, 0 8px 20px rgba(0,0,0,0.3)`;
                    el.style.borderColor = `${level.color}55`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    const el = e.currentTarget as HTMLDivElement;
                    el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.25)';
                    el.style.borderColor = 'rgba(255,255,255,0.09)';
                  }
                }}
              >
                <div className="text-5xl mb-3">{level.emoji}</div>
                <h3 className="text-xl font-bold mb-1 text-white">{level.title}</h3>
                <p className={`text-sm ${isSelected ? 'text-white/85' : 'text-white/55'}`}>
                  {level.description}
                </p>

                {isSelected && (
                  <motion.div
                    layoutId="selectedLevel"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    style={{ boxShadow: `0 0 12px ${level.glow}` }}
                  >
                    <div className="w-3 h-3 rounded-full" style={{ background: level.color }} />
                  </motion.div>
                )}
              </div>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}