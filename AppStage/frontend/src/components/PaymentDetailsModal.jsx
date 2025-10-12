import React, { useState, useEffect } from 'react';
import './PaymentDetailsModal.css';
import { FaTimes, FaDownload, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

const PaymentDetailsModal = ({ isOpen, onClose, payment }) => {
  const [loading, setLoading] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const backendUrl = 'http://144.24.30.248:5257';

  useEffect(() => {
    if (isOpen && payment) {
      fetchReservationDetails();
    }
  }, [isOpen, payment]);

  const fetchReservationDetails = async () => {
    if (!payment?.reservationId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${backendUrl}/api/Reservations/${payment.reservationId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const reservation = await response.json();
        setReservationDetails(reservation);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des détails de réservation:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !payment) return null;

  const getStatusIcon = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'réussi': return <FaCheckCircle className="status-icon success" />;
      case 'en cours': return <FaExclamationTriangle className="status-icon pending" />;
      case 'échoué': return <FaTimesCircle className="status-icon failed" />;
      default: return <FaExclamationTriangle className="status-icon default" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Header avec statut */}
        <div className="payment-header">
          <div className="payment-title-section">
            <h2>Paiement #{payment.id}</h2>
            <div className="payment-status">
              {getStatusIcon(payment.statutPaiement)}
              <span className="status-text">{payment.statutPaiement}</span>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Montant principal */}
        <div className="payment-amount-section">
          <div className="amount-display">
            <span className="currency">€</span>
            <span className="amount">{payment.montant?.toLocaleString('fr-FR')}</span>
          </div>
          <div className="payment-method">{payment.methodeDePaiement}</div>
          <div className="payment-date">{formatDate(payment.dateDePaiement)}</div>
        </div>

        {/* Informations de transaction */}
        <div className="transaction-info">
          <div className="info-row">
            <span className="label">Transaction ID</span>
            <span className="value transaction-id">{payment.transactionId}</span>
          </div>
          <div className="info-row">
            <span className="label">Réservation</span>
            <span className="value">#{payment.reservationId}</span>
          </div>
        </div>

        {/* Détails de la réservation */}
        {loading ? (
          <div className="loading-section">
            <div className="loading-spinner"></div>
            <span>Chargement des détails...</span>
          </div>
        ) : reservationDetails ? (
          <div className="reservation-details">
            <h3>Détails de la réservation</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Propriété</span>
                <span className="detail-value">{reservationDetails.titreBien}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Client</span>
                <span className="detail-value">{reservationDetails.nomUtilisateur}</span>
              </div>
              {reservationDetails.emailUtilisateur && (
                <div className="detail-item">
                  <span className="detail-label">Email</span>
                  <span className="detail-value">{reservationDetails.emailUtilisateur}</span>
                </div>
              )}
              <div className="detail-item">
                <span className="detail-label">Période</span>
                <span className="detail-value">
                  {new Date(reservationDetails.dateDebut).toLocaleDateString('fr-FR')} → {new Date(reservationDetails.dateFin).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="payment-actions">
          {payment.lienFacture && (
            <a 
              href={`${backendUrl}/${payment.lienFacture}`}
              target="_blank"
              rel="noopener noreferrer"
              className="download-invoice-btn"
            >
              <FaDownload />
              Télécharger la facture
            </a>
          )}
          <button className="close-modal-btn" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetailsModal;