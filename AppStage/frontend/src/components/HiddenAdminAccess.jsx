// src/components/HiddenAdminAccess.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HiddenAdminAccess = () => {
  const navigate = useNavigate();
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');

  // Code secret pour accéder à l'interface admin
  const ADMIN_SECRET_CODE = 'admin2024'; // Changez ce code selon vos besoins

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (secretCode === ADMIN_SECRET_CODE) {
      // Rediriger vers la page de connexion admin
      navigate('/admin/login');
    } else {
      setError('Code d\'accès incorrect');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '3rem',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        maxWidth: '400px',
        width: '100%',
        textAlign: 'center',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: '#374151',
          borderRadius: '8px',
          margin: '0 auto 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          color: 'white'
        }}>
          🔐
        </div>
        
        <h2 style={{
          color: '#111827',
          fontSize: '1.875rem',
          fontWeight: '600',
          margin: '0 0 0.5rem 0',
          letterSpacing: '-0.025em'
        }}>
          Accès Administrateur
        </h2>
        
        <p style={{
          color: '#6b7280',
          margin: '0 0 2rem 0',
          fontSize: '0.875rem',
          lineHeight: '1.5'
        }}>
          Veuillez entrer le code d'accès pour continuer
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="password"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              placeholder="Code d'accès"
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.875rem',
                transition: 'all 0.15s ease',
                boxSizing: 'border-box',
                background: 'white'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#374151';
                e.target.style.outline = 'none';
                e.target.style.boxShadow = '0 0 0 3px rgba(55, 65, 81, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#d1d5db';
                e.target.style.boxShadow = 'none';
              }}
              required
            />
          </div>
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#374151',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#1f2937';
            }}
            onMouseOut={(e) => {
              e.target.style.background = '#374151';
            }}
          >
            Accéder à l'Admin
          </button>
        </form>
        
        {error && (
          <div style={{
            background: '#fef2f2',
            color: '#dc2626',
            padding: '0.75rem 1rem',
            borderRadius: '6px',
            marginTop: '1rem',
            border: '1px solid #fecaca',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}
        
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #e5e7eb'
        }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              textDecoration: 'none',
              fontSize: '0.875rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              transition: 'color 0.15s ease'
            }}
            onMouseOver={(e) => e.target.style.color = '#374151'}
            onMouseOut={(e) => e.target.style.color = '#6b7280'}
          >
            <span>←</span>
            Retour au site
          </button>
        </div>
      </div>
    </div>
  );
};

export default HiddenAdminAccess;
