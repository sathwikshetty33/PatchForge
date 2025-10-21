import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Zap, Home, User, Github, Info, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { logout, user, isDark, toggleTheme } = useAuth();

  const navLinks = [
    { path: '/home', label: 'Dashboard', icon: Home },
    { path: '/profile', label: 'Profile', icon: User },
    { path: '/repositories', label: 'Repositories', icon: Github },
    { path: '/about', label: 'About', icon: Info },
    // { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 shadow-lg transition-all duration-500 ${
      isDark 
        ? 'bg-slate-900/95 backdrop-blur-lg' 
        : 'bg-white/95 backdrop-blur-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2 group">
            <Zap className={`w-8 h-8 transition-colors ${
              isDark 
                ? 'text-purple-400 group-hover:text-purple-300' 
                : 'text-purple-600 group-hover:text-purple-500'
            }`} />
            <span className={`text-2xl font-bold transition-colors ${
              isDark 
                ? 'text-white group-hover:text-purple-300' 
                : 'text-gray-900 group-hover:text-purple-600'
            }`}>
              PatchForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? isDark
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50'
                      : 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : isDark
                      ? 'text-gray-300 hover:bg-slate-800 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className={`flex items-center justify-center p-2 rounded-lg transition-all duration-300 ml-2 ${
                isDark
                  ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:text-yellow-300'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-900'
              }`}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            
            {/* User Info & Logout */}
            <div className={`flex items-center space-x-3 ml-4 pl-4 border-l ${
              isDark ? 'border-slate-700' : 'border-gray-300'
            }`}>
              {user && (
                <div className={`text-sm hidden lg:block ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {user.email || user.username}
                </div>
              )}
              <button
                onClick={logout}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 border ${
                  isDark
                    ? 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border-red-600/20 hover:border-red-600'
                    : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200 hover:border-red-600'
                }`}
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark 
                ? 'text-white hover:bg-slate-800' 
                : 'text-gray-900 hover:bg-gray-100'
            }`}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className={`md:hidden border-t animate-slide-down ${
          isDark 
            ? 'bg-slate-800 border-slate-700' 
            : 'bg-white border-gray-200'
        }`}>
          <div className="px-4 py-4 space-y-2">
            {navLinks.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                  isActive(path)
                    ? 'bg-purple-600 text-white'
                    : isDark
                      ? 'text-gray-300 hover:bg-slate-700 hover:text-white'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
            
            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border ${
                isDark
                  ? 'bg-slate-700 hover:bg-slate-600 text-yellow-400 border-slate-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-medium">
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </span>
            </button>
            
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 border ${
                isDark
                  ? 'bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border-red-600/20'
                  : 'bg-red-50 hover:bg-red-600 text-red-600 hover:text-white border-red-200 hover:border-red-600'
              }`}
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;