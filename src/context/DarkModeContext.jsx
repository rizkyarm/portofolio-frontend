import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext();

export function DarkModeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      const isDark = savedTheme === 'dark';
      setIsDarkMode(isDark);
      applyTheme(isDark);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
      applyTheme(prefersDark);
    }
    
    setIsLoaded(true);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setIsDarkMode(e.matches);
        applyTheme(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
    applyTheme(newMode);
  };

  const applyTheme = (isDark) => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      html.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  };

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode, isLoaded }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const context = useContext(DarkModeContext);
  if (!context) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
}
