import { Search, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
}

const suggestionChips = [
  "Explain quantum physics",
  "How does blockchain work?",
  "What is machine learning?",
  "Explain photosynthesis",
  "How do vaccines work?"
];

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query);
    }
  };

  const handleChipClick = (chip: string) => {
    if (!isLoading) {
      setQuery(chip);
      onSearch(chip);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.8 }}
      className="max-w-4xl mx-auto mb-8"
    >
      <form onSubmit={handleSubmit}>
        <div 
          className="relative backdrop-blur-xl rounded-2xl p-2 transition-all duration-300"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex items-center gap-4 px-4">
            <Search className="w-6 h-6 text-white/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything..."
              disabled={isLoading}
              className="flex-1 bg-transparent text-white text-lg py-5 outline-none placeholder:text-white/40 disabled:opacity-50"
            />
            <motion.button
              type="submit"
              disabled={!query.trim() || isLoading}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 rounded-xl font-medium text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)',
                boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)'
              }}
            >
              <Sparkles className="w-4 h-4" />
              Ask AI
            </motion.button>
          </div>
        </div>
      </form>

      {/* Suggestion Chips */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="flex flex-wrap gap-2 mt-4 justify-center"
      >
        {suggestionChips.map((chip, index) => (
          <motion.button
            key={chip}
            onClick={() => handleChipClick(chip)}
            disabled={isLoading}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 + index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 rounded-full text-sm text-white/80 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            {chip}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
