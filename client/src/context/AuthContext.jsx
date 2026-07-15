import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, clearAuth, setAuth } from '../utils/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    if (auth) setUser(auth);
    setLoading(false);
  }, []);

  const login = (role, data) => {
    setAuth(role, data);
    setUser({ role, ...data });
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
