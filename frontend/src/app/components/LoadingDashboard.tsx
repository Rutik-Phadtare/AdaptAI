import { motion, AnimatePresence } from "motion/react";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

type ModelStatus = 'waiting' | 'processing' | 'complete';

interface AIModel {
  name: string;
  status: ModelStatus;
  logo: string;
  color: string;
}

const MODEL_DEFS = [
  { name: 'Groq', logo: '⚡', color: '#F97316' },
  { name: 'Gemini', logo: '💎', color: '#3B82F6' },
  { name: 'Cohere', logo: '🔷', color: '#8B5CF6' },
  { name: 'HuggingFace', logo: '🤗', color: '#FBBF24' },
  { name: 'Mistral', logo: '🌊', color: '#14B8A6' },
];

const initialModels = (): AIModel[] =>
  MODEL_DEFS.map(m => ({ ...m, status: 'waiting' }));

interface LoadingDashboardProps {
  isVisible: boolean;
}

export function LoadingDashboard({ isVisible }: LoadingDashboardProps) {
  const [models, setModels] = useState<AIModel[]>(initialModels());
  const [synthesizing, setSynthesizing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setModels(initialModels());
      setSynthesizing(false);
      setProgress(0);
      return;
    }

    let cancelled = false;

    const delay = (ms: number) =>
      new Promise<void>(resolve => {
        const t = setTimeout(resolve, ms);
        // cancelled check handled outside
        void t;
      });

    const run = async () => {
      for (let i = 0; i < MODEL_DEFS.length; i++) {
        if (cancelled) return;
        await delay(300);
        setModels(prev => prev.map((m, idx) => idx === i ? { ...m, status: 'processing' } : m));
        setProgress(Math.round(((i * 2 + 1) / (MODEL_DEFS.length * 2 + 2)) * 100));

        await delay(700 + i * 100);
        if (cancelled) return;
        setModels(prev => prev.map((m, idx) => idx === i ? { ...m, status: 'complete' } : m));
        setProgress(Math.round(((i * 2 + 2) / (MODEL_DEFS.length * 2 + 2)) * 100));
      }

      if (cancelled) return;
      await delay(400);
      setProgress(90);
      setSynthesizing(true);

      await delay(1200);
      if (cancelled) return;
      setProgress(100);
    };

    run();
    return () => { cancelled = true; };
  }, [isVisible]);

  const completedCount = models.filter(m => m.status === 'complete').length;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <div
            className="backdrop-blur-xl rounded-3xl p-8"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-1">Processing Your Question</h3>
              <p className="text-white/60 text-sm">Querying 5 AI models in parallel</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-white/40 mb-2">
                <span>{completedCount} of {MODEL_DEFS.length} models complete</span>
                <span>{progress}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #6366F1, #8B5CF6, #3B82F6)' }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              {models.map((model, index) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="relative backdrop-blur-sm rounded-2xl p-4 text-center"
                  style={{
                    background: model.status === 'complete' ? `${model.color}18` : 'rgba(255, 255, 255, 0.03)',
                    border: `1px solid ${model.status === 'complete' ? model.color + '60' : 'rgba(255, 255, 255, 0.1)'}`,
                    boxShadow: model.status === 'complete' ? `0 0 24px ${model.color}35` : 'none',
                    transition: 'all 0.4s ease'
                  }}
                >
                  <div className="text-4xl mb-2">{model.logo}</div>
                  <h4 className="text-sm font-medium text-white mb-2">{model.name}</h4>

                  <div className="flex items-center justify-center gap-1.5">
                    {model.status === 'waiting' && (
                      <span className="text-xs text-white/30">Waiting</span>
                    )}
                    {model.status === 'processing' && (
                      <>
                        <Loader2 className="w-3 h-3 text-white/60 animate-spin" />
                        <span className="text-xs text-white/60">Working</span>
                      </>
                    )}
                    {model.status === 'complete' && (
                      <>
                        <Check className="w-3 h-3" style={{ color: model.color }} />
                        <span className="text-xs font-medium" style={{ color: model.color }}>Done</span>
                      </>
                    )}
                  </div>

                  {/* Processing pulse ring */}
                  {model.status === 'processing' && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl"
                      animate={{ opacity: [0.4, 0, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      style={{ border: `1px solid ${model.color}`, pointerEvents: 'none' }}
                    />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Synthesis Animation */}
            <AnimatePresence>
              {synthesizing && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <div
                    className="inline-flex items-center gap-3 px-6 py-4 rounded-xl"
                    style={{
                      background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)',
                      boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)'
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <span className="text-white font-medium">Synthesizing perfect answer for you...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
