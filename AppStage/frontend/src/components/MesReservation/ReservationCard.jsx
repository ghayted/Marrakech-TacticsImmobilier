import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaInfoCircle } from 'react-icons/fa';

const ReservationCard = ({ reservation, onCancel }) => {
  const navigate = useNavigate();
  const [refunds, setRefunds] = useState([]);
  const [loadingRefunds, setLoadingRefunds] = useState(false);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Récupérer les informations de remboursement si la réservation est annulée
  useEffect(() => {
    if (reservation.statut === 'Annulée') {
      const fetchRefunds = async () => {
        setLoadingRefunds(true);
        try {
          const token = localStorage.getItem('authToken');
          const response = await fetch(`https://api.immotactics.live/api/Refunds/reservation/${reservation.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (response.ok) {
            const refundsData = await response.json();
            setRefunds(refundsData);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des remboursements:', error);
        } finally {
          setLoadingRefunds(false);
        }
      };
      fetchRefunds();
    }
  }, [reservation.id, reservation.statut]);

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
        
        {/* Affichage des informations de remboursement pour les réservations annulées */}
        {reservation.statut === 'Annulée' && (
          <div className="refund-info">
            {loadingRefunds ? (
              <div className="refund-loading">Chargement des informations de remboursement...</div>
            ) : refunds.length > 0 ? (
              <div className="refund-details">
                <div className="refund-header">
                  <FaInfoCircle className="refund-icon" />
                  <span>Remboursement</span>
                </div>
                {refunds.map((refund, index) => (
                  <div key={refund.id || index} className="refund-item">
                    <div className="refund-amount">
                      <strong>Montant remboursé :</strong> {refund.montantRembourse?.toLocaleString('fr-FR')} €
                    </div>
                    <div className="refund-status">
                      <strong>Statut :</strong> {refund.statutRemboursement}
                    </div>
                    <div className="refund-reason">
                      <strong>Raison :</strong> {refund.raisonRemboursement}
                    </div>
                    {refund.lienFactureRemboursement && (
                      <div className="refund-invoice">
                        <a 
                          href={refund.lienFactureRemboursement} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="refund-invoice-link"
                        >
                          📄 Télécharger la facture de remboursement
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="refund-no-info">
                <FaInfoCircle className="refund-icon" />
                <span>Aucune information de remboursement disponible</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;