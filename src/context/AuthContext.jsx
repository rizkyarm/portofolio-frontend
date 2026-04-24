import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('AuthProvider mounted');
    // Tidak check token di initial load untuk menghindari blocking
    const token = localStorage.getItem('admin_token');
    if (token) {
      setLoading(true);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      api.get('/admin/me', { signal: controller.signal })
        .then(res => {
          console.log('Auth check success:', res.data.user);
          setUser(res.data.user);
        })
        .catch(err => {
          console.log('Auth check failed:', err.message);
          localStorage.removeItem('admin_token');
          setUser(null);
        })
        .finally(() => {
          clearTimeout(timeout);
          setLoading(false);
        });

      return () => {
        clearTimeout(timeout);
        controller.abort();
      };
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    localStorage.setItem('admin_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await api.post('/admin/logout').catch(() => {});
    localStorage.removeItem('admin_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
