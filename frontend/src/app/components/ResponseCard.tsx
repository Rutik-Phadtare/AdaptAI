import { motion, AnimatePresence } from "motion/react";
import { Check, Copy, Share2, Sparkles, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Badge } from "./ui/badge";
import type { KnowledgeLevel } from "./LevelSelector";

interface ResponseCardProps {
  isVisible: boolean;
  level: KnowledgeLevel;
  query: string;
  response: string;
  onTryAnother?: () => void;
}

const levelConfig = {
  kid: { color: '#F97316', label: 'Kid', emoji: '🧒' },
  teen: { color: '#A855F7', label: 'Teen', emoji: '🎧' },
  adult: { color: '#3B82F6', label: 'Adult', emoji: '👤' },
  professional: { color: '#14B8A6', label: 'Professional', emoji: '💼' },
  expert: { color: '#F59E0B', label: 'Expert', emoji: '🎓' }
};

// Simple markdown renderer — handles headings, bold, italic, code blocks, inline code, lists
function renderMarkdown(text: string, accentColor: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      nodes.push(
        <div key={`code-${i}`} className="my-4 rounded-xl overflow-hidden">
          {lang && (
            <div className="px-4 py-2 text-xs font-mono text-white/50 border-b border-white/10"
              style={{ background: 'rgba(0,0,0,0.4)' }}>
              {lang}
            </div>
          )}
          <pre className="p-4 text-sm font-mono text-white/90 overflow-x-auto"
            style={{ background: 'rgba(0,0,0,0.35)', lineHeight: 1.6 }}>
            <code>{codeLines.join('\n')}</code>
          </pre>
        </div>
      );
      i++; // skip closing ```
      continue;
    }

    // H1
    if (line.startsWith('# ')) {
      nodes.push(<h1 key={i} className="text-2xl font-bold text-white mt-6 mb-3">{inlineMarkdown(line.slice(2), accentColor)}</h1>);
      i++; continue;
    }

    // H2
    if (line.startsWith('## ')) {
      nodes.push(<h2 key={i} className="text-xl font-bold text-white mt-5 mb-2">{inlineMarkdown(line.slice(3), accentColor)}</h2>);
      i++; continue;
    }

    // H3
    if (line.startsWith('### ')) {
      nodes.push(<h3 key={i} className="text-base font-bold mt-4 mb-2" style={{ color: accentColor }}>{inlineMarkdown(line.slice(4), accentColor)}</h3>);
      i++; continue;
    }

    // Unordered list
    if (line.match(/^[-*] /)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[-*] /)) {
        items.push(lines[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="my-3 space-y-1.5 ml-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-white/85">
              <span className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />
              <span>{inlineMarkdown(item, accentColor)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Ordered list
    if (line.match(/^\d+\. /)) {
      const items: string[] = [];
      let num = 1;
      while (i < lines.length && lines[i].match(/^\d+\. /)) {
        items.push(lines[i].replace(/^\d+\. /, ''));
        i++;
      }
      nodes.push(
        <ol key={`ol-${i}`} className="my-3 space-y-1.5 ml-2">
          {items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 text-white/85">
              <span className="flex-shrink-0 w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold mt-0.5"
                style={{ background: `${accentColor}30`, color: accentColor }}>
                {idx + 1}
              </span>
              <span>{inlineMarkdown(item, accentColor)}</span>
            </li>
          ))}
        </ol>
      );
      continue;
    }

    // Empty line — spacing
    if (line.trim() === '') {
      nodes.push(<div key={i} className="h-2" />);
      i++; continue;
    }

    // Regular paragraph
    nodes.push(
      <p key={i} className="text-white/85 leading-relaxed my-1">
        {inlineMarkdown(line, accentColor)}
      </p>
    );
    i++;
  }

  return nodes;
}

function inlineMarkdown(text: string, accentColor: string): React.ReactNode {
  // Split on bold, italic, and inline code
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={i} className="italic text-white/90">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded text-xs font-mono"
          style={{ background: `${accentColor}20`, color: accentColor }}>
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export function ResponseCard({ isVisible, level, query, response, onTryAnother }: ResponseCardProps) {
  const [copied, setCopied] = useState(false);
  const config = levelConfig[level];

  const handleCopy = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'AdaptAI Response', text: response });
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div
            className="relative backdrop-blur-xl rounded-3xl p-8 md:p-12"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${config.color}40`,
              boxShadow: `0 0 60px ${config.color}30, 0 8px 32px rgba(0, 0, 0, 0.3)`
            }}
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 rounded-3xl opacity-20 blur-3xl pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 70%)` }}
            />

            {/* Header */}
            <div className="relative flex items-start justify-between mb-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="px-4 py-2 rounded-full flex items-center gap-2"
                    style={{ background: `${config.color}20`, border: `1px solid ${config.color}40` }}
                  >
                    <span className="text-xl">{config.emoji}</span>
                    <span className="text-sm font-medium text-white">{config.label} Level</span>
                  </div>
                  <Badge
                    variant="outline"
                    className="px-3 py-1 backdrop-blur-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
                  >
                    <Sparkles className="w-3 h-3 mr-1" />
                    AI-Synthesized
                  </Badge>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{query}</h3>
              </div>
            </div>

            {/* Response Content — rendered markdown */}
            <div className="relative mb-8">
              <div className="text-base leading-relaxed">
                {renderMarkdown(response, config.color)}
              </div>
            </div>

            {/* Model attribution pills */}
            <div className="relative flex flex-wrap gap-2 mb-6">
              {['Groq', 'Gemini', 'Cohere', 'HuggingFace', 'Mistral'].map((model) => (
                <div
                  key={model}
                  className="px-3 py-1 rounded-full text-xs font-medium"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}
                >
                  ✓ {model}
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div className="relative flex items-center justify-between pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span>Generated by 5 AI models</span>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  onClick={handleCopy}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  {copied ? <><Check className="w-4 h-4" />Copied!</> : <><Copy className="w-4 h-4" />Copy</>}
                </motion.button>

                <motion.button
                  onClick={handleShare}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition-all"
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </motion.button>

                {onTryAnother && (
                  <motion.button
                    onClick={onTryAnother}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium text-white transition-all"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)' }}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Try Another
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
