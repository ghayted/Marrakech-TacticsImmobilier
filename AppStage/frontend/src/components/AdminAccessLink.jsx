// src/components/AdminAccessLink.jsx
import { useState } from 'react';

const AdminAccessLink = () => {
  const [showLink, setShowLink] = useState(false);

  // Triple clic pour révéler le lien admin
  const handleTripleClick = () => {
    setShowLink(true);
  };

  if (!showLink) {
    return (
      <div
        onClick={handleTripleClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '40px',
          height: '40px',
          background: 'transparent',
          cursor: 'pointer',
          zIndex: 1000,
          borderRadius: '50%'
        }}
        title="Triple-cliquez pour accéder à l'admin"
      />
    );
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: '#374151',
      color: 'white',
      padding: '8px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      zIndex: 1000,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #4b5563'
    }}>
      <a 
        href="/admin-secret" 
        style={{ 
          color: 'white', 
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        ⚙️ Admin
      </a>
    </div>
  );
};

export default AdminAccessLink;
