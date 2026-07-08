import { motion } from "motion/react";
import { Zap, Brain, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Parallel processing across 5 AI models delivers results in under 3 seconds",
    gradient: "from-[#F97316] to-[#FB923C]"
  },
  {
    icon: Brain,
    title: "Multi-Model Intelligence",
    description: "Groq, Gemini, Cohere, HuggingFace, and Mistral work together for accuracy",
    gradient: "from-[#8B5CF6] to-[#A855F7]"
  },
  {
    icon: Shield,
    title: "Verified Answers",
    description: "Cross-validation reduces hallucinations by 67% compared to single models",
    gradient: "from-[#3B82F6] to-[#60A5FA]"
  },
  {
    icon: Sparkles,
    title: "Adaptive Learning",
    description: "Responses tailored to your exact knowledge level with intelligent synthesis",
    gradient: "from-[#14B8A6] to-[#2DD4BF]"
  }
];

export function FeaturesShowcase() {
  return (
    <div className="max-w-6xl mx-auto mb-24 mt-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="text-center mb-12"
      >
        <h2 className="text-4xl font-bold text-white mb-4">
          Why AdaptAI?
        </h2>
        <p className="text-xl text-white/60">
          The future of personalized AI is here
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.3 + index * 0.1 }}
            whileHover={{ y: -8 }}
            className="relative group cursor-pointer"
          >
            <div
              className="h-full backdrop-blur-xl rounded-2xl p-6 transition-all duration-300"
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)'
              }}
            >
              {/* Icon */}
              <div 
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-gradient-to-br ${feature.gradient}`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-bold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-white/60 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow effect */}
              <div 
                className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 bg-gradient-to-br ${feature.gradient}`}
                style={{ zIndex: -1, filter: 'blur(20px)' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.8 }}
        className="mt-16 backdrop-blur-xl rounded-2xl p-8"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent mb-2">
              5
            </div>
            <div className="text-sm text-white/60">AI Models</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent mb-2">
              2.8s
            </div>
            <div className="text-sm text-white/60">Avg Response</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#3B82F6] to-[#14B8A6] bg-clip-text text-transparent mb-2">
              67%
            </div>
            <div className="text-sm text-white/60">Less Errors</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-[#14B8A6] to-[#F59E0B] bg-clip-text text-transparent mb-2">
              43%
            </div>
            <div className="text-sm text-white/60">More Accurate</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
