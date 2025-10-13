import React, { useState, useEffect } from 'react';
import './ProprietaireEditModal.css';

const ProprietaireEditModal = ({ proprietaire, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (proprietaire) {
      setFormData({
        nom: proprietaire.nom || '',
        prenom: proprietaire.prenom || '',
        email: proprietaire.email || '',
        telephone: proprietaire.telephone || '',
        adresse: proprietaire.adresse || ''
      });
    }
  }, [proprietaire]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`https://api.immotactics.live/api/proprietaires/${proprietaire.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const updatedProprietaire = await response.json();
        onUpdate(updatedProprietaire);
        onClose();
      } else {
        alert('Erreur lors de la modification du propriétaire');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la modification du propriétaire');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !proprietaire) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Modifier le Propriétaire</h2>
          <button className="close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="nom">Nom *</label>
              <input
                type="text"
                id="nom"
                name="nom"
                value={formData.nom}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="prenom">Prénom *</label>
              <input
                type="text"
                id="prenom"
                name="prenom"
                value={formData.prenom}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="telephone">Téléphone *</label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="adresse">Adresse *</label>
              <textarea
                id="adresse"
                name="adresse"
                value={formData.adresse}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn-primary"
              disabled={loading}
            >
              {loading ? 'Modification...' : 'Modifier'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProprietaireEditModal;
