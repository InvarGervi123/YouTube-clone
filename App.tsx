import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { User, AuthState } from './types';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { Upload } from './pages/Upload';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// --- Auth Context ---
interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
  isAdmin: false,
});

export const useAuth = () => useContext(AuthContext);

// --- Layout Wrapper ---
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  return (
    <div className="flex flex-col h-screen">
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-brand-dark">
          {children}
        </main>
      </div>
    </div>
  );
};

// --- Protected Route ---
const ProtectedRoute = ({ children, requireAdmin = false }: { children: React.ReactNode, requireAdmin?: boolean }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// --- Main App ---
export default function App() {
  // Initialize state from local storage to persist login across refreshes
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedUser = localStorage.getItem('opentube_user');
    const savedToken = localStorage.getItem('opentube_token');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken || null,
    };
  });

  const login = (user: User, token: string) => {
    localStorage.setItem('opentube_user', JSON.stringify(user));
    localStorage.setItem('opentube_token', token);
    setAuth({ user, token });
  };

  const logout = () => {
    localStorage.removeItem('opentube_user');
    localStorage.removeItem('opentube_token');
    setAuth({ user: null, token: null });
  };

  const isAdmin = auth.user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ 
      user: auth.user, 
      token: auth.token, 
      login, 
      logout, 
      isAuthenticated: !!auth.user,
      isAdmin 
    }}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/watch/:videoId" element={<Layout><Watch /></Layout>} />
          
          <Route path="/upload" element={
            <ProtectedRoute>
              <Layout><Upload /></Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/admin/*" element={
            <ProtectedRoute requireAdmin>
              <Layout><AdminDashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </HashRouter>
    </AuthContext.Provider>
  );
}