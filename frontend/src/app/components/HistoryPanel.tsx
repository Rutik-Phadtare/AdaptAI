import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Search, Trash2, ChevronDown, ChevronUp, BarChart2 } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import type { KnowledgeLevel } from "./LevelSelector";

interface HistoryItem { _id: string; query: string; level: KnowledgeLevel; response: string; createdAt: string; }

const LEVEL_CFG: Record<KnowledgeLevel, { emoji: string; color: string; bg: string }> = {
  kid:          { emoji: "🧒", color: "#F97316", bg: "rgba(249,115,22,0.1)"  },
  teen:         { emoji: "🎧", color: "#A855F7", bg: "rgba(168,85,247,0.1)"  },
  adult:        { emoji: "👤", color: "#3B82F6", bg: "rgba(59,130,246,0.1)"  },
  professional: { emoji: "💼", color: "#14B8A6", bg: "rgba(20,184,166,0.1)"  },
  expert:       { emoji: "🎓", color: "#F59E0B", bg: "rgba(245,158,11,0.1)"  },
};

const FILTERS: (KnowledgeLevel | "all")[] = ["all","kid","teen","adult","professional","expert"];

function timeAgo(iso: string): string {
  const d = Date.now() - new Date(iso).getTime();
  const m = Math.floor(d / 60_000), h = Math.floor(d / 3_600_000), dy = Math.floor(d / 86_400_000);
  if (m < 1) return "just now"; if (m < 60) return `${m}m ago`;
  if (h < 24) return `${h}h ago`; if (dy < 7) return `${dy}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function HistoryPanel() {
  const { showHistoryPanel, setShowHistoryPanel, token, user } = useAuth();
  const [history,  setHistory]  = useState<HistoryItem[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [filter,   setFilter]   = useState<KnowledgeLevel | "all">("all");
  const [search,   setSearch]   = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { if (showHistoryPanel && token) fetchHistory(); }, [showHistoryPanel, token]);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/user/history", { headers: { Authorization: `Bearer ${token}` } });
      setHistory(data.history);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  const deleteItem = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/user/history/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setHistory(p => p.filter(h => h._id !== id));
      if (expanded === id) setExpanded(null);
    } catch { /* silent */ }
  };

  const filtered = history
    .filter(h => filter === "all" || h.level === filter)
    .filter(h => search === "" || h.query.toLowerCase().includes(search.toLowerCase()));

  const mostUsed = history.length > 0
    ? (Object.entries(history.reduce((a, h) => { a[h.level] = (a[h.level] || 0) + 1; return a; }, {} as Record<string,number>))
        .sort((a,b) => b[1]-a[1])[0][0] as KnowledgeLevel)
    : null;

  return (
    <AnimatePresence>
      {showHistoryPanel && (
        <>
          {/* Backdrop — solid dark, no blur */}
          <motion.div
            key="h-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.72)" }}
            onClick={() => setShowHistoryPanel(false)}
          />

          {/* Panel */}
          <motion.div
            key="h-panel"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
            style={{
              background:  "rgba(9, 11, 22, 0.99)",
              borderLeft:  "1px solid rgba(255,255,255,0.07)",
              boxShadow:   "-20px 0 50px rgba(0,0,0,0.55)",
            }}
          >
            {/* Header */}
            <div className="flex-shrink-0 p-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-white">Query History</h2>
                  <p className="text-sm text-white/38 mt-0.5">{user?.name ? `${user.name}'s` : "Your"} saved queries</p>
                </div>
                <button onClick={() => setShowHistoryPanel(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-white/38 hover:text-white transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)" }}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {history.length > 0 && (
                <div className="flex gap-2.5 mb-5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                    style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.2)" }}>
                    <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="text-sm font-semibold text-white">{history.length}</span>
                    <span className="text-xs text-white/38">queries</span>
                  </div>
                  {mostUsed && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: LEVEL_CFG[mostUsed].bg, border: `1px solid ${LEVEL_CFG[mostUsed].color}28` }}>
                      <span className="text-base leading-none">{LEVEL_CFG[mostUsed].emoji}</span>
                      <span className="text-xs capitalize" style={{ color: LEVEL_CFG[mostUsed].color }}>{mostUsed} most used</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl mb-3"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <Search className="w-4 h-4 text-white/28 flex-shrink-0" />
                <input type="text" placeholder="Search queries…" value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-transparent text-white text-sm placeholder-white/22 outline-none" />
                {search && <button onClick={() => setSearch("")} className="text-white/25 hover:text-white/55"><X className="w-3.5 h-3.5" /></button>}
              </div>

              <div className="flex gap-1.5 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {FILTERS.map(l => {
                  const isAll = l === "all"; const cfg = isAll ? null : LEVEL_CFG[l as KnowledgeLevel]; const active = filter === l;
                  return (
                    <button key={l} onClick={() => setFilter(l)}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all"
                      style={ active
                        ? { background: isAll ? "linear-gradient(135deg,#6366F1,#8B5CF6)" : cfg!.bg, color: isAll ? "white" : cfg!.color, border: `1px solid ${isAll ? "#6366F1" : cfg!.color}50` }
                        : { background: "rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.32)", border: "1px solid rgba(255,255,255,0.06)" }
                      }>
                      {isAll ? "All" : `${cfg!.emoji} ${l}`}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2.5">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              {!loading && filtered.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center px-6">
                  <Clock className="w-12 h-12 text-white/8 mb-4" />
                  <p className="text-white/28 text-sm">{search ? "No queries match your search" : "No queries saved yet"}</p>
                  <p className="text-white/16 text-xs mt-1.5">{search ? "Try a different search term" : "Ask something and it'll appear here"}</p>
                </div>
              )}
              {!loading && filtered.map(item => {
                const cfg = LEVEL_CFG[item.level]; const isExp = expanded === item._id;
                return (
                  <motion.div key={item._id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    className="rounded-2xl overflow-hidden group"
                    style={{ background: "rgba(255,255,255,0.028)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 rounded-md text-xs font-medium capitalize"
                              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}25` }}>
                              {cfg.emoji} {item.level}
                            </span>
                            <span className="text-xs text-white/22">{timeAgo(item.createdAt)}</span>
                          </div>
                          <p className="text-sm text-white/78 font-medium leading-snug line-clamp-2">{item.query}</p>
                          {!isExp && <p className="text-xs text-white/26 mt-2 line-clamp-2 leading-relaxed">{item.response.slice(0,130)}…</p>}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
                          <button onClick={() => deleteItem(item._id)} title="Delete"
                            className="w-7 h-7 flex items-center justify-center rounded-lg transition-all opacity-0 group-hover:opacity-100 hover:text-red-400 text-white/30">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setExpanded(isExp ? null : item._id)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg text-white/30 hover:text-white transition-colors"
                            style={{ background: "rgba(255,255,255,0.05)" }}>
                            {isExp ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    </div>
                    <AnimatePresence>
                      {isExp && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                          <div className="px-4 pb-5 pt-3 text-sm text-white/52 leading-relaxed whitespace-pre-wrap"
                            style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                            {item.response}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>

            {!loading && history.length > 0 && (
              <div className="flex-shrink-0 px-6 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <p className="text-xs text-center text-white/20">Showing {filtered.length} of {history.length} queries</p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}