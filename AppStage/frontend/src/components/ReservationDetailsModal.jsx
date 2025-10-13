import React, { useState } from 'react';
import './ReservationDetailsModal.css';
import { FaTimes, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaEuroSign, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';

const ReservationDetailsModal = ({ isOpen, onClose, reservation, onCancel, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleCancel = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://api.immotactics.live/api/Reservations/${reservation.id}/annuler`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        onCancel(reservation.id);
        setShowCancelConfirm(false);
        onClose();
      } else {
        alert('Erreur lors de l\'annulation de la réservation');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'annulation de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`https://api.immotactics.live/api/Reservations/${reservation.id}/statut`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ statut: newStatus })
      });

      if (response.ok) {
        onStatusUpdate(reservation.id, newStatus);
        onClose();
      } else {
        alert('Erreur lors de la mise à jour du statut');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour du statut');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    const start = new Date(reservation.dateDebut);
    const end = new Date(reservation.dateFin);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'confirmée': return 'status-confirmed';
      case 'en attente de paiement': return 'status-pending';
      case 'annulée': return 'status-cancelled';
      default: return 'status-default';
    }
  };

  return (
    <div className="reservation-details-overlay" onClick={onClose}>
      <div className="reservation-details-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2>Détails de la Réservation #{reservation.id}</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Content */}
        <div className="modal-content">
          {/* Status */}
          <div className="status-section">
            <span className={`status-badge ${getStatusBadgeClass(reservation.statut)}`}>
              {reservation.statut}
            </span>
            <span className="reservation-date">
              Réservé le {new Date(reservation.dateDeReservation).toLocaleDateString('fr-FR')}
            </span>
          </div>

          {/* Property Information */}
          <div className="info-section">
            <h3><FaMapMarkerAlt /> Propriété</h3>
            <div className="info-content">
              <p className="property-title">{reservation.titreBien}</p>
              <p className="property-ref">Référence: {reservation.bienImmobilierId}</p>
            </div>
          </div>

          {/* Customer Information */}
          <div className="info-section">
            <h3><FaUser /> Informations Client</h3>
            <div className="info-content">
              <div className="client-info-grid">
                <div className="client-info-item">
                  <FaUser className="info-icon" />
                  <span>{reservation.nomUtilisateur}</span>
                </div>
                {reservation.emailUtilisateur && (
                  <div className="client-info-item">
                    <FaEnvelope className="info-icon" />
                    <span>{reservation.emailUtilisateur}</span>
                  </div>
                )}
                {reservation.telephoneUtilisateur && (
                  <div className="client-info-item">
                    <FaPhone className="info-icon" />
                    <span>{reservation.telephoneUtilisateur}</span>
                  </div>
                )}
                <div className="client-info-item">
                  <span className="info-label">ID Client:</span>
                  <span>{reservation.utilisateurId}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reservation Details */}
          <div className="info-section">
            <h3><FaCalendarAlt /> Détails du Séjour</h3>
            <div className="info-content">
              <div className="stay-details-grid">
                <div className="stay-detail">
                  <span className="detail-label">Dates:</span>
                  <span className="detail-value">
                    {new Date(reservation.dateDebut).toLocaleDateString('fr-FR')} → {new Date(reservation.dateFin).toLocaleDateString('fr-FR')}
                  </span>
                </div>
                <div className="stay-detail">
                  <span className="detail-label">Durée:</span>
                  <span className="detail-value">{calculateNights()} nuit(s)</span>
                </div>
                <div className="stay-detail">
                  <FaUsers className="detail-icon" />
                  <span className="detail-value">{reservation.nombreDeVoyageurs} voyageur(s)</span>
                </div>
                <div className="stay-detail">
                  <FaEuroSign className="detail-icon" />
                  <span className="detail-value total-price">{reservation.prixTotal?.toLocaleString('fr-FR')} EUR</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="actions-section">
            <h3>Actions</h3>
            <div className="action-buttons">
              {reservation.statut?.toLowerCase() !== 'annulée' && (
                <>
                  {reservation.statut?.toLowerCase() === 'en attente de paiement' && (
                    <button 
                      className="btn-confirm"
                      onClick={() => handleStatusChange('Confirmée')}
                      disabled={loading}
                    >
                      ✅ Confirmer la réservation
                    </button>
                  )}
                  
                  <button 
                    className="btn-cancel"
                    onClick={() => setShowCancelConfirm(true)}
                    disabled={loading}
                  >
                    ❌ Annuler la réservation
                  </button>
                </>
              )}
              
              <button className="btn-secondary" onClick={onClose}>
                Fermer
              </button>
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="confirm-overlay">
            <div className="confirm-modal">
              <h3>Confirmer l'annulation</h3>
              <p>Êtes-vous sûr de vouloir annuler cette réservation ?</p>
              <p className="warning">Cette action ne peut pas être annulée.</p>
              <div className="confirm-buttons">
                <button 
                  className="btn-cancel-confirm" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  {loading ? 'Annulation...' : 'Oui, annuler'}
                </button>
                <button 
                  className="btn-secondary" 
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={loading}
                >
                  Non, garder
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetailsModal;