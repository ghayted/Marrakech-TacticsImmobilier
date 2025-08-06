import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers } from 'react-icons/fa';

const ReservationCard = ({ reservation, onCancel }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // --- 👇 NOUVELLE LOGIQUE POUR TROUVER L'IMAGE PRINCIPALE 👇 ---
  const findMainImageUrl = (images) => {
    // S'il n'y a pas de tableau d'images, on retourne une image par défaut
    if (!images || images.length === 0) {
      return '/placeholder-property.jpg';
    }

    // On cherche l'image marquée comme principale
    const mainImage = images.find(img => img.estImagePrincipale === true);

    // Si on en trouve une, on retourne son URL.
    // Sinon, par sécurité, on prend la toute première image de la liste.
    return mainImage ? mainImage.urlImage : images[0].urlImage;
  };

  // On appelle la fonction avec le tableau d'images de la réservation
  const imageUrl = findMainImageUrl(reservation.imagesBiens);
  // --- FIN DE LA NOUVELLE LOGIQUE ---

  return (
    <div className="reservation-card">
      <div className="reservation-card-image" onClick={() => navigate(`/property/${reservation.bienImmobilierId}`)}>
        {/* On utilise notre nouvelle variable imageUrl */}
        <img src={imageUrl} alt={reservation.titreBien} />
      </div>
      <div className="reservation-card-details">
        <div className="reservation-card-header">
          <h3 onClick={() => navigate(`/property/${reservation.bienImmobilierId}`)}>{reservation.titreBien || 'Bien inconnu'}</h3>
          <span className={`status-badge status-${reservation.statut?.toLowerCase()}`}>
            {reservation.statut}
          </span>
        </div>
        <p className="location"><FaMapMarkerAlt /> {reservation.ville || 'Ville inconnue'}</p>
        
        <div className="info-line">
          <FaCalendarAlt /> 
          <span>{formatDate(reservation.dateDebut)} - {formatDate(reservation.dateFin)}</span>
        </div>
        <div className="info-line">
          <FaUsers />
          <span>{reservation.nombreDeVoyageurs} voyageur{reservation.nombreDeVoyageurs > 1 ? 's' : ''}</span>
        </div>
        <div className="reservation-card-footer">
          <span className="price">Total : {reservation.prixTotal?.toLocaleString('fr-FR')} €</span>
          {reservation.statut === 'Confirmée' && (
            <button className="cancel-btn" onClick={onCancel}>
              Annuler la réservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationCard;