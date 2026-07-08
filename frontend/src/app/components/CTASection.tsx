import { motion } from "motion/react";
import { Sparkles, ArrowRight, Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for exploring personalized AI",
    features: ["50 queries / month", "5 AI models", "3 knowledge levels", "Basic synthesis"],
    cta: "Get Started",
    highlight: false,
    gradient: null,
  },
  {
    name: "Pro",
    price: "$12",
    period: "per month",
    description: "For power users who need unlimited intelligence",
    features: ["Unlimited queries", "5 AI models", "All 5 knowledge levels", "Advanced synthesis", "API access", "Priority processing"],
    cta: "Start Free Trial",
    highlight: true,
    gradient: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)",
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    description: "Collaborative AI for your entire team",
    features: ["Everything in Pro", "Up to 10 members", "Shared query history", "Custom model weights", "SLA support"],
    cta: "Contact Sales",
    highlight: false,
    gradient: null,
  },
];

export function CTASection() {
  return (
    <div className="max-w-6xl mx-auto mb-24 mt-8">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center mb-16"
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
          style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)' }}
        >
          <Sparkles className="w-4 h-4 text-[#6366F1]" />
          <span className="text-sm text-white/90">Simple, transparent pricing</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Start free.{" "}
          <span className="bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#3B82F6] bg-clip-text text-transparent">
            Scale when ready.
          </span>
        </h2>
        <p className="text-xl text-white/60 max-w-2xl mx-auto">
          No credit card required. Cancel anytime. Every plan includes all 5 AI models.
        </p>
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.12 }}
            whileHover={{ y: -6 }}
            className="relative group"
          >
            {plan.highlight && (
              <div
                className="absolute -inset-px rounded-3xl"
                style={{ background: plan.gradient ?? undefined, opacity: 0.6, filter: 'blur(1px)' }}
              />
            )}
            <div
              className="relative h-full backdrop-blur-xl rounded-3xl p-8 flex flex-col"
              style={{
                background: plan.highlight
                  ? 'rgba(10, 12, 30, 0.85)'
                  : 'rgba(255, 255, 255, 0.04)',
                border: plan.highlight
                  ? '1px solid rgba(99,102,241,0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: plan.highlight
                  ? '0 0 60px rgba(99,102,241,0.25), 0 8px 32px rgba(0,0,0,0.4)'
                  : '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              {plan.highlight && (
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 rounded-full text-xs font-semibold text-white"
                  style={{ background: plan.gradient ?? undefined }}
                >
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white/80 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-bold text-white">{plan.price}</span>
                  <span className="text-white/50 mb-2">/{plan.period}</span>
                </div>
                <p className="text-sm text-white/50">{plan.description}</p>
              </div>

              <ul className="flex-1 space-y-3 mb-8">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/75">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.highlight
                          ? 'rgba(99,102,241,0.2)'
                          : 'rgba(255,255,255,0.08)'
                      }}
                    >
                      <Check className="w-3 h-3" style={{ color: plan.highlight ? '#8B5CF6' : 'rgba(255,255,255,0.5)' }} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all"
                style={
                  plan.highlight
                    ? { background: plan.gradient!, boxShadow: '0 4px 20px rgba(99,102,241,0.4)' }
                    : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }
                }
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Trust bar */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center text-white/30 text-sm mt-10"
      >
        Trusted by 10,000+ researchers, developers, and curious minds worldwide
      </motion.p>
    </div>
  );
}