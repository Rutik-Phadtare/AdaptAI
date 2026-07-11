import { Sparkles, Menu, X, History, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { label: "How it works", href: "#" },
  { label: "Features",     href: "#" },
  { label: "API",          href: "#" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, setShowAuthModal, setShowHistoryPanel } = useAuth();

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "";

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0,   opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
    >
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          // Removed backdrop-blur-xl — solid opaque dark background instead
          // On a dark page, this is visually identical but costs zero GPU
          background: 'rgba(9, 11, 22, 0.95)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* Main bar */}
        <div className="flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #3B82F6 100%)',
                boxShadow: '0 0 16px rgba(99,102,241,0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AdaptAI</h1>
              <p className="text-xs text-white/50">Personalized Intelligence</p>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="text-sm text-white/60 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2.5">
            {user ? (
              <>
                <button onClick={() => setShowHistoryPanel(true)}
                  className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm text-white/65 hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.11)' }}>
                  <History className="w-4 h-4" /><span>History</span>
                </button>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl"
                  style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.22)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                    {initials}
                  </div>
                  <span className="text-sm text-white/75 font-medium max-w-[90px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                </div>
                <button onClick={logout} title="Sign out"
                  className="hidden md:flex w-9 h-9 items-center justify-center rounded-lg text-white/35 hover:text-red-400 transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => setShowAuthModal(true)}
                className="hidden md:block px-4 py-2 rounded-lg text-sm font-medium text-white/80 hover:text-white transition-colors"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)' }}>
                Sign In
              </button>
            )}

            <button
              className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center text-white/65 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.09)' }}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="overflow-hidden border-t border-white/8"
            >
              <div className="px-6 py-4 flex flex-col gap-3">
                {navLinks.map((link) => (
                  <a key={link.label} href={link.href}
                    className="text-sm text-white/65 hover:text-white transition-colors py-1"
                    onClick={() => setMobileOpen(false)}>
                    {link.label}
                  </a>
                ))}
                {user ? (
                  <>
                    <button onClick={() => { setShowHistoryPanel(true); setMobileOpen(false); }}
                      className="flex items-center gap-2 py-2 text-sm text-white/65 hover:text-white transition-colors">
                      <History className="w-4 h-4" /> Query History
                    </button>
                    <div className="flex items-center justify-between pt-2 border-t border-white/8">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>{initials}</div>
                        <span className="text-sm text-white/65">{user.name}</span>
                      </div>
                      <button onClick={logout} className="text-xs text-red-400/70 hover:text-red-400 transition-colors">
                        Sign out
                      </button>
                    </div>
                  </>
                ) : (
                  <button onClick={() => { setShowAuthModal(true); setMobileOpen(false); }}
                    className="mt-1 w-full px-4 py-2.5 rounded-lg text-sm font-medium text-white text-center"
                    style={{ background: 'rgba(255,255,255,0.09)', border: '1px solid rgba(255,255,255,0.14)' }}>
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}