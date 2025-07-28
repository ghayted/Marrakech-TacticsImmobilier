import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Breadcrumb.css';
import { FaHome } from 'react-icons/fa';

const Breadcrumb = ({ property }) => {
  const navigate = useNavigate();

  // Si les données ne sont pas encore chargées, on n'affiche rien.
  if (!property) {
    return null;
  }

  // On prépare les différents segments du fil d'Ariane
  const segments = [
    { label: 'ACCUEIL', action: () => navigate('/') },
    { label: property.statutTransaction?.toUpperCase(), action: () => navigate(`/biens?statut=${property.statutTransaction}`) },
    { label: property.typeDeBien?.nom?.toUpperCase() + ' MARRAKECH', action: () => navigate(`/biens?type=${property.typeDeBien?.nom}`) },
    { label: `RÉF. ${property.id}`, isCurrent: true }, // Le dernier segment est la page actuelle
  ];

  return (
    <nav className="breadcrumb-container" aria-label="Fil d'Ariane">
      <FaHome onClick={() => navigate('/')} className="breadcrumb-home-icon" />
      {segments.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="breadcrumb-separator">&gt;</span>}
          {segment.isCurrent ? (
            <span className="breadcrumb-current">{segment.label}</span>
          ) : (
            <button className="breadcrumb-link" onClick={segment.action}>
              {segment.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;