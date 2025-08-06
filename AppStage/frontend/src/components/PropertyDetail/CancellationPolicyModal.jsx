import React from 'react';
import './CancellationPolicyModal.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const options = { day: '2-digit', month: 'short' };
  const dayMonth = date.toLocaleDateString('fr-FR', options);
  return `${dayMonth}`;
}

function formatDateTime(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  // Set hour to 15:00
  date.setHours(15, 0, 0, 0);
  const options = { day: '2-digit', month: 'short' };
  const dayMonth = date.toLocaleDateString('fr-FR', options);
  return `${dayMonth}. 15:00`;
}

const CancellationPolicyModal = ({ isOpen, onClose, dateDebut }) => {
  if (!isOpen) return null;

  let fullRefundDate = '';
  let partialRefundDate = '';
  if (dateDebut) {
    const d = new Date(dateDebut);
    // 5 jours avant
    const d5 = new Date(d);
    d5.setDate(d.getDate() - 5);
    d5.setHours(15, 0, 0, 0);
    fullRefundDate = formatDateTime(d5);
    // Jour même
    d.setHours(15, 0, 0, 0);
    partialRefundDate = formatDateTime(d);
  }

  return (
    <div className="cancellation-modal-overlay">
      <div className="cancellation-modal-content">
        <button className="cancellation-modal-close" onClick={onClose}>&times;</button>
        <h2>Conditions d'annulation</h2>
        {dateDebut ? (
          <>
            <div className="cancellation-modal-section">
              <div>
                <strong>Avant<br/>{fullRefundDate}</strong>
              </div>
              <div>
                <strong>Remboursement intégral</strong><br/>
                Obtenez un remboursement de 100 % du montant que vous avez payé.
              </div>
            </div>
            <hr />
            <div className="cancellation-modal-section">
              <div>
                <strong>Avant<br/>{partialRefundDate}</strong>
              </div>
              <div>
                <strong>Remboursement partiel</strong><br/>
                Obtenez un remboursement de 50 % du prix de chaque nuit, à l'exception de la première. Aucun remboursement de la première nuit ni des frais de service.
              </div>
            </div>
          </>
        ) : (
          <div style={{textAlign:'center', color:'#888', margin:'2rem 0'}}>Aucune date sélectionnée</div>
        )}
      </div>
    </div>
  );
};

export default CancellationPolicyModal;