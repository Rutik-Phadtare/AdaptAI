import { useState, useEffect } from "react";
import axios from "axios";
import { AuthProvider, useAuth }          from "./context/AuthContext";
import { Navbar }                         from "./components/Navbar";
import { AmbientOrbs }                    from "./components/AmbientOrbs";
import { Hero }                           from "./components/Hero";
import { LevelSelector, KnowledgeLevel }  from "./components/LevelSelector";
import { SearchBar }                      from "./components/SearchBar";
import { LoadingDashboard }               from "./components/LoadingDashboard";
import { ResponseCard }                   from "./components/ResponseCard";
import { Footer }                         from "./components/Footer";
import { FeaturesShowcase }               from "./components/FeaturesShowcase";
import { CTASection }                     from "./components/CTASection";
import { AuthModal }                      from "./components/AuthModal";
import { HistoryPanel }                   from "./components/HistoryPanel";
// CustomCursor removed — native cursor used instead (no GPU cost)

const LEVEL_COLORS: Record<KnowledgeLevel, { primary: string; glow: string }> = {
  kid:          { primary: "#F97316", glow: "rgba(249,115,22,0.3)"  },
  teen:         { primary: "#A855F7", glow: "rgba(168,85,247,0.3)"  },
  adult:        { primary: "#3B82F6", glow: "rgba(59,130,246,0.3)"  },
  professional: { primary: "#14B8A6", glow: "rgba(20,184,166,0.3)"  },
  expert:       { primary: "#F59E0B", glow: "rgba(245,158,11,0.3)"  },
};

const API_BASE = "http://localhost:5000/api";

function AppInner() {
  const { user } = useAuth();

  const [selectedLevel,   setSelectedLevel]   = useState<KnowledgeLevel>("adult");
  const [isLoading,       setIsLoading]       = useState(false);
  const [showResponse,    setShowResponse]    = useState(false);
  const [currentQuery,    setCurrentQuery]    = useState("");
  const [currentResponse, setCurrentResponse] = useState("");
  const [error,           setError]           = useState<string | null>(null);

  const accentColor = LEVEL_COLORS[selectedLevel].primary;

  useEffect(() => {
    const c = LEVEL_COLORS[selectedLevel];
    document.documentElement.style.setProperty("--accent-primary", c.primary);
    document.documentElement.style.setProperty("--accent-glow",    c.glow);
  }, [selectedLevel]);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setShowResponse(false);
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE}/query`, {
        query, level: selectedLevel, userId: user?.id ?? null,
      });
      setCurrentResponse(data.response);
      setTimeout(() => setShowResponse(true), 300);
    } catch (err: any) {
      setError(err.response?.data?.error || "All AI APIs failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTryAnother = () => {
    setShowResponse(false); setCurrentQuery("");
    setCurrentResponse(""); setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Removed lg:cursor-none — using native cursor now
    <div className="min-h-screen relative overflow-hidden" style={{ background: "#070B14" }}>

      {/* Static gradient background — zero GPU cost */}
      <AmbientOrbs accentColor={accentColor} />

      {/* Removed: SVG noise texture (feTurbulence + mix-blend-overlay) */}
      {/* Removed: CustomCursor (spring animations + mouseover events) */}

      <AuthModal />
      <HistoryPanel />

      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 lg:px-8">
          <Hero />
          <LevelSelector selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && !isLoading && (
            <div className="max-w-4xl mx-auto mb-8 px-5 py-4 rounded-2xl text-sm"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", color: "rgba(252,165,165,0.9)" }}>
              ⚠️ {error}
            </div>
          )}

          <LoadingDashboard isVisible={isLoading} />
          <ResponseCard isVisible={showResponse} level={selectedLevel} query={currentQuery} response={currentResponse} onTryAnother={handleTryAnother} />

          {!isLoading && !showResponse && <FeaturesShowcase />}
          {!isLoading && !showResponse && <CTASection />}
          <div className="h-16" />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return <AuthProvider><AppInner /></AuthProvider>;
}