import { motion } from "motion/react";

export function Hero() {
  return (
    <div className="text-center mb-16 pt-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 backdrop-blur-sm"
          style={{
            background: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.2)'
          }}
        >
          <div className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
          <span className="text-sm text-white/90">5 AI Models • Real-time Synthesis</span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 tracking-tight px-4">
          <span 
            className="bg-gradient-to-r from-white via-white to-white/80 bg-clip-text text-transparent"
          >
            Ask anything.
          </span>
          <br />
          <span 
            className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent"
          >
            Get an answer built for you.
          </span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl text-white/60 max-w-3xl mx-auto leading-relaxed px-4">
          AdaptAI queries 5 leading models simultaneously and synthesizes 
          a single response perfectly tailored to your knowledge level.
        </p>
      </motion.div>
    </div>
  );
}