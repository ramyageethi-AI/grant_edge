import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { Loader2 } from 'lucide-react';

function App() {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showAuth, setShowAuth] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading GrantEdge AI...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (!showAuth) {
      return (
        <LandingPage onGetStarted={() => setShowAuth(true)} />
      );
    }
    
    return (
      <AuthForm 
        mode={authMode} 
        onToggleMode={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
        onBack={() => setShowAuth(false)}
      />
    );
  }

  return <Dashboard />;
}

export default App;