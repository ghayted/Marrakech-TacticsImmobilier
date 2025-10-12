import React, { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaEnvelope } from 'react-icons/fa';
import './ClientLoginModal.css';
import { apiRequest } from '../../config/api';

const ClientLoginModal = ({ isOpen, onClose, onLoginSuccess, onRegisterSuccess }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/Auth/client-login', {
        method: 'POST',
        body: {
          email: formData.email,
          password: formData.password
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await apiRequest('/api/Auth/client-register', {
        method: 'POST',
        body: {
          email: formData.email,
          password: formData.password,
          nom: formData.nom,
          prenom: formData.prenom,
          telephone: formData.telephone
        }
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        onRegisterSuccess(data.user);
        onClose();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'inscription');
      }
    } catch (error) {
      setError('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    if (isLoginMode) {
      handleLogin(e);
    } else {
      handleRegister(e);
    }
  };

  return (
    <div className="client-login-overlay" onClick={(e) => {
      if (e.target.className === 'client-login-overlay') {
        onClose();
      }
    }}>
      <div className="client-login-modal">
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="auth-header">
          <h2>{isLoginMode ? 'Connexion' : 'Inscription'}</h2>
          <p>{isLoginMode ? 'Connectez-vous pour réserver' : 'Créez votre compte pour réserver'}</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLoginMode && (
            <>
              <div className="form-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required={!isLoginMode}
                />
              </div>
              <div className="form-group">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required={!isLoginMode}
                />
              </div>
              <div className="form-group">
                <FaEnvelope className="input-icon" />
                <input
                  type="tel"
                  name="telephone"
                  placeholder="Téléphone (optionnel)"
                  value={formData.telephone}
                  onChange={handleChange}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <FaEnvelope className="input-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <FaLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Chargement...' : (isLoginMode ? 'Se connecter' : 'S\'inscrire')}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            {isLoginMode ? 'Pas encore de compte ?' : 'Déjà un compte ?'}
            <button 
              className="toggle-btn"
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setError('');
                setFormData({
                  email: '',
                  password: '',
                  nom: '',
                  prenom: '',
                  telephone: ''
                });
              }}
            >
              {isLoginMode ? 'S\'inscrire' : 'Se connecter'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientLoginModal; 