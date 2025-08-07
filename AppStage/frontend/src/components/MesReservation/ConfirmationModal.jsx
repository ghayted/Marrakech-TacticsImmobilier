import React from 'react';
import { FaInfoCircle, FaExclamationTriangle } from 'react-icons/fa';

const ConfirmationModal = ({ onConfirm, onCancel, message, reservation }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="modal-header">
        <h3>Confirmation d'annulation</h3>
      </div>
      <div className="modal-body">
        <p className="modal-message">{message}</p>
        
        {/* Informations sur la politique de remboursement */}
        <div className="refund-policy-info">
          <div className="refund-policy-header">
            <FaInfoCircle className="policy-icon" />
            <span>Politique de remboursement</span>
          </div>
          <div className="refund-policy-details">
            <div className="policy-item">
              <strong>✅ Annulation plus de 5 jours avant la réservation :</strong>
              <span>Remboursement de 100% du montant payé</span>
            </div>
            <div className="policy-item">
              <strong>⚠️ Annulation 5 jours ou moins avant la réservation :</strong>
              <span>Remboursement de 50% du montant payé</span>
            </div>
          </div>
        </div>
        
        {/* Avertissement */}
        <div className="refund-warning">
          <FaExclamationTriangle className="warning-icon" />
          <span>Cette action est irréversible. Le remboursement sera traité selon notre politique.</span>
        </div>
      </div>
      <div className="modal-actions">
        <button onClick={onCancel} className="btn-secondary">Non, garder ma réservation</button>
        <button onClick={onConfirm} className="btn-danger">Oui, annuler ma réservation</button>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;