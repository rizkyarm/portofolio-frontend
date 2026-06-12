import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDarkMode } from '../context/DarkModeContext';

const navLinks = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Projects', path: '/projects', icon: ProjectsIcon },
  { label: 'Services', path: '/services', icon: ServicesIcon },
  { label: 'About', path: '/about', icon: AboutIcon },
  { label: 'Contact', path: '/contact', icon: ContactIcon },
];

function HomeIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      {active && <path d="M9 22V12h6v10" />}
    </svg>
  );
}

function ProjectsIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    </svg>
  );
}

function ServicesIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function AboutIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ContactIcon({ active }) {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={active ? 2 : 1.5} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function ThemeToggle({ isDarkMode, onToggle, compact = false }) {
  return (
    <button
      onClick={onToggle}
      className={`relative flex items-center justify-center rounded-xl text-slate-400 hover:text-white transition-all duration-300 hover:bg-white/5 active:scale-90 group ${compact ? 'w-9 h-9' : 'w-10 h-10'}`}
      aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
    >
      <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-amber-500/10 to-violet-500/10" />

      <AnimatePresence mode="wait" initial={false}>
        {isDarkMode ? (
          <motion.svg
            key="sun"
            initial={{ rotate: -90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: 90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[18px] h-[18px] relative z-10"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </motion.svg>
        ) : (
          <motion.svg
            key="moon"
            initial={{ rotate: 90, scale: 0, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            exit={{ rotate: -90, scale: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="w-[18px] h-[18px] relative z-10"
            fill="none" viewBox="0 0 24 24"
            stroke="currentColor" strokeWidth={2}
            strokeLinecap="round" strokeLinejoin="round"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}

export default function Navbar() {
  const { pathname } = useLocation();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header
        className={`hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? isDarkMode
              ? 'bg-[#0A0A0F]/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
              : 'bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-black/5'
            : isDarkMode
              ? 'bg-[#0A0A0F]/60 backdrop-blur-lg border-b border-white/5'
              : 'bg-white/60 backdrop-blur-lg border-b border-gray-200/30'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 lg:px-8">
          <Link
            to="/"
            className={`font-sora font-bold text-lg flex-shrink-0 group ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          >
            <span className="text-emerald-400 group-hover:text-emerald-300 transition-colors">My</span>
            <span className={`transition-colors ${isDarkMode ? 'group-hover:text-slate-200' : 'group-hover:text-gray-700'}`}> Portfolio</span>
          </Link>

          <nav className="absolute left-1/2 -translate-x-1/2">
            <ul className="flex items-stretch gap-1">
              {navLinks.map(({ label, path }) => {
                const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
                return (
                  <li key={path} className="flex">
                    <Link
                      to={path}
                      className={`relative flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'text-emerald-400'
                          : isDarkMode
                            ? 'text-slate-400 hover:text-white hover:bg-white/5'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                      }`}
                    >
                      {label}
                      {isActive && (
                        <motion.span
                          layoutId="desktop-nav-indicator"
                          className="absolute bottom-1 left-3 right-3 h-0.5 bg-emerald-400 rounded-full"
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} compact />
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 active:scale-95"
            >
              Hire Me
            </Link>
          </div>
        </div>
      </header>

      <nav
        className={`md:hidden fixed bottom-0 left-0 right-0 z-50 transition-all duration-500 ${
          isDarkMode
            ? 'bg-transparent backdrop-blur-sm border-t border-emerald-500/5'
            : 'bg-transparent backdrop-blur-sm border-t border-emerald-200/30'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 8px)' }}
      >
        <div className="flex items-center justify-around h-16 px-1">
          {navLinks.map(({ label, path, icon: Icon }) => {
            const isActive = pathname === path || (path !== '/' && pathname.startsWith(path));
            return (
              <Link
                key={path}
                to={path}
                className={`relative flex flex-col items-center justify-center gap-0.5 min-w-[64px] py-1 rounded-xl transition-all duration-200 active:scale-90 tap-highlight-transparent ${
                  isActive
                    ? 'text-emerald-400'
                    : isDarkMode
                      ? 'text-slate-500 hover:text-slate-300'
                      : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="mobile-nav-bg"
                    className={`absolute inset-1 rounded-xl -z-10 ${
                      isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                    }`}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <div className="relative">
                  <Icon active={isActive} />
                </div>
                <span className={`text-[10px] font-semibold leading-none transition-all duration-300 ${
                  isActive ? 'opacity-100' : 'opacity-70'
                }`}>
                  {label}
                </span>
              </Link>
            );
          })}

          <div className="flex flex-col items-center justify-center min-w-[48px]">
            <ThemeToggle isDarkMode={isDarkMode} onToggle={toggleDarkMode} compact />
          </div>
        </div>
      </nav>

      <div className="md:hidden h-16" />
    </>
  );
}
