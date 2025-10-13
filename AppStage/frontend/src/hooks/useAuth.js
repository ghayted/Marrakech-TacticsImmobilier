import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié au chargement
    const auth = localStorage.getItem('isAuthenticated');
    const userType = localStorage.getItem('userType'); // 'admin' ou 'client'
    const authToken = localStorage.getItem('authToken');
    
    if (auth === 'true' || authToken) {
      setIsAuthenticated(true);
      
      if (userType === 'admin') {
        setIsAdmin(true);
        setIsClient(false);
      } else if (userType === 'client' || authToken) {
        setIsClient(true);
        setIsAdmin(false);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    // Vérification admin : admin / admin123
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userType', 'admin');
      localStorage.removeItem('authToken'); // Nettoyer le token client si présent
      setIsAuthenticated(true);
      setIsAdmin(true);
      setIsClient(false);
      return { success: true };
    } else {
      return { success: false, error: 'Identifiants incorrects' };
    }
  };


  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setIsAdmin(false);
    setIsClient(false);
  };

  return {
    isAuthenticated,
    isAdmin,
    isClient,
    loading,
    login,
    logout
  };
};