import React, { useState, useEffect } from 'react';
import './ProprietaireDetailsModal.css';

const ProprietaireDetailsModal = ({ proprietaire, isOpen, onClose }) => {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && proprietaire) {
      fetchBiens();
    }
  }, [isOpen, proprietaire]);

  const fetchBiens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5257/api/biensimmobiliers?proprietaireId=${proprietaire.id}`);
      if (response.ok) {
        const data = await response.json();
        setBiens(data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des biens:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !proprietaire) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Détails du Propriétaire</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Informations du propriétaire */}
          <div className="proprietaire-info">
            <h3>Informations Personnelles</h3>
            <div className="info-grid">
              <div className="info-item">
                <label>Nom complet:</label>
                <span>{proprietaire.nom} {proprietaire.prenom}</span>
              </div>
              <div className="info-item">
                <label>Email:</label>
                <span>{proprietaire.email}</span>
              </div>
              <div className="info-item">
                <label>Téléphone:</label>
                <span>{proprietaire.telephone}</span>
              </div>
              <div className="info-item">
                <label>Adresse:</label>
                <span>{proprietaire.adresse}</span>
              </div>
              <div className="info-item">
                <label>Date de création:</label>
                <span>{new Date(proprietaire.dateCreation).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>

          {/* Liste des biens */}
          <div className="biens-section">
            <h3>Biens Immobiliers ({biens.length})</h3>
            {loading ? (
              <div className="loading">Chargement des biens...</div>
            ) : biens.length === 0 ? (
              <div className="no-biens">
                <p>Aucun bien immobilier associé à ce propriétaire.</p>
              </div>
            ) : (
              <div className="biens-list">
                                 {biens.map(bien => (
                   <div key={bien.id} className="bien-card">
                     <div className="bien-header">
                       <h4>#{bien.id} - {bien.titre}</h4>
                       <span className={`statut ${bien.statutTransaction.toLowerCase()}`}>
                         {bien.statutTransaction}
                       </span>
                     </div>
                     <div className="bien-details">
                       <p><strong>ID:</strong> #{bien.id}</p>
                       <p><strong>Adresse:</strong> {bien.adresse || 'Non renseignée'}</p>
                       <p><strong>Ville:</strong> {bien.ville || 'Non renseignée'}</p>
                       <p><strong>Prix:</strong> {bien.prix ? `${bien.prix.toLocaleString('fr-FR')} MAD` : 'Non renseigné'}</p>
                       <p><strong>Surface:</strong> {bien.surface ? `${bien.surface} m²` : 'Non renseignée'}</p>
                       <p><strong>Type:</strong> {bien.typeDeBien?.nom || 'Non renseigné'}</p>
                       <p><strong>Chambres:</strong> {bien.nombreDeChambres || 0}</p>
                       <p><strong>Salles de bain:</strong> {bien.nombreDeSallesDeBain || 0}</p>
                       <p><strong>Date de publication:</strong> {bien.dateDePublication ? new Date(bien.dateDePublication).toLocaleDateString('fr-FR') : 'Non renseignée'}</p>
                     </div>
                   </div>
                 ))}
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProprietaireDetailsModal;
