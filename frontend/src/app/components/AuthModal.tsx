import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Mail, Lock, User, Eye, EyeOff, Sparkles } from "lucide-react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const API_BASE = "http://localhost:5000/api";
type Tab = "login" | "register";

export function AuthModal() {
  const { showAuthModal, setShowAuthModal, login } = useAuth();

  const [tab,      setTab]      = useState<Tab>("login");
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const reset = () => { setName(""); setEmail(""); setPassword(""); setError(""); setShowPass(false); setLoading(false); };
  const close = () => { setShowAuthModal(false); reset(); };
  const switchTab = (t: Tab) => { setTab(t); reset(); };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) return setError("Please fill in all fields.");
    if (tab === "register" && !name.trim()) return setError("Please enter your name.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setLoading(true); setError("");
    try {
      const endpoint = tab === "login" ? "/auth/login" : "/auth/register";
      const payload  = tab === "login" ? { email, password } : { name, email, password };
      const { data } = await axios.post(`${API_BASE}${endpoint}`, payload);
      login(data.user, data.token);
      reset();
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") handleSubmit(); };

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          key="auth-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            // Removed: backdropFilter: blur(12px) — GPU intensive on full screen
            // Increased opacity to compensate — same visual result, zero GPU cost
            background: "rgba(0, 0, 0, 0.82)",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            key="auth-card"
            initial={{ opacity: 0, scale: 0.93, y: 20 }}
            animate={{ opacity: 1, scale: 1,    y: 0  }}
            exit={{   opacity: 0, scale: 0.93, y: 20  }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative w-full max-w-md rounded-3xl p-8"
            style={{
              background: "rgba(9, 11, 22, 0.99)",
              border:     "1px solid rgba(99,102,241,0.28)",
              boxShadow:  "0 0 70px rgba(99,102,241,0.15), 0 28px 56px rgba(0,0,0,0.6)",
            }}
          >
            {/* Close */}
            <button onClick={close}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-white/40 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.06)" }}>
              <X className="w-4 h-4" />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg tracking-tight">AdaptAI</span>
            </div>

            {/* Tabs */}
            <div className="flex rounded-xl p-1 mb-7" style={{ background: "rgba(255,255,255,0.05)" }}>
              {(["login","register"] as Tab[]).map(t => (
                <button key={t} onClick={() => switchTab(t)}
                  className="flex-1 py-2.5 rounded-lg text-sm font-medium transition-all capitalize"
                  style={ tab === t
                    ? { background: "linear-gradient(135deg,#6366F1,#8B5CF6)", color: "white", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" }
                    : { color: "rgba(255,255,255,0.35)" }
                  }>
                  {t}
                </button>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">
              {tab === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-white/42 text-sm mb-6">
              {tab === "login" ? "Sign in to access your query history" : "Start saving your personalized AI answers"}
            </p>

            <div className="space-y-3">
              {tab === "register" && (
                <Field icon={<User className="w-4 h-4" />} placeholder="Your name" value={name} onChange={setName} type="text" onKeyDown={onKey} />
              )}
              <Field icon={<Mail className="w-4 h-4" />} placeholder="Email address" value={email} onChange={setEmail} type="email" onKeyDown={onKey} />
              <div className="relative">
                <Field icon={<Lock className="w-4 h-4" />} placeholder="Password (min 6 chars)" value={password} onChange={setPassword} type={showPass ? "text" : "password"} onKeyDown={onKey} />
                <button onClick={() => setShowPass(p => !p)} tabIndex={-1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="mt-4 px-4 py-3 rounded-xl text-sm"
                  style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.22)", color: "#FCA5A5" }}>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleSubmit} disabled={loading}
              className="w-full mt-6 py-3.5 rounded-xl font-semibold text-white disabled:opacity-55"
              style={{ background: "linear-gradient(135deg,#6366F1 0%,#8B5CF6 50%,#3B82F6 100%)", boxShadow: "0 4px 18px rgba(99,102,241,0.32)" }}>
              {loading ? "Please wait…" : tab === "login" ? "Sign In" : "Create Account"}
            </motion.button>

            <p className="text-center text-sm text-white/28 mt-5">
              {tab === "login" ? "Don't have an account? " : "Already have an account? "}
              <button onClick={() => switchTab(tab === "login" ? "register" : "login")}
                className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                {tab === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({ icon, placeholder, value, onChange, type, onKeyDown }: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChange: (v: string) => void; type: string; onKeyDown: (e: React.KeyboardEvent) => void;
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
      style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <span className="text-white/30 flex-shrink-0">{icon}</span>
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)} onKeyDown={onKeyDown}
        className="flex-1 bg-transparent text-white placeholder-white/25 text-sm outline-none" />
    </div>
  );
}