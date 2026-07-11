import { motion, AnimatePresence } from "motion/react";
import { Check, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

interface LoadingDashboardProps {
  isVisible: boolean;
}

const AI_MODELS = [
  { name: "Groq",        model: "Llama 3.3 70B",          color: "#F97316" },
  { name: "Gemini",      model: "1.5 Flash",               color: "#3B82F6" },
  { name: "Cohere",      model: "Command-R",               color: "#A855F7" },
  { name: "HuggingFace", model: "Llama 3.1 8B",            color: "#14B8A6" },
  { name: "Mistral",     model: "Mistral Small",           color: "#F59E0B" },
];

type ModelStatus = "waiting" | "processing" | "done";

export function LoadingDashboard({ isVisible }: LoadingDashboardProps) {
  const [statuses,     setStatuses]     = useState<ModelStatus[]>(["waiting","waiting","waiting","waiting","waiting"]);
  const [synthActive,  setSynthActive]  = useState(false);
  const [doneCount,    setDoneCount]    = useState(0);

  useEffect(() => {
    if (!isVisible) {
      // Reset on hide
      setStatuses(["waiting","waiting","waiting","waiting","waiting"]);
      setSynthActive(false);
      setDoneCount(0);
      return;
    }

    // Stagger models to "processing" then "done" to simulate parallel calls
    const timers: ReturnType<typeof setTimeout>[] = [];

    AI_MODELS.forEach((_, i) => {
      // Start processing
      timers.push(setTimeout(() => {
        setStatuses(prev => { const s = [...prev]; s[i] = "processing"; return s; });
      }, i * 280));

      // Mark done at random stagger (1.5–4.5s)
      const doneAt = 1500 + Math.random() * 3000;
      timers.push(setTimeout(() => {
        setStatuses(prev => { const s = [...prev]; s[i] = "done"; return s; });
        setDoneCount(c => c + 1);
      }, doneAt));
    });

    // Synthesis starts after most are done
    timers.push(setTimeout(() => setSynthActive(true), 4800));

    return () => timers.forEach(clearTimeout);
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="loading-dash"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: 10 }}
          transition={{ duration: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          {/*
            Removed: backdrop-blur-xl on outer container
            Removed: backdrop-blur-sm on every model card (×5 = 5 GPU backdrop filters)
            Replaced with: solid dark backgrounds
          */}
          <div
            className="rounded-3xl p-6"
            style={{
              background: 'rgba(11, 14, 26, 0.97)',
              border:     '1px solid rgba(99,102,241,0.2)',
              boxShadow:  '0 8px 32px rgba(0,0,0,0.4)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  style={{ willChange: 'transform' }}
                >
                  <Sparkles className="w-5 h-5 text-indigo-400" />
                </motion.div>
                <div>
                  <h3 className="font-semibold text-white text-sm">Querying AI models</h3>
                  <p className="text-xs text-white/40 mt-0.5">
                    {doneCount}/5 responded · synthesizing best answer
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-indigo-400"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
                    // opacity-only animation = GPU composited, zero layout cost
                  />
                ))}
              </div>
            </div>

            {/* Model status cards */}
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 mb-6">
              {AI_MODELS.map((model, i) => {
                const status = statuses[i];
                const isDone = status === "done";
                const isProc = status === "processing";

                return (
                  <motion.div
                    key={model.name}
                    className="rounded-xl p-3 text-center"
                    style={{
                      // Solid dark — removed backdrop-blur-sm
                      background: isDone
                        ? `${model.color}12`
                        : isProc
                          ? 'rgba(255,255,255,0.06)'
                          : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isDone
                        ? `${model.color}35`
                        : isProc
                          ? 'rgba(255,255,255,0.12)'
                          : 'rgba(255,255,255,0.06)'}`,
                      transition: 'background 0.3s ease, border-color 0.3s ease',
                    }}
                  >
                    {/* Status dot */}
                    <div className="flex justify-center mb-2">
                      {isDone ? (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: "spring", stiffness: 400, damping: 20 }}
                          className="w-5 h-5 rounded-full flex items-center justify-center"
                          style={{ background: model.color }}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </motion.div>
                      ) : (
                        <motion.div
                          className="w-5 h-5 rounded-full border-2"
                          style={{
                            borderColor: isProc ? model.color : 'rgba(255,255,255,0.15)',
                            borderTopColor: isProc ? 'transparent' : undefined,
                          }}
                          animate={ isProc ? { rotate: 360 } : {} }
                          transition={ isProc
                            ? { repeat: Infinity, duration: 0.9, ease: "linear" }
                            : {}
                          }
                          // rotate-only animation = GPU composited
                        />
                      )}
                    </div>

                    <p className="text-xs font-semibold text-white/80">{model.name}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{model.model}</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Synthesis row */}
            <div
              className="rounded-xl px-4 py-3 flex items-center gap-3"
              style={{
                background:  synthActive ? 'rgba(99,102,241,0.1)' : 'rgba(255,255,255,0.03)',
                border:      `1px solid ${synthActive ? 'rgba(99,102,241,0.3)' : 'rgba(255,255,255,0.07)'}`,
                transition:  'background 0.4s ease, border-color 0.4s ease',
              }}
            >
              <motion.div
                animate={synthActive ? { rotate: 360 } : {}}
                transition={ synthActive
                  ? { repeat: Infinity, duration: 1.5, ease: "linear" }
                  : {}
                }
                style={{ willChange: 'transform' }}
              >
                <Sparkles className={`w-4 h-4 ${synthActive ? 'text-indigo-400' : 'text-white/20'}`} />
              </motion.div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${synthActive ? 'text-white/85' : 'text-white/25'}`}>
                  Synthesizing best answer…
                </p>
                <p className={`text-xs ${synthActive ? 'text-white/40' : 'text-white/18'}`}>
                  Picking the clearest points from each model
                </p>
              </div>
              {synthActive && (
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 rounded-full bg-indigo-400"
                      animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.18 }}
                      // opacity + scale = GPU composited only
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}