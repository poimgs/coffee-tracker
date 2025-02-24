import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Coffee, BarChart3, Menu, X } from 'lucide-react';
import { supabase } from './lib/supabase';
import BeansPage from './pages/BeansPage';
import BrewsPage from './pages/BrewsPage';
import StatsPage from './pages/StatsPage';

function App() {
  const [session, setSession] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <Coffee className="h-12 w-12 text-brown-600" />
          </div>
          <h1 className="text-2xl font-bold text-center mb-6">Coffee Tracker</h1>
          <button
            onClick={() => supabase.auth.signInWithPassword({
              email: 'user@example.com',
              password: 'password123'
            })}
            className="w-full bg-brown-600 text-white py-2 px-4 rounded-md hover:bg-brown-700 transition-colors"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center">
                  <Coffee className="h-8 w-8 text-brown-600" />
                  <span className="ml-2 text-xl font-semibold">Coffee Tracker</span>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex md:items-center md:space-x-4">
                <Link
                  to="/beans"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Coffee Beans
                </Link>
                <Link
                  to="/brews"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Brews
                </Link>
                <Link
                  to="/stats"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Stats
                  </div>
                </Link>
                <button
                  onClick={() => supabase.auth.signOut()}
                  className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden flex items-center">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-50 focus:outline-none"
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  to="/beans"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Coffee Beans
                </Link>
                <Link
                  to="/brews"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Brews
                </Link>
                <Link
                  to="/stats"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="flex items-center">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Stats
                  </div>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    supabase.auth.signOut();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <Routes>
              <Route path="/" element={<Navigate to="/beans" replace />} />
              <Route path="/beans" element={<BeansPage />} />
              <Route path="/brews" element={<BrewsPage />} />
              <Route path="/stats" element={<StatsPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;