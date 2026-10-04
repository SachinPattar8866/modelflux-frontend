import { createContext, useContext, useState } from 'react';
import { login as loginApi, register as registerApi } from '../api/authApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwt'));
  const [email, setEmail] = useState(localStorage.getItem('email'));

  const saveSession = (data, userEmail) => {
    localStorage.setItem('jwt', data.token);
    localStorage.setItem('email', userEmail);
    setToken(data.token);
    setEmail(userEmail);
  };

  const login = async (userEmail, password) => {
    saveSession(await loginApi(userEmail, password), userEmail);
  };

  const register = async (userEmail, password) => {
    saveSession(await registerApi(userEmail, password), userEmail);
  };

  const logout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('email');
    setToken(null);
    setEmail(null);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, email, login, register, logout, isAuthenticated }}>
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