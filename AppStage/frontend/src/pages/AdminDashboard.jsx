"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useNavigate } from "react-router-dom"
import "./AdminDashboard.css"
import PropertyModal from "./PropertyModal"
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

// Composants d'icônes simples
const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="m21 21-4.35-4.35"></path>
  </svg>
)

const FilterIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"></polygon>
  </svg>
)

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
)

const TrendingUpIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"></polyline>
    <polyline points="17,6 23,6 23,12"></polyline>
  </svg>
)

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const DollarSignIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const Trash2Icon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

// Icônes pour les onglets du formulaire
const InfoIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
)

const BuildingIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="6" y="4" width="4" height="4"></rect>
    <rect x="6" y="12" width="4" height="4"></rect>
    <rect x="14" y="4" width="4" height="4"></rect>
    <rect x="14" y="12" width="4" height="4"></rect>
    <rect x="2" y="20" width="20" height="2"></rect>
  </svg>
)

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
)

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
)

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
)

const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
)

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17,8 12,3 7,8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
  </svg>
)

const StarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
  </svg>
)

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
)

const StatCard = ({ title, value, icon: Icon, iconClass }) => (
  <div className="stat-card">
    <div className="stat-card-content">
      <div className="stat-card-info">
        <p className="stat-card-title">{title}</p>
        <p className="stat-card-value">{value}</p>
      </div>
      <div className={`stat-card-icon ${iconClass}`}>
        <Icon />
      </div>
    </div>
  </div>
)

