import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PageTransition from '../components/animations/PageTransition';
import { useDarkMode } from '../context/DarkModeContext';

export default function MainLayout() {
  const { pathname } = useLocation();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${isDarkMode ? 'bg-[#0A0A0F]' : 'bg-[#FAFBFC]'}`}>
      <Navbar />
      <div className="hidden md:block h-16" />
      <main className="flex-1">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
      <div className="md:hidden h-4" />
    </div>
  );
}