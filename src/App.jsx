import { Suspense } from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter        from './routes/AppRouter';

export default function App() {
  console.log('App component rendered');
  
  return (
    <Suspense fallback={<div style={{padding: '20px', textAlign: 'center'}}>Loading...</div>}>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Suspense>
  );
}