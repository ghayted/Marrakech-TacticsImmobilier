// src/components/PropertyModal.jsx
import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './PropertyModal.css'

// Corriger les icônes Leaflet par défaut
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Icônes SVG
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
)

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

const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
    <circle cx="12" cy="13" r="4"></circle>
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

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="17,8 12,3 7,8"></polyline>
    <line x1="12" y1="3" x2="12" y2="15"></line>
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

// Composant pour gérer les clics sur la carte
const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng
      onLocationSelect(lat, lng)
    },
  })
  return null
}

// Composant Map avec Leaflet
const MapComponent = ({ latitude, longitude, onLocationSelect }) => {
  const [mapKey, setMapKey] = useState(0) // Pour forcer le re-render
  const defaultPosition = [31.6295, -7.9811] // Marrakech par défaut
  const currentPosition = latitude && longitude ? [parseFloat(latitude), parseFloat(longitude)] : defaultPosition

  // Forcer le re-render quand les coordonnées changent
  useEffect(() => {
    setMapKey(prev => prev + 1)
  }, [latitude, longitude])

  // S'assurer que la carte se re-render quand les coordonnées sont disponibles
  useEffect(() => {
    if (latitude && longitude) {
      // Petit délai pour s'assurer que la carte est montée
      const timer = setTimeout(() => {
        setMapKey(prev => prev + 1)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [latitude, longitude])

  return (
    <div className="map-container">
      <MapContainer
        key={mapKey} // Force re-render complet
        center={currentPosition}
        zoom={13}
        style={{ height: '300px', width: '100%', borderRadius: '12px' }}
        className="leaflet-map"
        zoomControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        dragging={true}
        touchZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onLocationSelect={onLocationSelect} />
        {latitude && longitude && (
          <Marker position={currentPosition} />
        )}
      </MapContainer>
      <div className="map-instructions-overlay">
        <div className="map-instructions">
          Cliquez sur la carte pour définir l'emplacement
        </div>
      </div>
    </div>
  )
}

const PropertyModal = ({ isOpen, onClose, property = null, onSave }) => {
  const [activeTab, setActiveTab] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [mapForceUpdate, setMapForceUpdate] = useState(0) // Pour forcer le re-render de la carte
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    prix: '',
    adresse: '',
    ville: '',
    quartier: '',
    surface: '',
    nombreDeChambres: '',
    nombreDeSallesDeBain: '',
    nombreDeSalons: '',
    nombreDeCuisines: '',
    latitude: '',
    longitude: '',
    typeDeBienId: '1',
    statutTransaction: 'À Vendre',
    prixParNuit: '',
    amenagementIds: [],
    ImageUrls: [],
    proprietaireId: '',
    nouveauProprietaire: null,
  })

  const [proprietaires, setProprietaires] = useState([])
  const [nouveauProprietaire, setNouveauProprietaire] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  })
  const [showNouveauProprietaire, setShowNouveauProprietaire] = useState(false)

  const [localImages, setLocalImages] = useState([])

  // Liste des aménagements selon votre base de données
  const AMENAGEMENTS = [
    { id: 1, nom: "Jardin" },
    { id: 2, nom: "Piscine" },
    { id: 3, nom: "Garage" },
    { id: 4, nom: "Balcon" },
    { id: 5, nom: "Terrasse" },
    { id: 6, nom: "Climatisation" },
  ]

  // Types de biens corrigés selon votre mapping
  const TYPES_BIENS = [
    { id: 1, nom: "Villa" },
    { id: 2, nom: "Appartement" },
    { id: 3, nom: "Maison" },
    { id: 4, nom: "Studio" },
  ]

  // Quartiers de Marrakech
  const QUARTIERS = [
    "Guéliz", "Hivernage", "Palmeraie", "Sidi Youssef", "Ménara", 
    "Agdal", "Targa", "Massira", "Daoudiate", "Semlalia", 
    "Majorelle", "Médina", "Noria", "Prestigia", "Autre"
  ]

  // Onglets du formulaire
  const formTabs = [
    { id: 0, label: "Général", icon: InfoIcon },
    { id: 1, label: "Pièces", icon: BuildingIcon },
    { id: 2, label: "Localisation", icon: MapPinIcon },
    { id: 3, label: "Photos", icon: CameraIcon },
  ]

  // Charger les propriétaires au montage du composant
  useEffect(() => {
    const fetchProprietaires = async () => {
      try {
        const response = await fetch('/api/proprietaires')
        if (response.ok) {
          const data = await response.json()
          setProprietaires(data)
        }
      } catch (error) {
        console.error('Erreur lors du chargement des propriétaires:', error)
      }
    }
    
    if (isOpen) {
      fetchProprietaires()
    }
  }, [isOpen])

  // Réinitialiser le formulaire quand le modal s'ouvre/ferme
  useEffect(() => {
    if (isOpen) {
      if (property) {
        // Mode modification - charger les données existantes
        setFormData({
          titre: property.titre || '',
          description: property.description || '',
          prix: property.prix?.toString() || '',
          adresse: property.adresse || '',
          ville: property.ville || '',

          surface: property.surface?.toString() || '',
          nombreDeChambres: property.nombreDeChambres?.toString() || '',
          nombreDeSallesDeBain: property.nombreDeSallesDeBain?.toString() || '',
          nombreDeSalons: property.nombreDeSalons?.toString() || '',
          nombreDeCuisines: property.nombreDeCuisines?.toString() || '',
          latitude: property.latitude?.toString() || '',
          longitude: property.longitude?.toString() || '',
          typeDeBienId: property.typeDeBienId?.toString() || '1',
          statutTransaction: property.statutTransaction || 'À Vendre',
          prixParNuit: property.prixParNuit?.toString() || '',
          amenagementIds: property.amenagements?.map(a => a.id) || [],
          ImageUrls: property.imagesBiens?.map(img => img.urlImage) || [],
          proprietaireId: property.proprietaireId?.toString() || '',
          nouveauProprietaire: null,
        })
      } else {
        // Mode ajout - réinitialiser le formulaire
        setFormData({
          titre: '',
          description: '',
          prix: '',
          adresse: '',
          ville: '',

          surface: '',
          nombreDeChambres: '',
          nombreDeSallesDeBain: '',
          nombreDeSalons: '',
          nombreDeCuisines: '',
          latitude: '',
          longitude: '',
          typeDeBienId: '1',
          statutTransaction: 'À Vendre',
          prixParNuit: '',
          amenagementIds: [],
          ImageUrls: [],
          proprietaireId: '',
          nouveauProprietaire: null,
        })
      }
      setActiveTab(0) // Retourner au premier onglet
      setShowNouveauProprietaire(false)
      setNouveauProprietaire({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        adresse: '',
      })
    }
  }, [isOpen, property])

  // Forcer le re-render de la carte quand on change vers l'onglet Localisation
  useEffect(() => {
    if (activeTab === 2) {
      // Petit délai pour s'assurer que l'onglet est rendu
      setTimeout(() => {
        setMapForceUpdate(prev => prev + 1)
      }, 100)
    }
  }, [activeTab])

  // Forcer le re-render de la carte quand les coordonnées changent
  useEffect(() => {
    if (activeTab === 2 && (formData.latitude || formData.longitude)) {
      setTimeout(() => {
        setMapForceUpdate(prev => prev + 1)
      }, 300)
    }
  }, [formData.latitude, formData.longitude, activeTab])

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleAmenagementChange = (amenagementId) => {
    setFormData(prev => ({
      ...prev,
      amenagementIds: prev.amenagementIds.includes(amenagementId)
        ? prev.amenagementIds.filter(id => id !== amenagementId)
        : [...prev.amenagementIds, amenagementId]
    }))
  }

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat.toFixed(6),
      longitude: lng.toFixed(6)
    }))
  }

  const handleProprietaireChange = (e) => {
    const { name, value } = e.target
    setNouveauProprietaire(prev => ({ ...prev, [name]: value }))
  }

  const handleProprietaireIdChange = (e) => {
    const value = e.target.value
    setFormData(prev => ({ ...prev, proprietaireId: value }))
    if (value === 'nouveau') {
      setShowNouveauProprietaire(true)
    } else {
      setShowNouveauProprietaire(false)
    }
  }

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (files.length === 0) return

    try {
      const uploadedUrls = []
      for (const file of files) {
        // Simulation d'upload vers Cloudinary
        const formData = new FormData()
        formData.append("file", file)
        formData.append("upload_preset", "default")
        
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/ds2h1vtel/image/upload",
          { method: "POST", body: formData }
        )
        
        if (!res.ok) throw new Error("Erreur upload Cloudinary")
        const data = await res.json()
        uploadedUrls.push(data.secure_url)
      }

      setFormData(prev => ({
        ...prev,
        ImageUrls: [...prev.ImageUrls, ...uploadedUrls]
      }))
    } catch (error) {
      console.error('Erreur upload:', error)
      alert("Erreur lors de l'upload des images")
    }
    
    e.target.value = ''
  }

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      ImageUrls: prev.ImageUrls.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const submitData = {
        ...formData,
        prix: Number.parseFloat(formData.prix),
        surface: Number.parseFloat(formData.surface),
        nombreDeChambres: formData.nombreDeChambres ? Number.parseInt(formData.nombreDeChambres) : 0,
        nombreDeSallesDeBain: formData.nombreDeSallesDeBain ? Number.parseInt(formData.nombreDeSallesDeBain) : 0,
        nombreDeSalons: formData.nombreDeSalons ? Number.parseInt(formData.nombreDeSalons) : 0,
        nombreDeCuisines: formData.nombreDeCuisines ? Number.parseInt(formData.nombreDeCuisines) : 0,
        latitude: formData.latitude ? Number.parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? Number.parseFloat(formData.longitude) : null,
        typeDeBienId: Number.parseInt(formData.typeDeBienId),
        prixParNuit: formData.prixParNuit ? Number.parseFloat(formData.prixParNuit) : null,
        proprietaireId: formData.proprietaireId ? Number.parseInt(formData.proprietaireId) : null,
        nouveauProprietaire: showNouveauProprietaire ? nouveauProprietaire : null,
      }

      await onSave(submitData)
      onClose()
    } catch (error) {
      console.error("Erreur:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setSubmitting(false)
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

  if (!isOpen) return null

  return (
    <div className="property-modal-overlay">
      <div className="property-modal-content">
        <div className="modal-header">
          <h2>{property ? 'Modifier le bien' : 'Nouveau bien immobilier'}</h2>
          <button className="modal-close" onClick={onClose} disabled={submitting}>
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
                  placeholder="Ex: Villa moderne avec piscine"
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
                  placeholder="850000"
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
                  {TYPES_BIENS.map(type => (
                    <option key={type.id} value={type.id}>{type.nom}</option>
                  ))}
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
                  <option value="À Louer (Nuit)">À Louer (Nuit)</option>
                  <option value="À Louer (Mois)">À Louer (Mois)</option>
                  <option value="Vendu">Vendu</option>
                  <option value="Loué">Loué</option>
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
                  placeholder="150"
                />
              </div>

              {/* Prix par nuit - affiché seulement si "À Louer (Nuit)" est sélectionné */}
              {formData.statutTransaction === 'À Louer (Nuit)' && (
                <div className="form-group">
                  <label>Prix par nuit (€) *</label>
                  <input
                    type="number"
                    name="prixParNuit"
                    value={formData.prixParNuit}
                    onChange={handleFormChange}
                    required
                    disabled={submitting}
                    placeholder="150"
                  />
                </div>
              )}

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  disabled={submitting}
                  placeholder="Description détaillée du bien..."
                />
              </div>

              {/* Section Propriétaire - affichée pour Vente et Location mensuelle */}
              {(formData.statutTransaction === 'À Vendre' || formData.statutTransaction === 'À Louer (Mois)') && (
                <div className="form-group full-width">
                  <label>Propriétaire *</label>
                  <select
                    name="proprietaireId"
                    value={formData.proprietaireId}
                    onChange={handleProprietaireIdChange}
                    required
                    disabled={submitting}
                  >
                    <option value="">Sélectionner un propriétaire</option>
                    {proprietaires.map(proprietaire => (
                      <option key={proprietaire.id} value={proprietaire.id}>
                        {proprietaire.nom} {proprietaire.prenom}
                      </option>
                    ))}
                    <option value="nouveau">+ Ajouter un nouveau propriétaire</option>
                  </select>
                </div>
              )}

              {/* Formulaire nouveau propriétaire */}
              {showNouveauProprietaire && (
                <div className="nouveau-proprietaire-section">
                  <h4>Nouveau Propriétaire</h4>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Nom *</label>
                      <input
                        type="text"
                        name="nom"
                        value={nouveauProprietaire.nom}
                        onChange={handleProprietaireChange}
                        required
                        disabled={submitting}
                        placeholder="Nom du propriétaire"
                      />
                    </div>
                    <div className="form-group">
                      <label>Prénom *</label>
                      <input
                        type="text"
                        name="prenom"
                        value={nouveauProprietaire.prenom}
                        onChange={handleProprietaireChange}
                        required
                        disabled={submitting}
                        placeholder="Prénom du propriétaire"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={nouveauProprietaire.email}
                        onChange={handleProprietaireChange}
                        required
                        disabled={submitting}
                        placeholder="email@exemple.com"
                      />
                    </div>
                    <div className="form-group">
                      <label>Téléphone *</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={nouveauProprietaire.telephone}
                        onChange={handleProprietaireChange}
                        required
                        disabled={submitting}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Adresse *</label>
                      <textarea
                        name="adresse"
                        value={nouveauProprietaire.adresse}
                        onChange={handleProprietaireChange}
                        required
                        disabled={submitting}
                        rows="3"
                        placeholder="Adresse complète du propriétaire"
                      />
                    </div>
                  </div>
                </div>
              )}
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
                  placeholder="3"
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
                  placeholder="2"
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
                  placeholder="1"
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
                  placeholder="1"
                />
              </div>
            </div>

            {/* Aménagements */}
            <div className="form-group full-width">
              <label>Aménagements</label>
              <div className="amenagements-grid">
                {AMENAGEMENTS.map(amenagement => (
                  <label key={amenagement.id} className="amenagement-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.amenagementIds.includes(amenagement.id)}
                      onChange={() => handleAmenagementChange(amenagement.id)}
                      disabled={submitting}
                    />
                    <span>{amenagement.nom}</span>
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
                  placeholder="123 Avenue Mohammed V"
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
                  placeholder="Marrakech"
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
                  placeholder="31.6295"
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
                  placeholder="-7.9811"
                />
              </div>
            </div>

            {/* Carte interactive avec Leaflet */}
            <div className="form-group full-width">
              <label>Carte de localisation</label>
              <MapComponent 
                key={`map-${mapForceUpdate}`} // Force re-render complet
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={handleLocationSelect}
              />
            </div>
          </div>

          {/* Contenu de l'onglet 3 - Photos */}
          <div className={`form-tab-content ${activeTab === 3 ? "active" : ""}`}>
            <div className="form-group full-width">
              <label>Images du bien</label>
              
              {/* Images existantes */}
              {formData.ImageUrls.length > 0 && (
                <div className="images-grid">
                  {formData.ImageUrls.map((url, index) => (
                    <div key={index} className="image-item">
                      <img src={url} alt={`Image ${index + 1}`} />
                      <button
                        type="button"
                        className="remove-image"
                        onClick={() => removeImage(index)}
                        disabled={submitting}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload de nouvelles images */}
              <div className="upload-section">
                <label htmlFor="image-upload" className="upload-button">
                  <UploadIcon />
                  <span>Ajouter des images</span>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                    disabled={submitting}
                  />
                </label>
                <p className="upload-hint">
                  Formats acceptés: JPG, PNG, GIF. Taille max: 5MB par image.
                </p>
              </div>
            </div>
          </div>

          {/* Navigation entre onglets */}
          <div className="form-navigation">
            <div className="form-nav-buttons">
              <button
                type="button"
                className="btn-prev"
                onClick={prevTab}
                disabled={activeTab === 0 || submitting}
              >
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
            <span className="tab-indicator">
              {activeTab + 1} / {formTabs.length}
            </span>
          </div>
        </form>

        <div className="modal-footer">
          <button
            type="button"
            className="btn-cancel"
            onClick={onClose}
            disabled={submitting}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-submit"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Sauvegarde..." : (property ? "Modifier" : "Créer")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PropertyModal