import React from 'react';

const ConfirmationModal = ({ onConfirm, onCancel, message }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <p>{message}</p>
      <div className="modal-actions">
        <button onClick={onCancel} className="btn-secondary">Non</button>
        <button onClick={onConfirm} className="btn-danger">Oui, annuler</button>
      </div>
    </div>
  </div>
);

export default ConfirmationModal;