function AdminDashboard() {
  const navigate = useNavigate()
  const [stats, setStats] = useState({ total: 0, aVendre: 0, aLouer: 0, vendusLoues: 0 })
  const [biens, setBiens] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ recherche: "", typeDeBienNom: "", statut: "", ville: "", prixMin: "", prixMax: "", triParPrix: "", quartier: "" })
  const [showModal, setShowModal] = useState(false)
  const [activeTab, setActiveTab] = useState(0) // Pour les onglets du formulaire
  const [formData, setFormData] = useState({
    titre: "",
    description: "",
    prix: "",
    adresse: "",
    ville: "",
    surface: "",
    nombreDeChambres: "",
    nombreDeSallesDeBain: "",
    nombreDeSalons: "",
    nombreDeCuisines: "",
    latitude: "",
    longitude: "",
    typeDeBienId: "1",
    statutTransaction: "À Vendre",
    amenagementIds: [],
    ImageUrls: [],
  })

  const [submitting, setSubmitting] = useState(false)
  const [localImages, setLocalImages] = useState([]) // [{file, url}]
  const [editingBien, setEditingBien] = useState(null) // Pour stocker le bien à modifier
  const [isModalOpen, setIsModalOpen] = useState(false) // Pour gérer l'ouverture/fermeture de la modale

  const token = localStorage.getItem("authToken")
  const backendUrl = "http://localhost:5257";

  // Ajout de la liste statique des aménagements
  const AMENAGEMENTS = [
    { id: 1, nom: "Jardin" },
    { id: 2, nom: "Piscine" },
    { id: 3, nom: "Garage" },
    { id: 4, nom: "Balcon" },
    { id: 5, nom: "Terrasse" },
    { id: 6, nom: "Climatisation" },
  ];

  // Définition des onglets
  const formTabs = [
    { id: 0, label: "Général", icon: InfoIcon },
    { id: 1, label: "Pièces", icon: BuildingIcon },
    { id: 2, label: "Localisation", icon: MapPinIcon },
    { id: 3, label: "Photos", icon: CameraIcon },
  ]

  const fetchBiens = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filters.recherche) params.append("recherche", filters.recherche)
    if (filters.typeDeBienNom) params.append("typeDeBienNom", filters.typeDeBienNom)
    if (filters.statut) params.append("statut", filters.statut)
    if (filters.ville) params.append("ville", filters.ville)
    if (filters.prixMin) params.append("prixMin", filters.prixMin)
    if (filters.prixMax) params.append("prixMax", filters.prixMax)
    if (filters.triParPrix) params.append("triParPrix", filters.triParPrix)
    if (filters.quartier) params.append("quartier", filters.quartier)
    const url = `http://localhost:5257/api/BiensImmobiliers?${params.toString()}`

    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      const data = await response.json()
      setBiens(data)
    } catch (error) {
      console.error("Erreur lors de la récupération des biens:", error)
      setBiens([])
    }
    setLoading(false)
  }, [filters, token])

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Fetch Stats
        const statsResponse = await fetch("http://localhost:5257/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        })
        const statsData = await statsResponse.json()
        setStats(statsData)

        // Fetch Biens
        fetchBiens()
      } catch (error) {
        console.error("Erreur lors du chargement initial:", error)
      }
    }

    fetchInitialData()
  }, [fetchBiens, token])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const handleResetFilters = () => {
    setFilters({ recherche: "", typeDeBienNom: "", statut: "", ville: "", prixMin: "", prixMax: "", triParPrix: "", quartier: "" })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce bien ?")) {
      try {
        await fetch(`http://localhost:5257/api/BiensImmobiliers/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        })
        fetchBiens()
      } catch (error) {
        console.error("Erreur lors de la suppression:", error)
      }
    }
  }

  const handleAddNew = () => {
    setActiveTab(0) // Réinitialiser à l'onglet 0
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setActiveTab(0)
    setSubmitting(false)
    setFormData({
      titre: "",
      description: "",
      prix: "",
      adresse: "",
      ville: "",
      surface: "",
      nombreDeChambres: "",
      nombreDeSallesDeBain: "",
      nombreDeSalons: "",
      nombreDeCuisines: "",
      latitude: "",
      longitude: "",
      typeDeBienId: "1",
      statutTransaction: "À Vendre",
      amenagementIds: [],
      ImageUrls: [],
    })
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleLocalImageChange = (e) => {
    const files = Array.from(e.target.files)
    const images = files.map(file => ({
      file,
      url: URL.createObjectURL(file)
    }))
    setLocalImages(images)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submitData = {
        titre: formData.titre,
        description: formData.description,
        prix: Number.parseFloat(formData.prix),
        adresse: formData.adresse,
        ville: formData.ville,
        surface: Number.parseFloat(formData.surface),
        nombreDeChambres: formData.nombreDeChambres ? Number.parseInt(formData.nombreDeChambres) : 0,
        nombreDeSallesDeBain: formData.nombreDeSallesDeBain ? Number.parseInt(formData.nombreDeSallesDeBain) : 0,
        nombreDeSalons: formData.nombreDeSalons ? Number.parseInt(formData.nombreDeSalons) : 0,
        nombreDeCuisines: formData.nombreDeCuisines ? Number.parseInt(formData.nombreDeCuisines) : 0,
        latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
        typeDeBienId: Number.parseInt(formData.typeDeBienId),
        statutTransaction: formData.statutTransaction,
        amenagementIds: formData.amenagementIds,
        ImageUrls: formData.ImageUrls, // c'est déjà un tableau de string
      }

      const response = await fetch("http://localhost:5257/api/BiensImmobiliers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(submitData),
      })

      if (response.ok) {
        alert("Bien créé avec succès !")
        handleCloseModal()
        fetchBiens()
      } else {
        const errorData = await response.text()
        console.error("Erreur serveur:", errorData)
        alert(`Erreur lors de la création du bien: ${response.status}`)
      }
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la création du bien")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (bien) => {
    // Charger le bien complet depuis l’API (avec imagesBiens)
    const response = await fetch(`http://localhost:5257/api/BiensImmobiliers/${bien.id}`);
    const bienComplet = await response.json();
    setEditingBien(bienComplet);
    setIsModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsModalOpen(false);
    setEditingBien(null);
  };

  const handleSaveEdit = async (updatedBien) => {
    try {
      const response = await fetch(`http://localhost:5257/api/BiensImmobiliers/${updatedBien.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedBien),
      });

      if (response.ok) {
        alert("Bien modifié avec succès !");
        handleCloseEditModal();
        fetchBiens(); // Rafraîchir la liste
      } else {
        const errorData = await response.text();
        console.error("Erreur serveur:", errorData);
        alert(`Erreur lors de la modification du bien: ${response.status}`);
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la modification du bien");
    }
  };

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case "À Vendre":
        return "a-vendre"
      case "À Louer":
        return "a-louer"
      case "Vendu":
        return "vendu"
      case "Loué":
        return "loue"
      default:
        return "a-vendre"
    }
  }

  const nextTab = () => {
    if (activeTab < formTabs.length - 1) {
      setActiveTab(activeTab + 1)
    }
  }

  const prevTab = () => {
    if (activeTab > 0) {
      setActiveTab(activeTab - 1)
    }
  }

  const mapRef = useRef();

  useEffect(() => {
    if (activeTab === 2 && mapRef.current) {
      setTimeout(() => {
        if (mapRef.current && mapRef.current.invalidateSize) {
          mapRef.current.invalidateSize();
        }
      }, 200);
    }
  }, [activeTab]);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="dashboard-header-container">
          <div className="dashboard-header-content">
            <div>
              <h1 className="dashboard-title">Tableau de bord</h1>
              <p className="dashboard-subtitle">Gérez vos biens immobiliers</p>
            </div>
            <button className="btn-add" onClick={handleAddNew}>
              <PlusIcon />
              Nouveau Bien
            </button>
          </div>
        </div>
      </div>

      <div className="dashboard-main">
        {/* Stats Cards */}
        <div className="stats-grid">
          <StatCard title="Total des biens" value={stats.total} icon={HomeIcon} iconClass="blue" />
          <StatCard title="À vendre" value={stats.aVendre} icon={TrendingUpIcon} iconClass="emerald" />
          <StatCard title="À louer" value={stats.aLouer} icon={UsersIcon} iconClass="blue" />
          <StatCard title="Vendus/Loués" value={stats.vendusLoues} icon={DollarSignIcon} iconClass="gray" />
        </div>

        {/* Filters */}
        <div className="filter-box">
          <div className="filter-header">
            <FilterIcon />
            <h2 className="filter-title">Filtres et recherche</h2>
          </div>
          <div className="filters">
            <div className="filter-input-wrapper">
              <SearchIcon />
              <input
                type="text"
                name="recherche"
                placeholder="Rechercher par titre, ville, adresse ou quartier..."
                value={filters.recherche}
                onChange={handleFilterChange}
                className="filter-input with-icon"
              />
            </div>
            <select
              name="typeDeBienNom"
              value={filters.typeDeBienNom}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les types</option>
              <option value="Villa">Villa</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Studio">Studio</option>
            </select>
            <select name="statut" value={filters.statut} onChange={handleFilterChange} className="filter-select">
              <option value="">Tous les statuts</option>
              <option value="À Vendre">À Vendre</option>
              <option value="À Louer">À Louer</option>
            </select>
            <input
              type="text"
              name="ville"
              placeholder="Ville"
              value={filters.ville}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <select
              name="quartier"
              value={filters.quartier}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tous les quartiers</option>
              <option value="Guéliz">Guéliz</option>
              <option value="Hivernage">Hivernage</option>
              <option value="Palmeraie">Palmeraie</option>
              <option value="Sidi Youssef">Sidi Youssef</option>
              <option value="Ménara">Ménara</option>
              <option value="Agdal">Agdal</option>
              <option value="Targa">Targa</option>
              <option value="Massira">Massira</option>
              <option value="Daoudiate">Daoudiate</option>
              <option value="Semlalia">Semlalia</option>
              <option value="Majorelle">Majorelle</option>
              <option value="Médina">Médina</option>
              <option value="Noria">Noria</option>
              <option value="Prestigia">Prestigia</option>
              <option value="Autre">Autre</option>
            </select>
            <input
              type="number"
              name="prixMin"
              placeholder="Prix min"
              value={filters.prixMin}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <input
              type="number"
              name="prixMax"
              placeholder="Prix max"
              value={filters.prixMax}
              onChange={handleFilterChange}
              className="filter-input"
            />
            <select
              name="triParPrix"
              value={filters.triParPrix}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">Tri par prix</option>
              <option value="asc">Prix croissant</option>
              <option value="desc">Prix décroissant</option>
            </select>
            <button className="btn-reset" onClick={handleResetFilters}>
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Property List */}
        <div className="property-list">
          <div className="property-list-header">
            <h2 className="property-list-title">Liste des biens</h2>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <span className="loading-text">Chargement...</span>
            </div>
          ) : biens.length > 0 ? (
            <table className="property-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Bien</th>
                  <th>Ville</th>
                  <th>Prix</th>
                  <th>Statut</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {biens.map((bien) => (
                    <tr key={bien.id}>
                      <td>
                        <div className="property-table-img-container">
                          {bien.imagePrincipale ? (
                            <img
                              src={bien.imagePrincipale || "/placeholder.svg"}
                              alt={bien.titre}
                              className="property-table-img"
                            />
                          ) : (
                            <div className="property-table-img-placeholder">
                              <HomeIcon />
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="property-info">
                          <div 
                            className="property-title clickable" 
                            onClick={() => navigate(`/property/${bien.id}`)}
                            title="Cliquer pour voir les détails"
                          >
                            {bien.titre}
                          </div>
                          <div className="property-description">{bien.description?.substring(0, 60)}...</div>
                        </div>
                      </td>
                      <td>{bien.ville}</td>
                      <td className="property-price">{bien.prix?.toLocaleString("fr-FR")} €</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(bien.statutTransaction)}`}>
                          <span className="status-badge-dot"></span>
                          {bien.statutTransaction}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                        <button onClick={() => handleEdit(bien)} className="action-btn edit" title="Modifier">
                            <EditIcon />
                          </button>
                          <button onClick={() => handleDelete(bien.id)} className="action-btn delete" title="Supprimer">
                            <Trash2Icon />
                          </button>
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🏠</div>
              <h3 className="no-results-title">Aucun bien trouvé</h3>
              <p className="no-results-text">
                Essayez de modifier vos critères de recherche ou ajoutez un nouveau bien.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal pour nouveau bien avec onglets */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nouveau Bien Immobilier</h2>
              <button className="modal-close" onClick={handleCloseModal} disabled={submitting}>
                <XIcon />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              {/* Onglets */}
              <div className="form-tabs">
                {formTabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    className={`form-tab ${activeTab === tab.id ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                    disabled={submitting}
                  >
                    <tab.icon />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contenu de l'onglet 0 - Informations générales */}
              <div className={`form-tab-content ${activeTab === 0 ? "active" : ""}`}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Titre *</label>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Prix (€) *</label>
                    <input
                      type="number"
                      name="prix"
                      value={formData.prix}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Type de bien *</label>
                    <select
                      name="typeDeBienId"
                      value={formData.typeDeBienId}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    >
                      <option value="1">Villa</option>
                      <option value="2">Appartement</option>
                      <option value="3">Maison</option>
                      <option value="4">Studio</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Statut *</label>
                    <select
                      name="statutTransaction"
                      value={formData.statutTransaction}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    >
                      <option value="À Vendre">À Vendre</option>
                      <option value="À Louer">À Louer</option>
                      
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Surface (m²) *</label>
                    <input
                      type="number"
                      name="surface"
                      value={formData.surface}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group full-width">
                    <label>Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleFormChange}
                      rows="3"
                      disabled={submitting}
                    />
                  </div>
                </div>
              </div>

              {/* Contenu de l'onglet 1 - Détails des pièces */}
              <div className={`form-tab-content ${activeTab === 1 ? "active" : ""}`}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Chambres</label>
                    <input
                      type="number"
                      name="nombreDeChambres"
                      value={formData.nombreDeChambres}
                      onChange={handleFormChange}
                      min="0"
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salles de bain</label>
                    <input
                      type="number"
                      name="nombreDeSallesDeBain"
                      value={formData.nombreDeSallesDeBain}
                      onChange={handleFormChange}
                      min="0"
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Salons</label>
                    <input
                      type="number"
                      name="nombreDeSalons"
                      value={formData.nombreDeSalons}
                      onChange={handleFormChange}
                      min="0"
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Cuisines</label>
                    <input
                      type="number"
                      name="nombreDeCuisines"
                      value={formData.nombreDeCuisines}
                      onChange={handleFormChange}
                      min="0"
                      disabled={submitting}
                    />
                  </div>
                </div>
                {/* Ajout des aménagements */}
                <div className="form-group full-width">
                  <label>Aménagements</label>
                  <div className="amenagements-checkboxes">
                    {AMENAGEMENTS.map(a => (
                      <label key={a.id} style={{ marginRight: 12 }}>
                        <input
                          type="checkbox"
                          value={a.id}
                          checked={formData.amenagementIds.includes(a.id)}
                          onChange={e => {
                            const id = a.id;
                            setFormData(prev => ({
                              ...prev,
                              amenagementIds: e.target.checked
                                ? [...prev.amenagementIds, id]
                                : prev.amenagementIds.filter(x => x !== id)
                            }));
                          }}
                          disabled={submitting}
                        />
                        {a.nom}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contenu de l'onglet 2 - Localisation */}
              <div className={`form-tab-content ${activeTab === 2 ? "active" : ""}`}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Adresse *</label>
                    <input
                      type="text"
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Ville *</label>
                    <input
                      type="text"
                      name="ville"
                      value={formData.ville}
                      onChange={handleFormChange}
                      required
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleFormChange}
                      disabled={submitting}
                    />
                  </div>
                  <div className="form-group">
                    <label>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleFormChange}
                      disabled={submitting}
                    />
                  </div>
                </div>
                <div style={{ marginTop: 18, marginBottom: 12 }}>
                  <label style={{ fontWeight: 500, marginBottom: 6, display: 'block' }}>Sélectionnez l'emplacement sur la carte :</label>
                  <MapContainer
                    ref={mapRef}
                    center={[(formData.latitude && !isNaN(formData.latitude)) ? parseFloat(formData.latitude) : 33.5731, (formData.longitude && !isNaN(formData.longitude)) ? parseFloat(formData.longitude) : -7.5898]}
                    zoom={13}
                    style={{ height: 260, width: '100%', borderRadius: 8, border: '1.5px solid #e6e6e6' }}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; OpenStreetMap contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <LocationMarker
                      position={
                        (formData.latitude && formData.longitude && !isNaN(formData.latitude) && !isNaN(formData.longitude))
                          ? [parseFloat(formData.latitude), parseFloat(formData.longitude)]
                          : null
                      }
                      setFormData={setFormData}
                    />
                  </MapContainer>
                  <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                    Cliquez sur la carte pour choisir la position du bien.
                  </div>
                </div>
              </div>

              {/* Contenu de l'onglet 3 - Photos */}
              <div className={`form-tab-content ${activeTab === 3 ? "active" : ""}`}>
                <div className="form-group full-width">
                  <label>Images du bien</label>
                  {/* Affichage des images existantes en miniatures côte à côte */}
                  <div className="images-list" style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 12 }}>
                    {(formData.ImageUrls || []).map((url, idx) => {
                      const fullUrl = url.startsWith('http') ? url : backendUrl + url;
                      return (
                        <div key={idx} style={{ position: 'relative', display: 'inline-block' }}>
                          <img src={fullUrl} alt="img" style={{ width: 80, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #eee', boxShadow: '0 1px 4px #0001' }} />
                          <button type="button" style={{ position: 'absolute', top: 2, right: 2, color: 'red', fontWeight: 'bold', border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
                            title="Supprimer cette image"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              ImageUrls: prev.ImageUrls.filter((_, i) => i !== idx)
                            }))}>
                            ×
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  {/* Upload de fichiers depuis le PC */}
                  <div style={{ marginTop: 16, padding: 16, border: '2px dashed #ddd', borderRadius: 8, textAlign: 'center' }}>
                    <label htmlFor="file-upload-add" style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>📁</div>
                      <span style={{ color: '#666' }}>Cliquez ici pour choisir des images depuis votre PC</span>
                      <input
                        id="file-upload-add"
                        type="file"
                        multiple
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const uploadToCloudinary = async (file) => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("upload_preset", "default");
                            const res = await fetch(
                              "https://api.cloudinary.com/v1_1/ds2h1vtel/image/upload",
                              { method: "POST", body: formData }
                            );
                            if (!res.ok) throw new Error("Erreur upload Cloudinary");
                            const data = await res.json();
                            return data.secure_url;
                          };
                          const files = Array.from(e.target.files);
                          if (files.length === 0) return;
                          try {
                            const uploadedUrls = [];
                            for (const file of files) {
                              const url = await uploadToCloudinary(file);
                              uploadedUrls.push(url);
                            }
                            setFormData(prev => ({
                              ...prev,
                              ImageUrls: [...(prev.ImageUrls || []), ...uploadedUrls]
                            }));
                          } catch (error) {
                            console.error('Erreur upload:', error);
                            alert("Erreur lors de l'upload des images");
                          }
                          e.target.value = '';
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Navigation entre onglets */}
              <div className="form-navigation">
                <div className="form-nav-buttons">
                  <button type="button" className="btn-prev" onClick={prevTab} disabled={activeTab === 0 || submitting}>
                    <ChevronLeftIcon />
                    Précédent
                  </button>
                  <button
                    type="button"
                    className="btn-next"
                    onClick={nextTab}
                    disabled={activeTab === formTabs.length - 1 || submitting}
                  >
                    Suivant
                    <ChevronRightIcon />
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {activeTab + 1} / {formTabs.length}
                </span>
              </div>
            </form>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={handleCloseModal} disabled={submitting}>
                Annuler
              </button>
              <button type="submit" className="btn-submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? "Création en cours..." : "Créer le bien"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal pour modifier un bien existant */}
      {isModalOpen && editingBien && (
        <PropertyModal
          bienInitial={editingBien}
          onClose={handleCloseEditModal}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  )
}

function LocationMarker({ position, setFormData }) {
  useMapEvents({
    click(e) {
      setFormData(prev => ({
        ...prev,
        latitude: e.latlng.lat.toFixed(6),
        longitude: e.latlng.lng.toFixed(6)
      }));
    }
  });
  return position ? <Marker position={position} /> : null;
}

export default AdminDashboard
