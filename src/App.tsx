import { useState } from 'react';
import { Settings, Users, Loader2, Lock } from 'lucide-react';
import { useExchangeRates } from './hooks/useExchangeRates';
import { AdminView } from './components/AdminView';
import { UserView } from './components/UserView';

type ViewMode = 'user' | 'admin';

const ADMIN_PASSWORD = 'onestop272199';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('user');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passwordInput, setPasswordInput] = useState<string>('');
  const [showPasswordError, setShowPasswordError] = useState<boolean>(false);
  const { rates, loading, error, updateRate } = useExchangeRates();

  const handleAdminClick = () => {
    if (viewMode === 'admin' && isAuthenticated) {
      setViewMode('user');
      setIsAuthenticated(false);
      setPasswordInput('');
      setShowPasswordError(false);
    } else {
      setViewMode('admin');
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setShowPasswordError(false);
      setPasswordInput('');
    } else {
      setShowPasswordError(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-osl-navy-900 via-osl-navy-800 to-osl-navy-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-osl-yellow-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-xl font-semibold">Loading exchange rates...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-osl-navy-900 via-osl-navy-800 to-osl-navy-900 flex items-center justify-center p-4">
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Rates</h2>
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (rates.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-osl-navy-900 via-osl-navy-800 to-osl-navy-900 flex items-center justify-center p-4">
        <div className="bg-osl-yellow-50 border-2 border-osl-yellow-300 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-osl-navy-800 mb-2">No Exchange Rates Available</h2>
          <p className="text-gray-700">Please contact the administrator to set up exchange rates.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-osl-navy-50 via-white to-osl-yellow-50">
      <header className="bg-gradient-to-r from-osl-navy-900 via-osl-navy-800 to-osl-navy-900 shadow-xl border-b-4 border-osl-yellow-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                One Stop Laos Currency Exchange
              </h1>
              <p className="text-osl-navy-200 text-sm sm:text-base">
                Real-time exchange rates for LAK, MMK, and THB
              </p>
            </div>
            <div className="flex gap-2 self-end sm:self-auto">
              <button
                onClick={() => {
                  setViewMode('user');
                  setIsAuthenticated(false);
                  setPasswordInput('');
                  setShowPasswordError(false);
                }}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'user'
                    ? 'bg-osl-yellow-500 text-white shadow-lg'
                    : 'bg-osl-navy-700 text-osl-navy-200 hover:bg-osl-navy-600'
                }`}
              >
                <Users className="w-5 h-5" />
                <span className="hidden sm:inline">User</span>
              </button>
              <button
                onClick={handleAdminClick}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg font-semibold transition-all ${
                  viewMode === 'admin' && isAuthenticated
                    ? 'bg-osl-yellow-500 text-white shadow-lg'
                    : 'bg-osl-navy-700 text-osl-navy-200 hover:bg-osl-navy-600'
                }`}
              >
                <Settings className="w-5 h-5" />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'admin' && !isAuthenticated ? (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 border-2 border-osl-navy-100">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Lock className="w-8 h-8 text-osl-navy-600" />
                <h2 className="text-2xl font-bold text-osl-navy-800">Admin Access</h2>
              </div>
              <p className="text-gray-600 text-center mb-6">
                Please enter the admin password to continue
              </p>
              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setShowPasswordError(false);
                    }}
                    placeholder="Enter admin password"
                    className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-osl-navy-500 transition-all ${
                      showPasswordError
                        ? 'border-red-300 focus:border-red-500'
                        : 'border-gray-300 focus:border-osl-navy-500'
                    }`}
                    autoFocus
                  />
                  {showPasswordError && (
                    <p className="mt-2 text-sm text-red-600">
                      Incorrect password. Please try again.
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="w-full bg-osl-yellow-500 hover:bg-osl-yellow-600 text-white font-semibold py-3 px-6 rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Access Admin Dashboard
                </button>
              </form>
            </div>
          </div>
        ) : viewMode === 'admin' && isAuthenticated ? (
          <AdminView rates={rates} onUpdateRate={updateRate} />
        ) : (
          <UserView rates={rates} />
        )}
      </main>

      <footer className="bg-osl-navy-900 border-t-2 border-osl-yellow-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-osl-navy-300 text-sm">
            &copy; {new Date().getFullYear()} One Stop Laos. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
