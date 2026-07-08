import { useState, useEffect } from "react";
import axios from "axios";
import { Navbar } from "./components/Navbar";
import { AmbientOrbs } from "./components/AmbientOrbs";
import { Hero } from "./components/Hero";
import { LevelSelector, KnowledgeLevel } from "./components/LevelSelector";
import { SearchBar } from "./components/SearchBar";
import { LoadingDashboard } from "./components/LoadingDashboard";
import { ResponseCard } from "./components/ResponseCard";
import { Footer } from "./components/Footer";
import { FeaturesShowcase } from "./components/FeaturesShowcase";
import { CTASection } from "./components/CTASection";
import { CustomCursor } from "./components/CustomCursor";

const levelColors: Record<KnowledgeLevel, { primary: string; glow: string }> = {
  kid:          { primary: '#F97316', glow: 'rgba(249, 115, 22, 0.3)' },
  teen:         { primary: '#A855F7', glow: 'rgba(168, 85, 247, 0.3)' },
  adult:        { primary: '#3B82F6', glow: 'rgba(59, 130, 246, 0.3)' },
  professional: { primary: '#14B8A6', glow: 'rgba(20, 184, 166, 0.3)' },
  expert:       { primary: '#F59E0B', glow: 'rgba(245, 158, 11, 0.3)' },
};

const API_BASE = 'http://localhost:5000/api';

export default function App() {
  const [selectedLevel, setSelectedLevel]     = useState<KnowledgeLevel>('adult');
  const [isLoading,     setIsLoading]         = useState(false);
  const [showResponse,  setShowResponse]      = useState(false);
  const [currentQuery,  setCurrentQuery]      = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const [error,         setError]             = useState<string | null>(null);

  const accentColor = levelColors[selectedLevel].primary;

  useEffect(() => {
    const colors = levelColors[selectedLevel];
    document.documentElement.style.setProperty('--accent-primary', colors.primary);
    document.documentElement.style.setProperty('--accent-glow',    colors.glow);
  }, [selectedLevel]);

  const handleSearch = async (query: string) => {
    setCurrentQuery(query);
    setShowResponse(false);
    setError(null);
    setIsLoading(true);

    try {
      const { data } = await axios.post(`${API_BASE}/query`, {
        query,
        level: selectedLevel,
      });
      setCurrentResponse(data.response);
      setTimeout(() => setShowResponse(true), 300);
    } catch (err: any) {
      setError(err.response?.data?.error || 'All AI APIs failed. Please try again.');
    }

    setIsLoading(false);
  };

  const handleTryAnother = () => {
    setShowResponse(false);
    setCurrentQuery('');
    setCurrentResponse('');
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden lg:cursor-none" style={{ background: '#070B14' }}>
      <CustomCursor />
      <AmbientOrbs accentColor={accentColor} />

      <div
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 md:px-6 lg:px-8">
          <Hero />

          <LevelSelector selectedLevel={selectedLevel} onLevelChange={setSelectedLevel} />

          <SearchBar onSearch={handleSearch} isLoading={isLoading} />

          {error && !isLoading && (
            <div
              className="max-w-4xl mx-auto mb-8 px-5 py-4 rounded-2xl text-sm"
              style={{
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.25)',
                color: 'rgba(252,165,165,0.9)',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <LoadingDashboard isVisible={isLoading} />

          <ResponseCard
            isVisible={showResponse}
            level={selectedLevel}
            query={currentQuery}
            response={currentResponse}
            onTryAnother={handleTryAnother}
          />

          {!isLoading && !showResponse && <FeaturesShowcase />}
          {!isLoading && !showResponse && <CTASection />}

          <div className="h-16" />
        </main>
      </div>

      <Footer />
    </div>
  );
}