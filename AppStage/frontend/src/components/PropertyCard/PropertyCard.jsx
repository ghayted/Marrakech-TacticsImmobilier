import React from 'react';
import { useNavigate } from 'react-router-dom';
import './PropertyCard.css';
import { FaBed, FaRulerCombined, FaArrowRight, FaHeart } from 'react-icons/fa';

const PropertyCard = ({ property }) => {
  const navigate = useNavigate();

  // 👇 --- MODIFICATION PRINCIPALE ICI --- 👇
  // On utilise la même logique que votre composant BienListGrid
  // pour récupérer l'image principale.
  const imageUrl = property.imagePrincipale || 'https://via.placeholder.com/400x300';
  // --- FIN DE LA MODIFICATION ---

  const handleCardClick = () => {
    // On navigue vers la page de détail qui, elle, affichera toutes les photos
    navigate(`/property/${property.id}`);
  };
  
  const statusClassName = property.statutTransaction?.toLowerCase().includes('vendre') ? 'status-badge-sale' : 'status-badge-rent';

  return (
    <div className="property-card" onClick={handleCardClick}>
      <div className="card-image-container">
        {/* On utilise notre nouvelle variable imageUrl ici */}
        <img src={imageUrl} alt={property.titre} className="card-image" />
        
        <div className={`card-status-badge ${statusClassName}`}>{property.statutTransaction}</div>
        <button className="card-favorite-btn" onClick={(e) => { e.stopPropagation(); /* Logique favori */ }}>
          <FaHeart />
        </button>
      </div>
      <div className="card-info">
        <h3 className="card-title">{property.titre}</h3>
        <p className="card-location">{property.ville}, {property.quartier || ''}</p>
        <div className="card-features">
          <span><FaBed /> {property.nombreDeChambres} chambres</span>
          <span><FaRulerCombined /> {property.surface} m²</span>
        </div>
        <div className="card-footer">
          <span className="card-price">{property.prix ? property.prix.toLocaleString('fr-FR') + ' EUR' : 'Prix sur demande'}</span>
          <span className="card-arrow"><FaArrowRight /></span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;