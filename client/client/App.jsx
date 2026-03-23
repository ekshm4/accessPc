import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import Sidebar from './components/Sidebar';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Files from './pages/Files';
import Folders from './pages/Folders';
import Videos from './pages/Videos';
import Audio from './pages/Audio';
import Images from './pages/Images';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import Play from './pages/playing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Documents from './pages/Documents';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 overflow-hidden pb-16 lg:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-4 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Home />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/files"
        element={
          <ProtectedRoute>
            <Layout>
              <Files />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/folders/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Folders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/videos"
        element={
          <ProtectedRoute>
            <Layout>
              <Videos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/audio"
        element={
          <ProtectedRoute>
            <Layout>
              <Audio />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/images"
        element={
          <ProtectedRoute>
            <Layout>
              <Images />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/documents"
        element={
          <ProtectedRoute>
            <Layout>
              <Documents />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Layout>
              <Settings />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/playing"
        element={
          <ProtectedRoute>
            <Layout>
              <Play />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
