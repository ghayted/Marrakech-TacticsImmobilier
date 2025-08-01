"use client"

import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import PropertyModal from "./PropertyModal"
import "./AdminDashboard.css"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js'
import { Bar, Pie, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

// Icônes SVG
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
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

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
)

const BarChartIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
)

const MessageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
  </svg>
)

const FileTextIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14,2 14,8 20,8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10,9 9,9 8,9"></polyline>
  </svg>
)

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
  </svg>
)

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
)

const EditIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
)

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
)

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
)

const CalendarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
)

const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
)

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"></path>
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"></path>
  </svg>
)

// Composant pour les éléments de navigation
const NavItem = ({ icon: Icon, label, active, badge, onClick }) => (
  <button className={`nav-item ${active ? 'active' : ''}`} onClick={onClick}>
    <div className="nav-item-icon">
      <Icon />
    </div>
    <span className="nav-item-label">{label}</span>
    {badge && <span className="nav-item-badge">{badge}</span>}
  </button>
)

function AdminDashboard() {
  const navigate = useNavigate()
  const [activeSection, setActiveSection] = useState('dashboard')
  const [biens, setBiens] = useState([])
  const [reservations, setReservations] = useState([])
  const [paiements, setPaiements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentData, setPaymentData] = useState({
    reservationId: 0,
    montant: 0,
    methodeDePaiement: '',
    transactionId: ''
  })
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    priceMin: '',
    priceMax: '',
    dateFrom: '',
    dateTo: '',
    search: '',
    quartier: '',
    sortByDate: 'desc' // Par défaut, plus récent en premier
  })

  const token = localStorage.getItem("authToken")
  const backendUrl = "http://localhost:5257"

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'properties', label: 'Propriétés', icon: BuildingIcon },
    { id: 'reservations', label: 'Réservations', icon: CalendarIcon },
    { id: 'paiements', label: 'Paiements', icon: FileTextIcon },
    { id: 'analytics', label: 'Analytics', icon: BarChartIcon },
    { id: 'settings', label: 'Paramètres', icon: SettingsIcon }
  ]

  // Charger les données depuis l'API
  const fetchBiens = useCallback(async () => {
    try {
      // Construire les paramètres de requête
      const params = new URLSearchParams()
      if (filters.search) params.append('recherche', filters.search)
      if (filters.type) params.append('typeDeBienNom', filters.type)
      if (filters.status) params.append('statut', filters.status)
      if (filters.priceMin) params.append('prixMin', filters.priceMin)
      if (filters.priceMax) params.append('prixMax', filters.priceMax)
      if (filters.quartier) params.append('quartier', filters.quartier)
      if (filters.sortByDate) params.append('triParDate', filters.sortByDate)

      const response = await fetch(`${backendUrl}/api/BiensImmobiliers?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setBiens(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des biens:', error)
    }
  }, [token, backendUrl, filters])

  const fetchReservations = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/Reservations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des réservations:', error)
    }
  }, [token, backendUrl])

  const fetchPaiements = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/Paiements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setPaiements(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des paiements:', error)
    }
  }, [token, backendUrl])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchReservations(),
        fetchPaiements()
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchReservations, fetchPaiements])

  // Charger les biens séparément pour permettre le filtrage
  useEffect(() => {
    fetchBiens()
  }, [fetchBiens])

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
  }

  const handleAddProperty = () => {
    setSelectedProperty(null) // S'assurer qu'aucune propriété n'est sélectionnée
    setShowModal(true)
  }

  const handleEditProperty = async (property) => {
    try {
      // Récupérer les données complètes du bien avec toutes les relations
      const response = await fetch(`${backendUrl}/api/BiensImmobiliers/${property.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const propertyData = await response.json()
        setSelectedProperty(propertyData) // Utiliser les données complètes
        setShowModal(true)
      } else {
        alert('Erreur lors de la récupération des données du bien')
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la récupération des données du bien')
    }
  }

  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      try {
        const response = await fetch(`${backendUrl}/api/BiensImmobiliers/${propertyId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          await fetchBiens()
          alert('Propriété supprimée avec succès')
        } else {
          alert('Erreur lors de la suppression')
        }
      } catch (error) {
        console.error('Erreur:', error)
        alert('Erreur lors de la suppression')
      }
    }
  }

  const handleSaveProperty = async (propertyData) => {
    try {
      const url = selectedProperty 
        ? `${backendUrl}/api/BiensImmobiliers/${selectedProperty.id}`
        : `${backendUrl}/api/BiensImmobiliers`
      
      const method = selectedProperty ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        await fetchBiens()
        setShowModal(false)
        alert(selectedProperty ? 'Propriété modifiée avec succès' : 'Propriété ajoutée avec succès')
      } else {
        const errorData = await response.json()
        alert(`Erreur: ${errorData.message || 'Erreur lors de la sauvegarde'}`)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la sauvegarde')
    }
  }

  const handleViewReservation = (reservation) => {
    setSelectedReservation(reservation)
    setShowReservationModal(true)
  }

  const handleEditReservation = (reservation) => {
    console.log('handleEditReservation called with:', reservation)
    setSelectedReservation(reservation)
    setPaymentData({
      reservationId: reservation.id,
      montant: reservation.prixTotal,
      methodeDePaiement: '',
      transactionId: ''
    })
    setShowPaymentModal(true)
  }

  const handlePaymentSubmit = async (e) => {
    e.preventDefault()
    console.log('handlePaymentSubmit called with data:', paymentData)
    try {
      const response = await fetch(`${backendUrl}/api/Paiements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      })

      if (response.ok) {
        alert('Paiement enregistré avec succès')
        setShowPaymentModal(false)
        fetchReservations() // Rafraîchir la liste des réservations
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.message || 'Erreur lors de l\'enregistrement du paiement'}`)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de l\'enregistrement du paiement')
    }
  }

  const getStatusBadgeClass = (status) => {
    const statusLower = status?.toLowerCase()
    switch (statusLower) {
      case 'réussi':
      case 'confirmée':
        return 'status-badge confirmee'
      case 'en attente':
      case 'en attente de paiement':
        return 'status-badge en-attente'
      case 'à vendre':
        return 'status-badge a-vendre'
      case 'à louer':
        return 'status-badge a-louer'
      case 'vendu':
        return 'status-badge vendu'
      case 'loué':
        return 'status-badge loue'
      case 'annulé':
        return 'status-badge annule'
      default:
        return 'status-badge en-attente'
    }
  }

  const getStatusText = (status) => {
    return status || 'En attente'
  }

  const getTypeDeBienName = (typeId) => {
    switch (typeId) {
      case 1: return 'Villa'
      case 2: return 'Appartement'
      case 3: return 'Maison'
      case 4: return 'Studio'
      default: return 'N/A'
    }
  }

  // Supprimer le filtrage local car maintenant on utilise l'API
  const filteredBiens = biens

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <BuildingIcon />
            <span>Marraekech TacTics</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <h3 className="nav-section-title">NAVIGATION</h3>
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeSection === item.id}
                onClick={() => handleNavClick(item.id)}
              />
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="btn-add-property" onClick={handleAddProperty}>
            <PlusIcon />
            Ajouter Propriété
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="main-header">
          <div className="header-left">
            <h1 className="page-title">
              {navItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
          </div>
          <div className="header-right">
            <div className="header-actions">
              <button className="header-action">
                <CalendarIcon />
                <span>{new Date().toLocaleDateString()}</span>
              </button>
              <button className="header-action">
                <SunIcon />
              </button>
              <button className="header-action">
                <BellIcon />
              </button>
              <div className="user-profile">
                <div className="user-avatar">AD</div>
                <div className="user-info">
                  <div className="user-name">Admin</div>
                  <div className="user-role">Gestionnaire</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activeSection === 'dashboard' && (
          <div className="dashboard-content">
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <BuildingIcon />
                  </div>
                </div>
                <div className="stat-card-content">
                  <h3 className="stat-card-title">Total Propriétés</h3>
                  <p className="stat-card-value">{biens.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <CalendarIcon />
                  </div>
                </div>
                <div className="stat-card-content">
                  <h3 className="stat-card-title">Réservations</h3>
                  <p className="stat-card-value">{reservations.length}</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <FileTextIcon />
                  </div>
                </div>
                <div className="stat-card-content">
                  <h3 className="stat-card-title">Paiements</h3>
                  <p className="stat-card-value">{paiements.length}</p>
                </div>
              </div>
            </div>

            <div className="content-grid">
              {/* Propriétés récentes */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Propriétés Récentes</h3>
                </div>
                <div className="card-content">
                  <div className="recent-properties">
                    {biens.slice(0, 5).map((bien) => (
                      <div key={bien.id} className="recent-property-item">
                        <div className="property-info">
                          <div className="property-title">{bien.titre}</div>
                          <div className="property-location">{bien.ville}</div>
                        </div>
                        <div className="property-price">€{bien.prix?.toLocaleString()}</div>
                        <span className={`status-badge ${getStatusBadgeClass(bien.statutTransaction)}`}>
                          {getStatusText(bien.statutTransaction)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Réservations récentes */}
              <div className="content-card">
                <div className="card-header">
                  <h3>Réservations Récentes</h3>
                </div>
                <div className="card-content">
                  <div className="recent-reservations">
                    {reservations.slice(0, 5).map((reservation) => (
                      <div key={reservation.id} className="recent-reservation-item">
                                                 <div className="reservation-info">
                           <div className="reservation-property">{reservation.titreBien}</div>
                           <div className="reservation-date">{new Date(reservation.dateDeReservation).toLocaleDateString()}</div>
                         </div>
                        <span className={`status-badge ${getStatusBadgeClass(reservation.statut)}`}>
                          {getStatusText(reservation.statut)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Properties Section */}
        {activeSection === 'properties' && (
          <div className="properties-section">
            <div className="section-header">
              <h2>Gestion des Propriétés</h2>
              <button className="btn-primary" onClick={handleAddProperty}>
                <PlusIcon />
                Ajouter une propriété
              </button>
            </div>

            {/* Filters */}
            <div className="filters-section">
              <div className="filters-grid">
                <input
                  type="text"
                  placeholder="Rechercher par titre ou référence..."
                  className="filter-input"
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
                <select
                  className="filter-select"
                  value={filters.type}
                  onChange={(e) => {
                    console.log('Type sélectionné:', e.target.value)
                    setFilters({...filters, type: e.target.value})
                  }}
                >
                  <option value="">Tous les types</option>
                  <option value="Villa">Villa</option>
                  <option value="Appartement">Appartement</option>
                  <option value="Maison">Maison</option>
                  <option value="Studio">Studio</option>
                </select>
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Tous les statuts</option>
                  <option value="À Vendre">À Vendre</option>
                  <option value="À Louer">À Louer</option>
                  <option value="Vendu">Vendu</option>
                  <option value="Loué">Loué</option>
                </select>
                <select
                  className="filter-select"
                  value={filters.quartier}
                  onChange={(e) => setFilters({...filters, quartier: e.target.value})}
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
                </select>
                <input
                  type="number"
                  placeholder="Prix min"
                  className="filter-input"
                  value={filters.priceMin}
                  onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                />
                                 <input
                   type="number"
                   placeholder="Prix max"
                   className="filter-input"
                   value={filters.priceMax}
                   onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                 />
                 <select
                   className="filter-select"
                   value={filters.sortByDate}
                   onChange={(e) => setFilters({...filters, sortByDate: e.target.value})}
                 >
                   <option value="desc">Plus récent</option>
                   <option value="asc">Plus ancien</option>
                 </select>
              </div>
            </div>

            {/* Properties Table */}
            <div className="properties-table-container">
              <table className="properties-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Propriété</th>
                    <th>Type</th>
                    <th>Prix</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBiens.map((bien) => (
                    <tr key={bien.id}>
                                             <td>
                         <div className="property-image">
                           {bien.imagePrincipale ? (
                             <img src={bien.imagePrincipale} alt={bien.titre} />
                           ) : (
                             <div className="no-image">No Image</div>
                           )}
                         </div>
                       </td>
                      <td>
                        <div className="property-info">
                          <div className="property-title">{bien.titre}</div>
                          <div className="property-location">{bien.ville}</div>
                                                     <div className="property-reference">Ref: 5860{bien.id}</div>
                        </div>
                      </td>
                                             <td>{getTypeDeBienName(bien.typeDeBienId)}</td>
                      <td>€{bien.prix?.toLocaleString()}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(bien.statutTransaction)}`}>
                          {getStatusText(bien.statutTransaction)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn" 
                            title="Voir"
                            onClick={() => navigate(`/property/${bien.id}`)}
                          >
                            <EyeIcon />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Modifier"
                            onClick={() => handleEditProperty(bien)}
                          >
                            <EditIcon />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Supprimer"
                            onClick={() => handleDeleteProperty(bien.id)}
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reservations Section */}
        {activeSection === 'reservations' && (
          <div className="reservations-section">
            <div className="section-header">
              <h2>Gestion des Réservations</h2>
            </div>
            <div className="reservations-table-container">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>Propriété</th>
                    <th>Client</th>
                    <th>Email</th>
                    <th>Téléphone</th>
                    <th>Date Réservation</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.map((reservation) => (
                    <tr key={reservation.id}>
                                             <td>
                         <div className="reservation-property-info">
                           <div className="property-title">{reservation.titreBien || 'N/A'}</div>
                           <div className="property-reference">Ref: {reservation.bienImmobilierId || 'N/A'}</div>
                         </div>
                       </td>
                       <td>
                         <div className="client-info">
                           <div className="client-name">{reservation.nomUtilisateur || 'N/A'}</div>
                           <div className="client-id">ID: {reservation.utilisateurId || 'N/A'}</div>
                         </div>
                       </td>
                       <td>{reservation.emailUtilisateur || 'N/A'}</td>
                       <td>{reservation.telephoneUtilisateur || 'N/A'}</td>
                       <td>
                         {reservation.dateDeReservation ? 
                           new Date(reservation.dateDeReservation).toLocaleDateString('fr-FR') : 
                           'Date invalide'
                         }
                       </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(reservation.statut)}`}>
                          {getStatusText(reservation.statut)}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="action-btn" 
                            title="Voir"
                            onClick={() => handleViewReservation(reservation)}
                          >
                            <EyeIcon />
                          </button>
                          <button 
                            className="action-btn" 
                            title="Modifier"
                            onClick={() => handleEditReservation(reservation)}
                          >
                            <EditIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Paiements Section */}
        {activeSection === 'paiements' && (
          <div className="paiements-section">
            <div className="section-header">
              <h2>Gestion des Paiements</h2>
            </div>
            <div className="paiements-table-container">
              <table className="paiements-table">
                <thead>
                  <tr>
                    <th>Propriété</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Date Paiement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paiements.map((paiement) => (
                    <tr key={paiement.id}>
                      <td>Réservation #{paiement.reservationId}</td>
                      <td>Client #{paiement.reservationId}</td>
                      <td>€{paiement.montant?.toLocaleString()}</td>
                      <td>{new Date(paiement.dateDePaiement).toLocaleString('fr-FR')}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(paiement.statutPaiement)}`}>
                          {paiement.statutPaiement}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          {paiement.lienFacture && (
                            <a 
                              href={`${backendUrl}/${paiement.lienFacture}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn"
                              title="Télécharger la facture"
                            >
                              <FileTextIcon />
                            </a>
                          )}
                          <button 
                            className="action-btn" 
                            title="Voir les détails"
                            onClick={() => alert(`ID Transaction: ${paiement.transactionId}`)}
                          >
                            <EyeIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Analytics Section */}
        {activeSection === 'analytics' && (
          <div className="analytics-section">
            <div className="section-header">
              <h2>Analytics</h2>
            </div>
            <div className="analytics-content">
              <div className="analytics-grid">
                {/* Graphique des propriétés par type */}
                <div className="analytics-card">
                  <h3>Répartition des Biens par Type</h3>
                  <div className="chart-container">
                    <Pie
                      data={{
                        labels: ['Villa', 'Appartement', 'Maison', 'Studio'],
                        datasets: [{
                          data: [
                            biens.filter(b => b.typeDeBienId === 1).length,
                            biens.filter(b => b.typeDeBienId === 2).length,
                            biens.filter(b => b.typeDeBienId === 3).length,
                            biens.filter(b => b.typeDeBienId === 4).length,
                          ],
                          backgroundColor: [
                            '#4CAF50',
                            '#2196F3',
                            '#FFC107',
                            '#9C27B0'
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            position: 'bottom'
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Graphique des statuts des biens */}
                <div className="analytics-card">
                  <h3>Statut des Biens</h3>
                  <div className="chart-container">
                    <Bar
                      data={{
                        labels: ['À Vendre', 'À Louer', 'Vendu', 'Loué'],
                        datasets: [{
                          label: 'Nombre de biens',
                          data: [
                            biens.filter(b => b.statutTransaction === 'À Vendre').length,
                            biens.filter(b => b.statutTransaction === 'À Louer').length,
                            biens.filter(b => b.statutTransaction === 'Vendu').length,
                            biens.filter(b => b.statutTransaction === 'Loué').length,
                          ],
                          backgroundColor: '#2196F3'
                        }]
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Graphique des réservations par mois */}
                <div className="analytics-card">
                  <h3>Réservations par Mois</h3>
                  <div className="chart-container">
                    <Line
                      data={{
                        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'],
                        datasets: [{
                          label: 'Nombre de réservations',
                          data: Array(12).fill(0).map((_, i) => 
                            reservations.filter(r => 
                              new Date(r.dateDeReservation).getMonth() === i
                            ).length
                          ),
                          borderColor: '#4CAF50',
                          tension: 0.1
                        }]
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true,
                            ticks: {
                              stepSize: 1
                            }
                          }
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Graphique des paiements */}
                <div className="analytics-card">
                  <h3>Montant Total des Paiements par Statut</h3>
                  <div className="chart-container">
                    <Bar
                      data={{
                        labels: ['Réussi', 'En Attente', 'Annulé'],
                        datasets: [{
                          label: 'Montant total (€)',
                          data: [
                            paiements.filter(p => p.statutPaiement === 'Réussi')
                              .reduce((sum, p) => sum + p.montant, 0),
                            paiements.filter(p => p.statutPaiement === 'En Attente')
                              .reduce((sum, p) => sum + p.montant, 0),
                            paiements.filter(p => p.statutPaiement === 'Annulé')
                              .reduce((sum, p) => sum + p.montant, 0)
                          ],
                          backgroundColor: [
                            '#4CAF50',
                            '#FFC107',
                            '#F44336'
                          ]
                        }]
                      }}
                      options={{
                        responsive: true,
                        scales: {
                          y: {
                            beginAtZero: true
                          }
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="settings-section">
            <div className="section-header">
              <h2>Paramètres</h2>
            </div>
            <div className="settings-content">
              <p>Section Paramètres en cours de développement...</p>
            </div>
          </div>
        )}
      </main>

      {/* Property Modal */}
      <PropertyModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        property={selectedProperty}
        onSave={handleSaveProperty}
      />

      {/* Payment Modal */}
      {showPaymentModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-content payment-modal">
            <div className="modal-header">
              <h2>Enregistrer un Paiement</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowPaymentModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>Réservation</label>
                  <div className="reservation-info-readonly">
                    <p><strong>ID:</strong> {selectedReservation.id}</p>
                    <p><strong>Bien:</strong> {selectedReservation.titreBien}</p>
                    <p><strong>Client:</strong> {selectedReservation.nomUtilisateur}</p>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="montant">Montant</label>
                  <input
                    type="number"
                    id="montant"
                    value={paymentData.montant}
                    onChange={(e) => setPaymentData({...paymentData, montant: parseFloat(e.target.value)})}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="methodeDePaiement">Méthode de Paiement</label>
                  <select
                    id="methodeDePaiement"
                    value={paymentData.methodeDePaiement}
                    onChange={(e) => setPaymentData({...paymentData, methodeDePaiement: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner une méthode</option>
                    <option value="Espèces">Espèces</option>
                    <option value="Carte Bancaire">Carte Bancaire</option>
                    <option value="Virement">Virement</option>
                    <option value="Chèque">Chèque</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="transactionId">ID Transaction</label>
                  <input
                    type="text"
                    id="transactionId"
                    value={paymentData.transactionId}
                    onChange={(e) => setPaymentData({...paymentData, transactionId: e.target.value})}
                    placeholder="Numéro de transaction, chèque, etc."
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="btn-primary"
                >
                  Enregistrer le Paiement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation Details Modal */}
      {showReservationModal && selectedReservation && (
        <div className="modal-overlay">
          <div className="modal-content reservation-details-modal">
            <div className="modal-header">
              <h2>Détails de la Réservation</h2>
              <button 
                className="modal-close-btn"
                onClick={() => setShowReservationModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="reservation-details">
                <div className="detail-section">
                  <h3>Informations de la Réservation</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID Réservation:</label>
                      <span>{selectedReservation.id}</span>
                    </div>
                    <div className="detail-item">
                      <label>Statut:</label>
                      <span className={`status-badge ${getStatusBadgeClass(selectedReservation.statut)}`}>
                        {getStatusText(selectedReservation.statut)}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Date de Réservation:</label>
                      <span>{new Date(selectedReservation.dateDeReservation).toLocaleString('fr-FR')}</span>
                    </div>
                    <div className="detail-item">
                      <label>Prix Total:</label>
                      <span>€{selectedReservation.prixTotal?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Propriété</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID Propriété:</label>
                      <span>{selectedReservation.bienImmobilierId}</span>
                    </div>
                    <div className="detail-item">
                      <label>Titre:</label>
                      <span>{selectedReservation.titreBien}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Client</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>ID Client:</label>
                      <span>{selectedReservation.utilisateurId}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nom:</label>
                      <span>{selectedReservation.nomUtilisateur}</span>
                    </div>
                    <div className="detail-item">
                      <label>Email:</label>
                      <span>{selectedReservation.emailUtilisateur || 'Non renseigné'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Téléphone:</label>
                      <span>{selectedReservation.telephoneUtilisateur || 'Non renseigné'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Dates et Séjour</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Date d'Arrivée:</label>
                      <span>{new Date(selectedReservation.dateDebut).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date de Départ:</label>
                      <span>{new Date(selectedReservation.dateFin).toLocaleDateString('fr-FR')}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nombre de Voyageurs:</label>
                      <span>{selectedReservation.nombreDeVoyageurs}</span>
                    </div>
                    <div className="detail-item">
                      <label>Durée du Séjour:</label>
                      <span>
                        {Math.ceil((new Date(selectedReservation.dateFin) - new Date(selectedReservation.dateDebut)) / (1000 * 60 * 60 * 24))} jours
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowReservationModal(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
