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
import ProprietairesList from "../components/Proprietaires/ProprietairesList"

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
  const [remboursements, setRemboursements] = useState([])
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
    sortByDate: 'desc', // Par défaut, plus récent en premier
    // Filtres pour les réservations
    reservationId: '',
    reservationPhone: '',
    reservationStatus: '',
    reservationMonth: '',
    reservationYear: '',
    // Filtres pour les paiements
    paiementId: '',
    paiementReservationId: ''
  })

  const token = localStorage.getItem("authToken")
  const backendUrl = "https://api.immotactics.live"

  // Analytics state
  const [siteViewsThisMonth, setSiteViewsThisMonth] = useState(0)
  const [selectedBienViewsThisMonth, setSelectedBienViewsThisMonth] = useState(0)
  const [siteViewsByMonth, setSiteViewsByMonth] = useState(Array(12).fill(0))
  const [analyticsBienId, setAnalyticsBienId] = useState('')
  const [topBiens, setTopBiens] = useState([])

  // Navigation items
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
    { id: 'properties', label: 'Propriétés', icon: BuildingIcon },
    { id: 'owners', label: 'Propriétaires', icon: UsersIcon },
    { id: 'reservations', label: 'Réservations', icon: CalendarIcon },
    { id: 'paiements', label: 'Paiements', icon: FileTextIcon },
    { id: 'remboursements', label: 'Remboursements', icon: FileTextIcon },
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
        console.log('🔍 [AdminDashboard] Réservations reçues:', data)
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

  const fetchRemboursements = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/api/Refunds`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response.ok) {
        const data = await response.json()
        setRemboursements(data)
      }
    } catch (error) {
      console.error('Erreur lors du chargement des remboursements:', error)
    }
  }, [token, backendUrl])

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      await Promise.all([
        fetchReservations(),
        fetchPaiements(),
        fetchRemboursements()
      ])
      setLoading(false)
    }
    loadData()
  }, [fetchReservations, fetchPaiements, fetchRemboursements])

  // Charger les biens séparément pour permettre le filtrage
  useEffect(() => {
    fetchBiens()
  }, [fetchBiens])

  // Load analytics when entering analytics section
  useEffect(() => {
    if (activeSection === 'analytics') {
      const now = new Date()
      const month = now.getMonth() + 1
      const year = now.getFullYear()
      // Site count this month
      fetch(`${backendUrl}/api/Analytics/site/count?month=${month}&year=${year}`)
        .then(r => r.ok ? r.json() : { count: 0 })
        .then(d => setSiteViewsThisMonth(d.count || 0))
        .catch(() => {})
      // Site monthly series
      fetch(`${backendUrl}/api/Analytics/site/monthly?year=${year}`)
        .then(r => r.ok ? r.json() : [])
        .then(arr => {
          const series = Array(12).fill(0)
          arr.forEach(x => { series[(x.month || x.Month) - 1] = x.count || x.Count || 0 })
          setSiteViewsByMonth(series)
        })
        .catch(() => {})
      // Top biens (this month)
      fetch(`${backendUrl}/api/Analytics/bien/top?month=${month}&year=${year}&limit=5`)
        .then(r => r.ok ? r.json() : [])
        .then(list => setTopBiens(Array.isArray(list) ? list : []))
        .catch(() => {})
    }
  }, [activeSection])

  // Load selected bien KPI when user picks one
  useEffect(() => {
    if (activeSection !== 'analytics') return
    const now = new Date()
    const month = now.getMonth() + 1
    const year = now.getFullYear()
    if (analyticsBienId) {
      fetch(`${backendUrl}/api/Analytics/bien/${analyticsBienId}/count?month=${month}&year=${year}`)
        .then(r => r.ok ? r.json() : { count: 0 })
        .then(d => setSelectedBienViewsThisMonth(d.count || 0))
        .catch(() => setSelectedBienViewsThisMonth(0))
    } else {
      setSelectedBienViewsThisMonth(0)
    }
  }, [activeSection, analyticsBienId])

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId)
    
    // Rafraîchir les données quand on navigue vers certaines sections
    if (sectionId === 'reservations') {
      fetchReservations()
    } else if (sectionId === 'paiements') {
      fetchPaiements()
    } else if (sectionId === 'remboursements') {
      fetchRemboursements()
    }
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

  const handleConfirmRefund = async (refundId) => {
    if (!confirm('Êtes-vous sûr de vouloir confirmer ce remboursement ?')) {
      return
    }

    try {
      const response = await fetch(`${backendUrl}/api/Refunds/${refundId}/confirmer`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        alert('Remboursement confirmé avec succès')
        fetchRemboursements() // Rafraîchir la liste des remboursements
      } else {
        const error = await response.json()
        alert(`Erreur: ${error.message || 'Erreur lors de la confirmation du remboursement'}`)
      }
    } catch (error) {
      console.error('Erreur:', error)
      alert('Erreur lors de la confirmation du remboursement')
    }
  }

  const getStatusBadgeClass = (status) => {
    const s = (status || '').toLowerCase()
    const sn = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '') // retire accents
    if (sn.includes('vendre')) return 'status-badge a-vendre'
    if (sn.includes('louer')) return 'status-badge a-louer'
    if (sn.includes('vendu')) return 'status-badge vendu'
    if (sn.includes('loue')) return 'status-badge loue'
    if (sn.includes('en attente') || sn.includes('en cours')) return 'status-badge en-attente'
    if (sn.includes('annule')) return 'status-badge annule'
    if (sn.includes('termine')) return 'status-badge terminee'
    if (sn.includes('reussi') || sn.includes('confirme')) return 'status-badge confirmee'
    return 'status-badge en-attente'
  }

  const getStatusText = (status) => {
    const value = status || 'En attente'
    const s = value.toLowerCase()
    // Affichages souhaités côté Admin:
    // - "À Louer" ou "À Louer (Nuit)" => "Location saisonnière"
    // - "À Louer (Mois)" => "À Louer"
    if (s.includes('louer') && s.includes('nuit')) return 'Location saisonnière'
    if (s === 'à louer' || s === 'a louer') return 'Location saisonnière'
    if (s.includes('louer') && s.includes('mois')) return 'À Louer'
    return value
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

  // Filtrer les réservations localement et les trier par ID décroissant (plus récent en premier)
  const filteredReservations = reservations
    .filter(reservation => {
      const matchesId = !filters.reservationId || 
        reservation.id.toString().includes(filters.reservationId)
      
      const matchesPhone = !filters.reservationPhone || 
        reservation.telephoneUtilisateur?.includes(filters.reservationPhone)
      
      const matchesStatus = !filters.reservationStatus || 
        reservation.statut?.toLowerCase() === filters.reservationStatus.toLowerCase()
      
      // Filtrage par mois et année
      let matchesMonth = true
      let matchesYear = true
      
      if (filters.reservationMonth || filters.reservationYear) {
        const reservationDate = new Date(reservation.dateDeReservation)
        const reservationMonth = reservationDate.getMonth() + 1 // getMonth() retourne 0-11
        const reservationYear = reservationDate.getFullYear()
        
        if (filters.reservationMonth) {
          matchesMonth = reservationMonth === parseInt(filters.reservationMonth)
        }
        
        if (filters.reservationYear) {
          matchesYear = reservationYear === parseInt(filters.reservationYear)
        }
      }
      
      return matchesId && matchesPhone && matchesStatus && matchesMonth && matchesYear
    })
    .sort((a, b) => b.id - a.id) // Trier par ID décroissant (plus récent en premier)

  // Filtrer les paiements localement et les trier par ID décroissant (plus récent en premier)
  const filteredPaiements = paiements
    .filter(paiement => {
      const matchesPaiementId = !filters.paiementId || 
        paiement.id.toString().includes(filters.paiementId)
      
      const matchesReservationId = !filters.paiementReservationId || 
        paiement.reservationId.toString().includes(filters.paiementReservationId)
      
      return matchesPaiementId && matchesReservationId
    })
    .sort((a, b) => b.id - a.id) // Trier par ID décroissant (plus récent en premier)

  if (loading) {
    return (
      <div className="app-admin-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-admin-dashboard">
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
              
              <div className="stat-card">
                <div className="stat-card-header">
                  <div className="stat-card-icon">
                    <FileTextIcon />
                  </div>
                </div>
                <div className="stat-card-content">
                  <h3 className="stat-card-title">Remboursements</h3>
                  <p className="stat-card-value">{remboursements.length}</p>
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
                  <option value="À Louer (Nuit)">À Louer (Nuit)</option>
                  <option value="À Louer (Mois)">À Louer (Mois)</option>
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
                          <div className="property-id">#{bien.titre}</div>
                          <div className="property-location">{bien.ville}</div>
                          <div className="property-reference">Ref: {bien.id}</div>
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

        {/* Owners Section */}
        {activeSection === 'owners' && (
          <div className="properties-section">
            <div className="section-header">
              <h2>Gestion des Propriétaires</h2>
            </div>
            <ProprietairesList />
          </div>
        )}

        {/* Reservations Section */}
        {activeSection === 'reservations' && (
          <div className="reservations-section">
            <div className="section-header">
              <h2>Gestion des Réservations</h2>
              <button 
                className="btn-primary" 
                onClick={() => fetchReservations()}
                disabled={loading}
              >
                <SettingsIcon />
                Actualiser
              </button>
            </div>

            {/* Filtres pour les réservations */}
            <div className="filters-section">
              <div className="filters-header">
                <h3>Filtres de recherche</h3>
                <button 
                  className="btn-secondary"
                  onClick={() => setFilters({
                    ...filters,
                    reservationId: '',
                    reservationPhone: '',
                    reservationStatus: '',
                    reservationMonth: '',
                    reservationYear: ''
                  })}
                >
                  Réinitialiser les filtres
                </button>
              </div>
              <div className="filters-grid">
                <input
                  type="text"
                  placeholder="Rechercher par ID réservation..."
                  className="filter-input"
                  value={filters.reservationId}
                  onChange={(e) => setFilters({...filters, reservationId: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Rechercher par téléphone..."
                  className="filter-input"
                  value={filters.reservationPhone}
                  onChange={(e) => setFilters({...filters, reservationPhone: e.target.value})}
                />
                <select
                  className="filter-select"
                  value={filters.reservationStatus}
                  onChange={(e) => setFilters({...filters, reservationStatus: e.target.value})}
                >
                  <option value="">Tous les statuts</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="En attente">En attente</option>
                  <option value="Annulée">Annulée</option>
                  <option value="Terminée">Terminée</option>
                </select>
                <select
                  className="filter-select"
                  value={filters.reservationMonth}
                  onChange={(e) => setFilters({...filters, reservationMonth: e.target.value})}
                >
                  <option value="">Tous les mois</option>
                  <option value="1">Janvier</option>
                  <option value="2">Février</option>
                  <option value="3">Mars</option>
                  <option value="4">Avril</option>
                  <option value="5">Mai</option>
                  <option value="6">Juin</option>
                  <option value="7">Juillet</option>
                  <option value="8">Août</option>
                  <option value="9">Septembre</option>
                  <option value="10">Octobre</option>
                  <option value="11">Novembre</option>
                  <option value="12">Décembre</option>
                </select>
                <select
                  className="filter-select"
                  value={filters.reservationYear}
                  onChange={(e) => setFilters({...filters, reservationYear: e.target.value})}
                >
                  <option value="">Toutes les années</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>
              <div className="filters-info">
                <span>
                  Affichage de {filteredReservations.length} réservation(s) sur {reservations.length} total
                </span>
              </div>
            </div>
            <div className="reservations-table-container">
              <table className="reservations-table">
                <thead>
                  <tr>
                    <th>ID Réservation</th>
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
                  {filteredReservations.length > 0 ? (
                    filteredReservations.map((reservation) => (
                      <tr key={reservation.id}>
                        <td>
                          <span className="reservation-id">#{reservation.id}</span>
                        </td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-results">
                        <div className="no-results-content">
                          <div className="no-results-icon">🔍</div>
                          <h3>Aucune réservation trouvée</h3>
                          <p>Aucune réservation ne correspond aux critères de recherche.</p>
                          <button 
                            className="btn-secondary"
                            onClick={() => setFilters({
                              ...filters,
                              reservationId: '',
                              reservationPhone: '',
                              reservationStatus: ''
                            })}
                          >
                            Réinitialiser les filtres
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
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
            
            {/* Filtres pour les paiements */}
            <div className="filters-section">
              <div className="filters-row">
                <div className="filter-group">
                  <label>ID Paiement</label>
                  <input
                    type="text"
                    placeholder="ID paiement..."
                    className="filter-input"
                    value={filters.paiementId}
                    onChange={(e) => setFilters({...filters, paiementId: e.target.value})}
                    maxLength="10"
                  />
                </div>
                <div className="filter-group">
                  <label>ID Réservation</label>
                  <input
                    type="text"
                    placeholder="ID réservation..."
                    className="filter-input"
                    value={filters.paiementReservationId}
                    onChange={(e) => setFilters({...filters, paiementReservationId: e.target.value})}
                    maxLength="10"
                  />
                </div>
                <button 
                  className="btn-secondary"
                  onClick={() => setFilters({
                    ...filters,
                    paiementId: '',
                    paiementReservationId: ''
                  })}
                >
                  Réinitialiser
                </button>
              </div>
              <div className="filters-info">
                <span>Affichage de {filteredPaiements.length} paiement(s) sur {paiements.length} total</span>
              </div>
            </div>
            
            <div className="paiements-table-container">
              <table className="paiements-table">
                <thead>
                  <tr>
                    <th>ID Paiement</th>
                    <th>ID Réservation</th>
                    <th>Propriété</th>
                    <th>Client</th>
                    <th>Montant</th>
                    <th>Date Paiement</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPaiements.length > 0 ? (
                    filteredPaiements.map((paiement) => (
                      <tr key={paiement.id}>
                        <td>
                          <span className="paiement-id">#{paiement.id}</span>
                        </td>
                        <td>
                          <span className="reservation-id">#{paiement.reservationId}</span>
                        </td>
                        <td>REF: {paiement.bienImmobilierId || 'N/A'}</td>
                        <td>{paiement.clientTelephone || 'N/A'}</td>
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
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="no-results">
                        <div className="no-results-content">
                          <div className="no-results-icon">🔍</div>
                          <h3>Aucun paiement trouvé</h3>
                          <p>Aucun paiement ne correspond aux critères de recherche.</p>
                          <button 
                            className="btn-secondary"
                            onClick={() => setFilters({
                              ...filters,
                              paiementId: '',
                              paiementReservationId: ''
                            })}
                          >
                            Réinitialiser les filtres
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Remboursements Section */}
        {activeSection === 'remboursements' && (
          <div className="paiements-section">
            <div className="section-header">
              <h2>Gestion des Remboursements</h2>
              <button 
                className="btn-primary" 
                onClick={() => fetchRemboursements()}
                disabled={loading}
              >
                <SettingsIcon />
                Actualiser
              </button>
            </div>
            <div className="paiements-table-container">
              <table className="paiements-table">
                <thead>
                  <tr>
                    <th>Réservation</th>
                    <th>Paiement</th>
                    <th>Montant Remboursé</th>
                    <th>Date Remboursement</th>
                    <th>Statut</th>
                    <th>Raison</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {remboursements.map((remboursement) => (
                    <tr key={remboursement.id}>
                      <td>#{remboursement.reservationId}</td>
                      <td>#{remboursement.paiementId}</td>
                      <td>€{remboursement.montantRembourse?.toLocaleString()}</td>
                      <td>{new Date(remboursement.dateDeRemboursement).toLocaleString('fr-FR')}</td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(remboursement.statutRemboursement)}`}>
                          {remboursement.statutRemboursement}
                        </span>
                      </td>
                      <td>{remboursement.raisonRemboursement || 'N/A'}</td>
                      <td>
                        <div className="action-buttons">
                          {remboursement.lienFactureRemboursement && (
                            <a 
                              href={remboursement.lienFactureRemboursement}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="action-btn"
                              title="Télécharger la facture de remboursement"
                            >
                              <FileTextIcon />
                            </a>
                          )}
                          <button 
                            className="action-btn" 
                            title="Voir les détails"
                            onClick={() => alert(`ID Transaction: ${remboursement.transactionIdRemboursement}`)}
                          >
                            <EyeIcon />
                          </button>
                          {remboursement.statutRemboursement === 'En cours' && (
                            <button 
                              className="action-btn" 
                              title="Confirmer le remboursement"
                              onClick={() => handleConfirmRefund(remboursement.id)}
                              style={{ backgroundColor: '#10b981', color: 'white' }}
                            >
                              ✓
                            </button>
                          )}
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
                {/* KPI cards */}
                <div className="analytics-card">
                  <h3>Vues du site (ce mois)</h3>
                  <div style={{ fontSize: '28px', fontWeight: 700 }}>{siteViewsThisMonth}</div>
                </div>
                <div className="analytics-card">
                  <h3>Vues d'une annonce (ce mois)</h3>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <select className="filter-select" value={analyticsBienId} onChange={(e) => setAnalyticsBienId(e.target.value)}>
                      <option value="">— Sélectionner une annonce —</option>
                      {biens.map(b => (
                        <option key={b.id} value={b.id}>{b.titre || `Bien #${b.id}`}</option>
                      ))}
                    </select>
                    <div style={{ fontSize: '28px', fontWeight: 700 }}>{selectedBienViewsThisMonth}</div>
                  </div>
                  <small>Choisissez une annonce pour afficher ses vues</small>
                </div>
                <div className="analytics-card">
                  <h3>Top annonces (ce mois)</h3>
                  <div>
                    {topBiens.length === 0 ? (
                      <p>Aucune donnée</p>
                    ) : (
                      <ul style={{ margin: 0, paddingLeft: '18px' }}>
                        {topBiens.map((x, idx) => {
                          const id = x.bienImmobilierId || x.BienImmobilierId
                          const count = x.count || x.Count
                          const local = biens.find(b => b.id === id)
                          const titre = x.titre || (local ? local.titre : `Bien #${id}`)
                          return <li key={idx}>{titre} — {count}</li>
                        })}
                      </ul>
                    )}
                  </div>
                </div>
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
                         labels: ['À Vendre', 'À Louer', 'À Louer (Mois)', 'Vendu', 'Loué'],
                        datasets: [{
                          label: 'Nombre de biens',
                          data: [
                             biens.filter(b => b.statutTransaction === 'À Vendre').length,
                             // Regrouper toutes les nuits stockées comme "À Louer"
                             biens.filter(b => (b.statutTransaction === 'À Louer' || b.statutTransaction === 'A Louer')).length,
                             biens.filter(b => b.statutTransaction === 'À Louer (Mois)').length,
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
                        datasets: [
                          {
                            label: 'Nombre de réservations',
                            data: Array(12).fill(0).map((_, i) => 
                              reservations.filter(r => new Date(r.dateDeReservation).getMonth() === i).length
                            ),
                            borderColor: '#4CAF50',
                            tension: 0.1
                          },
                          {
                            label: 'Vues du site',
                            data: siteViewsByMonth,
                            borderColor: '#9C27B0',
                            tension: 0.1
                          }
                        ]
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
          <div className="modal-content admin-reservation-details-modal">
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
