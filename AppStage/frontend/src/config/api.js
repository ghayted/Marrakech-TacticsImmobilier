// Configuration centralisée pour l'API backend
export const API_CONFIG = {
  // URL du backend en production - HTTPS pour éviter Mixed Content
  BASE_URL: 'https://144.24.30.248:5258',
  
  // URL de fallback HTTP (pour le développement)
  FALLBACK_URL: 'http://144.24.30.248:5257',
  
  // URL pour le développement local (optionnel)
  LOCAL_URL: 'http://localhost:5257',
  
  // Headers par défaut pour toutes les requêtes
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Origin': 'https://immotactics.live',
    'X-Requested-With': 'XMLHttpRequest'
  },
  
  // Configuration CORS
  CORS_CONFIG: {
    mode: 'cors',
    credentials: 'include'
  }
};

// Fonction utilitaire pour créer les headers avec token d'authentification
export const createAuthHeaders = (token = null) => {
  const headers = { ...API_CONFIG.DEFAULT_HEADERS };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// Fonction utilitaire pour créer une requête fetch complète avec fallback
export const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  const config = {
    ...API_CONFIG.CORS_CONFIG,
    headers: createAuthHeaders(token),
    ...options
  };
  
  // Si body est fourni et que ce n'est pas déjà une string, le convertir en JSON
  if (config.body && typeof config.body === 'object' && !config.headers['Content-Type']?.includes('multipart/form-data')) {
    config.body = JSON.stringify(config.body);
  }
  
  try {
    // Essayer d'abord avec HTTPS
    const httpsUrl = `${API_CONFIG.BASE_URL}${endpoint}`;
    return await fetch(httpsUrl, config);
  } catch (error) {
    console.warn('HTTPS failed, trying HTTP fallback:', error);
    
    // Si HTTPS échoue, essayer HTTP (pour le développement)
    const httpUrl = `${API_CONFIG.FALLBACK_URL}${endpoint}`;
    return await fetch(httpUrl, config);
  }
};
