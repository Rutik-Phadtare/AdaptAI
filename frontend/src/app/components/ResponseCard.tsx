import { motion, AnimatePresence } from "motion/react";
import { Copy, Share2, RotateCcw, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import type { KnowledgeLevel } from "./LevelSelector";

interface ResponseCardProps {
  isVisible:    boolean;
  level:        KnowledgeLevel;
  query:        string;
  response:     string;
  onTryAnother: () => void;
}

const LEVEL_CFG: Record<KnowledgeLevel, { emoji: string; label: string; color: string; border: string }> = {
  kid:          { emoji: "🧒", label: "Kid Level",          color: "#F97316", border: "rgba(249,115,22,0.3)"  },
  teen:         { emoji: "🎧", label: "Teen Level",         color: "#A855F7", border: "rgba(168,85,247,0.3)"  },
  adult:        { emoji: "👤", label: "Adult Level",        color: "#3B82F6", border: "rgba(59,130,246,0.3)"  },
  professional: { emoji: "💼", label: "Professional Level", color: "#14B8A6", border: "rgba(20,184,166,0.3)"  },
  expert:       { emoji: "🎓", label: "Expert Level",       color: "#F59E0B", border: "rgba(245,158,11,0.3)"  },
};

export function ResponseCard({ isVisible, level, query, response, onTryAnother }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const cfg = LEVEL_CFG[level];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: "AdaptAI Response", text: response });
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="response-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{   opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-4xl mx-auto mb-16"
        >
          {/*
            Removed: backdrop-blur-xl on outer card
            Removed: blur-3xl ambient glow div behind the card
            Removed: backdrop-blur-sm on the badge
            Replaced with: solid dark background + box-shadow border glow
          */}
          <div
            className="relative rounded-3xl overflow-hidden"
            style={{
              background:  'rgba(11, 14, 26, 0.97)',
              border:      `1px solid ${cfg.border}`,
              boxShadow:   `0 0 40px ${cfg.border}, 0 16px 48px rgba(0,0,0,0.4)`,
            }}
          >
            {/* Top coloured accent line */}
            <div
              className="h-0.5 w-full"
              style={{ background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)` }}
            />

            {/* Card header */}
            <div
              className="flex items-center justify-between px-6 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              <div className="flex items-center gap-3">
                {/* Level badge — solid, no blur */}
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                  style={{
                    background: `${cfg.color}18`,
                    border:     `1px solid ${cfg.color}35`,
                  }}
                >
                  <span className="text-base leading-none">{cfg.emoji}</span>
                  <span className="text-xs font-semibold" style={{ color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>
                {/* Synthesised-from badge */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.18)' }}>
                  <Sparkles className="w-3 h-3 text-indigo-400" />
                  <span className="text-xs text-white/45">Synthesized from 5 AIs</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <button onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/55 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span className="hidden sm:inline">{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-white/55 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Share</span>
                </button>
              </div>
            </div>

            {/* Query echo */}
            <div className="px-6 pt-5 pb-3">
              <p className="text-sm text-white/35 font-medium mb-1">Your question</p>
              <p className="text-white/70 font-medium">{query}</p>
            </div>

            {/* Divider */}
            <div className="mx-6 h-px" style={{ background: 'rgba(255,255,255,0.05)' }} />

            {/* Response body */}
            <div className="px-6 py-5">
              <p className="text-sm text-white/35 font-medium mb-3">AdaptAI answer</p>
              <div
                className="text-white/85 leading-relaxed whitespace-pre-wrap"
                style={{ fontSize: level === 'kid' ? '1.05rem' : '0.95rem' }}
              >
                {response}
              </div>
            </div>

            {/* Footer */}
            <div
              className="px-6 py-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="text-xs text-white/25">
                Generated by AdaptAI • {new Date().toLocaleTimeString()}
              </p>
              <motion.button
                onClick={onTryAnother}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-colors"
                style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.25)' }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Ask another
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}