import { createContext, useContext, useState, ReactNode } from "react";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  login: (userData: AuthUser, jwtToken: string) => void;
  logout: () => void;
  showAuthModal: boolean;
  setShowAuthModal: (v: boolean) => void;
  showHistoryPanel: boolean;
  setShowHistoryPanel: (v: boolean) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem("adaptai_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("adaptai_token")
  );

  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [showHistoryPanel, setShowHistoryPanel] = useState(false);

  const login = (userData: AuthUser, jwtToken: string) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("adaptai_user",  JSON.stringify(userData));
    localStorage.setItem("adaptai_token", jwtToken);
    setShowAuthModal(false); // auto-close modal on login
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("adaptai_user");
    localStorage.removeItem("adaptai_token");
    setShowHistoryPanel(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, login, logout,
        showAuthModal,    setShowAuthModal,
        showHistoryPanel, setShowHistoryPanel,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// use this in every component that needs auth state
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
};