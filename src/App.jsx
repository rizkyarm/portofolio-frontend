import { AuthProvider } from './context/AuthContext';
import { HelmetProvider } from 'react-helmet-async';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </HelmetProvider>
  );
}