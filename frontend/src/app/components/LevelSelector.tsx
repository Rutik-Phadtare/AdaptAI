import { motion } from "motion/react";

export type KnowledgeLevel = 'kid' | 'teen' | 'adult' | 'professional' | 'expert';

interface LevelSelectorProps {
  selectedLevel: KnowledgeLevel;
  onLevelChange: (level: KnowledgeLevel) => void;
}

const levels = [
  {
    id: 'kid' as KnowledgeLevel,
    emoji: '🧒',
    title: 'Kid',
    description: 'Simple & fun',
    color: '#F97316',
    gradient: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
    glow: 'rgba(249, 115, 22, 0.3)'
  },
  {
    id: 'teen' as KnowledgeLevel,
    emoji: '🎧',
    title: 'Teen',
    description: 'Relatable & clear',
    color: '#A855F7',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #C084FC 100%)',
    glow: 'rgba(168, 85, 247, 0.3)'
  },
  {
    id: 'adult' as KnowledgeLevel,
    emoji: '👤',
    title: 'Adult',
    description: 'Balanced & practical',
    color: '#3B82F6',
    gradient: 'linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)',
    glow: 'rgba(59, 130, 246, 0.3)'
  },
  {
    id: 'professional' as KnowledgeLevel,
    emoji: '💼',
    title: 'Professional',
    description: 'Detailed & precise',
    color: '#14B8A6',
    gradient: 'linear-gradient(135deg, #14B8A6 0%, #2DD4BF 100%)',
    glow: 'rgba(20, 184, 166, 0.3)'
  },
  {
    id: 'expert' as KnowledgeLevel,
    emoji: '🎓',
    title: 'Expert',
    description: 'Technical & deep',
    color: '#F59E0B',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)',
    glow: 'rgba(245, 158, 11, 0.3)'
  }
];

export function LevelSelector({ selectedLevel, onLevelChange }: LevelSelectorProps) {
  return (
    <div className="mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-center mb-8"
      >
        <h2 className="text-3xl font-bold text-white mb-3">Choose Your Knowledge Level</h2>
        <p className="text-white/60">Select how you want information explained to you</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-7xl mx-auto"
      >
        {levels.map((level, index) => {
          const isSelected = selectedLevel === level.id;
          
          return (
            <motion.button
              key={level.id}
              onClick={() => onLevelChange(level.id)}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
            >
              <div
                className="relative backdrop-blur-xl rounded-2xl p-6 transition-all duration-300"
                style={{
                  background: isSelected 
                    ? `${level.gradient}` 
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isSelected 
                    ? `2px solid ${level.color}` 
                    : '2px solid rgba(255, 255, 255, 0.1)',
                  boxShadow: isSelected 
                    ? `0 0 40px ${level.glow}, 0 8px 32px rgba(0, 0, 0, 0.3)` 
                    : '0 4px 16px rgba(0, 0, 0, 0.2)',
                }}
              >
                {/* Glow effect on hover */}
                <div 
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: level.gradient,
                    filter: 'blur(20px)',
                    zIndex: -1,
                  }}
                />
                
                <div className="text-5xl mb-3">{level.emoji}</div>
                <h3 className={`text-xl font-bold mb-1 ${isSelected ? 'text-white' : 'text-white'}`}>
                  {level.title}
                </h3>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-white/60'}`}>
                  {level.description}
                </p>

                {/* Selected indicator */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedLevel"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white flex items-center justify-center"
                    style={{
                      boxShadow: `0 0 20px ${level.glow}`
                    }}
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
