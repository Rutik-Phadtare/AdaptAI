import { motion } from "motion/react";
import { Zap, Brain, Shield, Sparkles } from "lucide-react";

const features = [
  {
    icon:        <Zap className="w-6 h-6" />,
    title:       "5 AI Models in Parallel",
    description: "Groq, Gemini, Cohere, HuggingFace and Mistral fire simultaneously. Fastest one wins, all contribute to the final answer.",
    color:       "#F59E0B",
    gradient:    "linear-gradient(135deg, #F59E0B, #FBBF24)",
  },
  {
    icon:        <Brain className="w-6 h-6" />,
    title:       "Intelligent Synthesis",
    description: "Responses are merged by a dedicated synthesis pass that picks the clearest, most accurate points from each model.",
    color:       "#8B5CF6",
    gradient:    "linear-gradient(135deg, #8B5CF6, #A78BFA)",
  },
  {
    icon:        <Shield className="w-6 h-6" />,
    title:       "Fault Tolerant",
    description: "If one API rate-limits or fails, the rest carry it. You always get an answer even when individual models go down.",
    color:       "#14B8A6",
    gradient:    "linear-gradient(135deg, #14B8A6, #2DD4BF)",
  },
  {
    icon:        <Sparkles className="w-6 h-6" />,
    title:       "Level-Aware Prompts",
    description: "Every API call is wrapped in a carefully crafted system prompt matched to your knowledge level before it fires.",
    color:       "#6366F1",
    gradient:    "linear-gradient(135deg, #6366F1, #818CF8)",
  },
];

const stats = [
  { value: "5",    label: "Free AI APIs"          },
  { value: "5",    label: "Knowledge levels"       },
  { value: "~6s",  label: "Avg response time"      },
  { value: "100%", label: "Open source"            },
];

export function FeaturesShowcase() {
  return (
    <div className="max-w-7xl mx-auto mb-24">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)' }}
        >
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
          <span className="text-sm text-white/85">How AdaptAI works</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Built different.{" "}
          <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
            Works better.
          </span>
        </h2>
        <p className="text-xl text-white/55 max-w-2xl mx-auto">
          Five AI models. One synthesized answer. Zero one-size-fits-all responses.
        </p>
      </motion.div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-16">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            whileHover={{ y: -4 }}
            className="relative group"
            style={{ willChange: 'transform' }}
          >
            {/*
              Removed: backdrop-blur-xl (was on every card)
              Removed: hover glow div with filter:blur(20px)
              Replaced with: box-shadow hover via CSS transition
            */}
            <div
              className="h-full rounded-2xl p-7"
              style={{
                background:  'rgba(14, 17, 32, 0.9)',
                border:      '1px solid rgba(255,255,255,0.08)',
                boxShadow:   '0 4px 20px rgba(0,0,0,0.25)',
                transition:  'border-color 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${feature.color}40`;
                el.style.boxShadow   = `0 0 28px ${feature.color}20, 0 8px 24px rgba(0,0,0,0.3)`;
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = 'rgba(255,255,255,0.08)';
                el.style.boxShadow   = '0 4px 20px rgba(0,0,0,0.25)';
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-white"
                style={{ background: feature.gradient, boxShadow: `0 4px 14px ${feature.color}40` }}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/55 leading-relaxed">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="text-center p-5 rounded-2xl"
            style={{
              background: 'rgba(99,102,241,0.07)',
              border:     '1px solid rgba(99,102,241,0.15)',
            }}
          >
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-white/45">{stat.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  );
}