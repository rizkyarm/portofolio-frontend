import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const { pathname } = useLocation();
  
  console.log('MainLayout rendered, pathname:', pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return (
    <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#fff'}}>
      <Navbar />
      <main style={{flex: 1}}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}