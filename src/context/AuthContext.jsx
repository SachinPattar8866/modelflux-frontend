import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwt'));

  const login = async (email, password) => {
    const data = await loginApi(email, password);
    localStorage.setItem('jwt', data.token);
    setToken(data.token);
  };

  const register = async (email, password) => {
    const data = await registerApi(email, password);
    localStorage.setItem('jwt', data.token);
    setToken(data.token);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, login, register, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}