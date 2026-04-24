import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { useDarkMode } from '../context/DarkModeContext';

const navLinks = [
  { label: 'Home',     path: '/' },
  { label: 'Projects', path: '/projects' },
  { label: 'Services', path: '/services' },
  { label: 'About',    path: '/about' },
  { label: 'Contact',  path: '/contact' },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode, isLoaded } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Reset animation state when menu opens
  useEffect(() => {
    if (mobileMenuOpen) {
      setAnimationComplete(false);
      const timer = setTimeout(() => setAnimationComplete(true), 300);
      return () => clearTimeout(timer);
    }
  }, [mobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-500 ${
      isDarkMode 
        ? 'bg-gray-900 border-b border-gray-800' 
        : 'bg-white'
    } ${scrolled ? 'shadow-lg' : 'shadow-none'}`}>
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo with subtle animation */}
        <Link 
          to="/" 
          className={`font-sora font-bold text-xl transition-all duration-300 flex-shrink-0 hover:scale-110 active:scale-95 group relative ${
            isDarkMode ? 'text-white' : 'text-gray-900 hover:text-green-800'
          }`}
        >
          <span className="text-green-800 transition-all duration-300 group-hover:drop-shadow-lg">My</span> Portfolio
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
          {navLinks.map(({ label, path }) => {
            const isActive = pathname === path;
            return (
              <li key={path} className="group relative">
                <Link
                  to={path}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? isDarkMode
                        ? 'text-green-400 bg-gray-800 shadow-md scale-105'
                        : 'text-green-600 bg-brand-pale shadow-md scale-105'
                      : isDarkMode
                      ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:shadow-md hover:scale-105 active:scale-95'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95'
                  }`}
                >
                  {/* Animated background on hover */}
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"></span>
                  <span className="relative z-10 hover:text-green-400 transition-all duration-300 flex-shrink-0 hover:scale-110 active:scale-95">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Desktop CTA Button with animation */}
        <Link
          to="/contact"
          className={`hidden md:inline-flex px-5 py-2 text-white text-sm font-semibold rounded-lg transition-all duration-300 flex-shrink-0 hover:shadow-lg hover:-translate-y-1 active:scale-95 active:translate-y-0 group relative overflow-hidden ${
            isDarkMode
              ? 'bg-green-600 hover:bg-green-800'
              : 'bg-green-600 hover:bg-green-800'
          }`}
        >
          <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
          <span className="relative z-10 flex items-center gap-1 group-hover:gap-2 transition-all">Hire Me</span>
        </Link>

        {/* Dark Mode Toggle Button */}
        <button
          onClick={toggleDarkMode}
          className={`hidden md:flex ml-3 p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 ${
            isDarkMode
              ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-brand-purple'
          }`}
          aria-label="Toggle dark mode"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Mobile Menu Button with rotation animation */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 hamburger-btn group ${
            isDarkMode
              ? 'text-gray-300 hover:bg-gray-800 hover:text-green-400'
              : 'text-gray-600 hover:bg-gray-100 hover:text-green-500'
          }`}
          aria-label="Toggle menu"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${
              mobileMenuOpen ? 'rotate-90' : 'rotate-0'
            } group-hover:drop-shadow-md`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12"
                className="transition-all duration-300"
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16"
                className="transition-all duration-300"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Navigation Menu with smooth animation */}
      {mobileMenuOpen && (
        <div 
          className={`md:hidden border-t transition-all duration-300 ${
            isDarkMode
              ? 'bg-gray-900 border-gray-800'
              : 'bg-white border-gray-200'
          }`}
          style={{ animation: 'slideInDown 0.25s ease-out forwards' }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4">
            <ul className={`flex flex-col gap-2 ${!animationComplete ? 'pointer-events-none' : ''}`}>
              {navLinks.map(({ label, path }) => {
                const isActive = pathname === path;
                return (
                  <li 
                    key={path}
                    style={{
                      animation: 'slideInLeft 0.25s ease-out forwards',
                      opacity: animationComplete ? 1 : 0,
                      transform: animationComplete ? 'translateX(0)' : 'translateX(-20px)',
                    }}
                  >
                    <Link
                      to={path}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 relative overflow-hidden group ${
                        isActive
                          ? isDarkMode
                            ? 'text-green-400 bg-gray-800 shadow-md translate-x-2'
                            : 'text-green-500 bg-green-100 shadow-md translate-x-2'
                          : isDarkMode
                          ? 'text-gray-300 hover:text-gray-100 hover:bg-gray-800 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-md hover:scale-105 hover:-translate-y-0.5 active:scale-95'
                      }`}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 -translate-x-full group-hover:translate-x-full transition-all duration-500"></span>
                      <span className="relative z-10 flex items-center gap-2">
                        {label}
                        {isActive && <span className="inline-block animate-pulse text-green-500">✓</span>}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="flex gap-2 mt-4">
              {/* Mobile CTA Button with animation */}
              <Link
                to="/contact"
                className={`flex-1 px-4 py-3 text-center text-sm font-semibold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95 group relative overflow-hidden ${
                  isDarkMode
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-green-500 text-white hover:bg-green-700'
                } ${!animationComplete ? 'pointer-events-none' : ''}`}
                style={{
                  animation: 'slideInLeft 0.25s ease-out forwards',
                  opacity: animationComplete ? 1 : 0,
                  transform: animationComplete ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent to-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
                <span className="relative z-10">Hire Me</span>
              </Link>

              {/* Mobile Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`p-3 rounded-lg transition-all duration-300 ${
                  isDarkMode
                    ? 'bg-gray-800 text-yellow-400 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-green-500'
                } ${!animationComplete ? 'pointer-events-none' : ''}`}
                aria-label="Toggle dark mode"
                style={{
                  animation: 'slideInLeft 0.25s ease-out forwards',
                  opacity: animationComplete ? 1 : 0,
                  transform: animationComplete ? 'translateX(0)' : 'translateX(-20px)',
                }}
              >
                {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
