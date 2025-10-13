// Configuration centralisée pour l'API backend
export const API_CONFIG = {
  // URL du backend en production - HTTP temporairement (HTTPS sera configuré plus tard)
  BASE_URL: 'https://api.immotactics.live',
  
  // URL de fallback HTTPS (pour le futur)
  FALLBACK_URL: 'https://144.24.30.248:5258',
  
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
    mode: 'cors'
    // Pas de credentials pour éviter les conflits CORS
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
    // Utiliser l'URL principale
    const url = `${API_CONFIG.BASE_URL}${endpoint}`;
    return await fetch(url, config);
  } catch (error) {
    console.warn('Primary URL failed, trying fallback:', error);
    
    // Si l'URL principale échoue, essayer le fallback
    const fallbackUrl = `${API_CONFIG.FALLBACK_URL}${endpoint}`;
    return await fetch(fallbackUrl, config);
  }
};
