import React, { useState, useEffect } from 'react';
import './ProprietairesList.css';
import ProprietaireDetailsModal from './ProprietaireDetailsModal';
import ProprietaireEditModal from './ProprietaireEditModal';

const ProprietairesList = () => {
  const [proprietaires, setProprietaires] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    telephone: '',
    proprietaireId: ''
  });

  // États pour les modals
  const [selectedProprietaire, setSelectedProprietaire] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProprietaires();
  }, []);

  const fetchProprietaires = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5257/api/proprietaires');
      if (response.ok) {
        const data = await response.json();
        setProprietaires(data);
        console.log('Propriétaires chargés:', data);
      } else {
        console.error('Erreur lors du chargement des propriétaires:', response.status);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredProprietaires = proprietaires.filter(proprietaire => {
    const matchesSearch = !filters.search || 
      proprietaire.nom.toLowerCase().includes(filters.search.toLowerCase()) ||
      proprietaire.prenom.toLowerCase().includes(filters.search.toLowerCase()) ||
      proprietaire.email.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesTelephone = !filters.telephone || 
      proprietaire.telephone.includes(filters.telephone);
    
    const matchesProprietaireId = !filters.proprietaireId || 
      proprietaire.id?.toString().includes(filters.proprietaireId);
    
    return matchesSearch && matchesTelephone && matchesProprietaireId;
  });

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce propriétaire ?')) {
      try {
        const response = await fetch(`http://localhost:5257/api/proprietaires/${id}`, {
          method: 'DELETE'
        });
        if (response.ok) {
          fetchProprietaires(); // Recharger la liste
        } else {
          alert('Erreur lors de la suppression');
        }
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleViewDetails = (proprietaire) => {
    setSelectedProprietaire(proprietaire);
    setShowDetailsModal(true);
  };

  const handleEdit = (proprietaire) => {
    setSelectedProprietaire(proprietaire);
    setShowEditModal(true);
  };

  const handleUpdateProprietaire = (updatedProprietaire) => {
    setProprietaires(prev => 
      prev.map(p => p.id === updatedProprietaire.id ? updatedProprietaire : p)
    );
  };

  if (loading) {
    return (
      <div className="proprietaires-section">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des propriétaires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="proprietaires-section">
      <div className="section-header">
        <h2>Gestion des Propriétaires</h2>
        <button className="btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Ajouter un Propriétaire
        </button>
      </div>

      {/* Filtres */}
      <div className="filters-section">
        <div className="filters-grid">
          <div className="filter-group">
            <label>Rechercher par nom, prénom ou email</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Rechercher..."
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Rechercher par numéro de téléphone</label>
            <input
              type="text"
              name="telephone"
              value={filters.telephone}
              onChange={handleFilterChange}
              placeholder="Numéro de téléphone"
              className="filter-input"
            />
          </div>

          <div className="filter-group">
            <label>Rechercher par ID du propriétaire</label>
            <input
              type="text"
              name="proprietaireId"
              value={filters.proprietaireId}
              onChange={handleFilterChange}
              placeholder="ID du propriétaire"
              className="filter-input"
            />
          </div>
        </div>
      </div>

      {/* Table des propriétaires */}
      <div className="proprietaires-table-container">
        <table className="proprietaires-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Adresse</th>
              <th>Nombre de Biens</th>
              <th>Date de Création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProprietaires.length === 0 ? (
              <tr>
                <td colSpan="9" className="no-results">
                  <div className="no-results-content">
                    <div className="no-results-icon">📋</div>
                    <h3>Aucun propriétaire trouvé</h3>
                    <p>Aucun propriétaire ne correspond à vos critères de recherche.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProprietaires.map(proprietaire => (
                <tr key={proprietaire.id}>
                  <td className="proprietaire-id">#{proprietaire.id}</td>
                  <td className="proprietaire-nom">{proprietaire.nom}</td>
                  <td className="proprietaire-prenom">{proprietaire.prenom}</td>
                  <td className="proprietaire-email">{proprietaire.email}</td>
                  <td className="proprietaire-telephone">{proprietaire.telephone}</td>
                  <td className="proprietaire-adresse">{proprietaire.adresse}</td>
                  <td className="proprietaire-nombre-biens">
                    <span className="badge">{proprietaire.nombreBiens}</span>
                  </td>
                  <td className="proprietaire-date">
                    {new Date(proprietaire.dateCreation).toLocaleDateString('fr-FR')}
                  </td>
                                     <td className="action-buttons">
                     <button 
                       className="action-btn view-btn" 
                       title="Voir les détails"
                       onClick={() => handleViewDetails(proprietaire)}
                     >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                         <circle cx="12" cy="12" r="3"></circle>
                       </svg>
                     </button>
                     <button 
                       className="action-btn edit-btn" 
                       title="Modifier"
                       onClick={() => handleEdit(proprietaire)}
                     >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                         <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                       </svg>
                     </button>
                     <button 
                       className="action-btn delete-btn" 
                       title="Supprimer"
                       onClick={() => handleDelete(proprietaire.id)}
                     >
                       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                         <polyline points="3,6 5,6 21,6"></polyline>
                         <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                         <line x1="10" y1="11" x2="10" y2="17"></line>
                         <line x1="14" y1="11" x2="14" y2="17"></line>
                       </svg>
                     </button>
                   </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Statistiques */}
      <div className="proprietaires-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>Total Propriétaires</h3>
            <p className="stat-value">{proprietaires.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🏠</div>
          <div className="stat-content">
            <h3>Biens en Gestion</h3>
            <p className="stat-value">
              {proprietaires.reduce((total, p) => total + p.nombreBiens, 0)}
            </p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>Nouveaux ce mois</h3>
            <p className="stat-value">
              {proprietaires.filter(p => {
                const date = new Date(p.dateCreation);
                const now = new Date();
                return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
                 </div>
       </div>

       {/* Modals */}
       <ProprietaireDetailsModal
         proprietaire={selectedProprietaire}
         isOpen={showDetailsModal}
         onClose={() => {
           setShowDetailsModal(false);
           setSelectedProprietaire(null);
         }}
       />

       <ProprietaireEditModal
         proprietaire={selectedProprietaire}
         isOpen={showEditModal}
         onClose={() => {
           setShowEditModal(false);
           setSelectedProprietaire(null);
         }}
         onUpdate={handleUpdateProprietaire}
       />
     </div>
   );
 };

export default ProprietairesList;
