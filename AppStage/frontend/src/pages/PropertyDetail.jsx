import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PropertyDetail.css';
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import { FaUtensils } from 'react-icons/fa';

// Correction du marqueur par défaut Leaflet
// (à placer avant tout usage de <Marker />)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Icônes optimisées
const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
    <polyline points="9,22 9,12 15,12 15,22"></polyline>
  </svg>
);

const MapPinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const BedIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 4v16"></path>
    <path d="M2 8h18a2 2 0 0 1 2 2v10"></path>
    <path d="M2 17h20"></path>
    <path d="M6 8v9"></path>
  </svg>
);

const BathIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 12h16a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z"></path>
    <path d="M6 12V6a2 2 0 0 1 2-2h3v2"></path>
    <line x1="4" y1="20" x2="20" y2="20"></line>
  </svg>
);

const SquareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
  </svg>
);

const ArrowLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12,19 5,12 12,5"></polyline>
  </svg>
);

const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const ChevronLeftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,18 9,12 15,6"></polyline>
  </svg>
);

const ChevronRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="9,18 15,12 9,6"></polyline>
  </svg>
);

const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="15,3 21,3 21,9"></polyline>
    <polyline points="9,21 3,21 3,15"></polyline>
    <line x1="21" y1="3" x2="14" y2="10"></line>
    <line x1="3" y1="21" x2="10" y2="14"></line>
  </svg>
);

// Ajout utilitaire pour icônes d'aménagements
const getAmenityIcon = (name) => {
  switch (name.toLowerCase()) {
    case 'jardin': return '🌳';
    case 'piscine': return '🏊';
    case 'garage': return '🚗';
    case 'balcon': return '🏢';
    case 'terrasse': return '🌅';
    case 'climatisation': return '❄️';
    default: return '✨';
  }
};

function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [thumbnailStart, setThumbnailStart] = useState(0); // index du premier thumbnail visible
  const THUMBNAILS_VISIBLE = 4;
  const thumbnailsRef = useRef(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchBien = async () => {
      try {
        const response = await fetch(`https://api.immotactics.live/api/BiensImmobiliers/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
               
        if (response.ok) {
          const data = await response.json();
          setBien(data);
        } else {
          console.error('Erreur lors du chargement du bien');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBien();
  }, [id, token]);

  // Synchronise le groupe de miniatures avec l'image principale
  useEffect(() => {
    if (!bien?.imagesBiens) return;
    if (currentImageIndex < thumbnailStart) {
      setThumbnailStart(currentImageIndex);
    } else if (currentImageIndex >= thumbnailStart + THUMBNAILS_VISIBLE) {
      setThumbnailStart(currentImageIndex - THUMBNAILS_VISIBLE + 1);
    }
    // Scroll auto (optionnel, pour UX fluide)
    if (thumbnailsRef.current) {
      const thumb = thumbnailsRef.current.querySelectorAll('.property-detail-thumbnail')[currentImageIndex];
      if (thumb) thumb.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [currentImageIndex, bien]);

  const getStatusBadgeClass = (statut) => {
    switch (statut) {
      case "À Vendre": return "a-vendre";
      case "À Louer (Nuit)": return "a-louer";
      case "À Louer (Mois)": return "a-louer";
      case "Vendu": return "vendu";
      case "Loué": return "loue";
      default: return "a-vendre";
    }
  };

  const nextImage = () => {
    if (bien?.imagesBiens && currentImageIndex < bien.imagesBiens.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className="property-detail-loading">
        <div className="loading-spinner"></div>
        <span>Chargement du bien immobilier...</span>
      </div>
    );
  }

  if (!bien) {
    return (
      <div className="property-detail-error">
        <h2>Propriété introuvable</h2>
        <p>Le bien immobilier demandé n'existe pas ou n'est plus disponible.</p>
        <button onClick={() => navigate('/admin')} className="property-detail-btn-back">
          <ArrowLeftIcon />
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const images = bien.imagesBiens || [];
  const isNew = bien.dateDePublication && (Date.now() - new Date(bien.dateDePublication).getTime() < 7 * 24 * 60 * 60 * 1000);

  // Navigation breadcrumb
  const breadcrumbItems = [
    { label: 'Tableau de bord', action: () => navigate('/admin') },
    { label: bien.statutTransaction || 'Propriété' },
    { label: bien.typeDeBien?.nom || 'Détails' }
  ];

  return (
    <div className="property-detail-page">
      {/* Navigation supérieure */}
      <header className="property-detail-nav">
        <div className="property-detail-nav-content">
          <button onClick={() => navigate('/admin')} className="property-detail-nav-back">
            <ArrowLeftIcon />
            <span>Retour</span>
          </button>
          
          <nav className="property-detail-breadcrumb">
            {breadcrumbItems.map((item, idx) => (
              <span key={idx} className="property-detail-breadcrumb-item">
                {item.action ? (
                  <button onClick={item.action} className="property-detail-breadcrumb-link">
                    {item.label}
                  </button>
                ) : (
                  <span className="property-detail-breadcrumb-current">{item.label}</span>
                )}
                {idx < breadcrumbItems.length - 1 && (
                  <span className="property-detail-breadcrumb-sep">•</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </header>

      <div className="property-detail-container">
        {/* En-tête de la propriété */}
        <section className="property-detail-hero">
          <div className="property-detail-hero-content">
            <div className="property-detail-title-section">
              <h1 className="property-detail-title">
                {bien.titre}
                {isNew && <span className="property-detail-new-badge">Nouveau</span>}
              </h1>
              <div className="property-detail-location-info">
                <MapPinIcon />
                <span>{bien.adresse}, {bien.ville}</span>
              </div>
            </div>
            
            <div className="property-detail-price-section">
              <div className="property-detail-price-main">
                {bien.statutTransaction?.includes('Louer') && !bien.statutTransaction?.includes('Mois)')
                  ? `${bien.prixParNuit?.toLocaleString('fr-FR')} €/nuit`
                  : bien.statutTransaction?.includes('Mois)')
                    ? `${bien.prix?.toLocaleString('fr-FR')} €/mois`
                    : `${bien.prix?.toLocaleString('fr-FR')} €`}
              </div>
              <span className={`property-detail-status ${getStatusBadgeClass(bien.statutTransaction)}`}>
                {bien.statutTransaction}
              </span>
            </div>
          </div>
        </section>

        {/* Galerie d'images premium */}
        <section className="property-detail-gallery-section">
          <div className="property-detail-gallery-container">
            <div className="property-detail-main-gallery">
              {images.length > 0 ? (
                <>
                  <div className="property-detail-main-image-wrapper">
                    <img
                      src={images[currentImageIndex]?.urlImage || "/placeholder.svg"}
                      alt={`Vue ${currentImageIndex + 1} de ${bien.titre}`}
                      className="property-detail-main-image"
                    />
                    <button 
                      className="property-detail-fullscreen-btn"
                      onClick={() => setShowFullscreen(true)}
                    >
                      <ExpandIcon />
                    </button>
                    <div className="property-detail-image-counter">
                      {currentImageIndex + 1} / {images.length}
                    </div>
                  </div>
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        className="property-detail-nav-btn property-detail-nav-prev"
                        onClick={prevImage}
                        disabled={currentImageIndex === 0}
                      >
                        <ChevronLeftIcon />
                      </button>
                      <button 
                        className="property-detail-nav-btn property-detail-nav-next"
                        onClick={nextImage}
                        disabled={currentImageIndex === images.length - 1}
                      >
                        <ChevronRightIcon />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="property-detail-no-image">
                  <HomeIcon />
                  <span>Aucune image disponible</span>
                </div>
              )}
            </div>

            {images.length > 1 && (
              <div className="property-detail-thumbnails" ref={thumbnailsRef}>
                {images.slice(thumbnailStart, thumbnailStart + THUMBNAILS_VISIBLE).map((img, idx) => {
                  const realIdx = thumbnailStart + idx;
                  return (
                    <button
                      key={realIdx}
                      className={`property-detail-thumbnail ${realIdx === currentImageIndex ? 'active' : ''}`}
                      onClick={() => setCurrentImageIndex(realIdx)}
                    >
                      <img src={img.urlImage || "/placeholder.svg"} alt={`Miniature ${realIdx + 1}`} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Contenu principal */}
        <div className="property-detail-main-content">
          <div className="property-detail-info-panel">
            {/* Caractéristiques principales */}
            <section className="property-detail-features-section">
              <h2 className="property-detail-section-title">Caractéristiques</h2>
              <div className="property-detail-features-grid">
                <div className="property-detail-feature-card">
                  <SquareIcon />
                  <div className="property-detail-feature-info">
                    <span className="property-detail-feature-value">{bien.surface}</span>
                    <span className="property-detail-feature-label">m² habitables</span>
                  </div>
                </div>
                
                {bien.nombreDeChambres > 0 && (
                  <div className="property-detail-feature-card">
                    <BedIcon />
                    <div className="property-detail-feature-info">
                      <span className="property-detail-feature-value">{bien.nombreDeChambres}</span>
                      <span className="property-detail-feature-label">
                        chambre{bien.nombreDeChambres > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                   {bien.nombreDeCuisines > 0 && (
                  <div className="property-detail-feature-card">
                    <FaUtensils />
                    <div className="property-detail-feature-info">
                      <span className="property-detail-feature-value">{bien.nombreDeCuisines}</span>
                      <span className="property-detail-feature-label">
                        Cuisine{bien.nombreDeCuisines > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
                
                {bien.nombreDeSallesDeBain > 0 && (
                  <div className="property-detail-feature-card">
                    <BathIcon />
                    <div className="property-detail-feature-info">
                      <span className="property-detail-feature-value">{bien.nombreDeSallesDeBain}</span>
                      <span className="property-detail-feature-label">
                        salle{bien.nombreDeSallesDeBain > 1 ? 's' : ''} de bain
                      </span>
                    </div>
                  </div>
                )}
                
                {bien.nombreDeSalons > 0 && (
                  <div className="property-detail-feature-card">
                    <HomeIcon />
                    <div className="property-detail-feature-info">
                      <span className="property-detail-feature-value">{bien.nombreDeSalons}</span>
                      <span className="property-detail-feature-label">
                        salon{bien.nombreDeSalons > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            <section className="property-detail-description-section">
              <h2 className="property-detail-section-title">Description</h2>
              <div className="property-detail-description-content">
                <p>{bien.description || 'Description non disponible pour cette propriété.'}</p>
              </div>
            </section>

            {/* Détails techniques */}
            <section className="property-detail-specs-section">
              <h2 className="property-detail-section-title">Informations détaillées</h2>
              <div className="property-detail-specs-grid">
                <div className="property-detail-spec-item">
                  <span className="property-detail-spec-label">Type de bien</span>
                  <span className="property-detail-spec-value">{bien.typeDeBien?.nom}</span>
                </div>
                <div className="property-detail-spec-item">
                  <span className="property-detail-spec-label">Surface totale</span>
                  <span className="property-detail-spec-value">{bien.surface} m²</span>
                </div>
                {bien.nombreDeCuisines > 0 && (
                  <div className="property-detail-spec-item">
                    <span className="property-detail-spec-label">Cuisines</span>
                    <span className="property-detail-spec-value">{bien.nombreDeCuisines}</span>
                  </div>
                )}
                <div className="property-detail-spec-item">
                  <span className="property-detail-spec-label">Référence</span>
                  <span className="property-detail-spec-value">BI-{bien.id}</span>
                </div>
                <div className="property-detail-spec-item">
                  <span className="property-detail-spec-label">Publication</span>
                  <span className="property-detail-spec-value">
                    {new Date(bien.dateDePublication).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </section>

            {/* Aménagements */}
            {bien.amenagements && bien.amenagements.length > 0 && (
              <section className="property-detail-amenities-section">
                <h2 className="property-detail-section-title">Équipements & Aménagements</h2>
                <div className="property-detail-amenities-list">
                  {bien.amenagements.map((amenity) => (
                    <span key={amenity.id} className="property-detail-amenity-tag">
                      {amenity.nom}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar contact */}
          <aside className="property-detail-contact-sidebar">
            <div className="property-detail-contact-card">
              <h3 className="property-detail-contact-title">Contactez-nous</h3>
              <p className="property-detail-contact-subtitle">
                Nos experts sont à votre disposition
              </p>
              
              <div className="property-detail-contact-methods">
                <a href="tel:+33123456789" className="property-detail-contact-method">
                  <PhoneIcon />
                  <div className="property-detail-contact-method-info">
                    <span className="property-detail-contact-method-label">Téléphone</span>
                    <span className="property-detail-contact-method-value">01 23 45 67 89</span>
                  </div>
                </a>
                
                <a href="mailto:contact@agence-immo.fr" className="property-detail-contact-method">
                  <MailIcon />
                  <div className="property-detail-contact-method-info">
                    <span className="property-detail-contact-method-label">Email</span>
                    <span className="property-detail-contact-method-value">contact@agence-immo.fr</span>
                  </div>
                </a>
              </div>
              
              <button className="property-detail-contact-cta">
                Demander des informations
              </button>
            </div>

            <div className="property-detail-summary-card">
              <h4 className="property-detail-summary-title">Résumé</h4>
              <div className="property-detail-summary-items">
                <div className="property-detail-summary-item">
                  <span className="property-detail-summary-label">Prix</span>
                  <span className="property-detail-summary-value">
                    {bien.prix?.toLocaleString('fr-FR')} €
                  </span>
                </div>
                <div className="property-detail-summary-item">
                  <span className="property-detail-summary-label">Statut</span>
                  <span className="property-detail-summary-value">{bien.statutTransaction}</span>
                </div>
                <div className="property-detail-summary-item">
                  <span className="property-detail-summary-label">Surface</span>
                  <span className="property-detail-summary-value">{bien.surface} m²</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      {bien.latitude && bien.longitude && !isNaN(bien.latitude) && !isNaN(bien.longitude) && (
        <section style={{ margin: '48px 0 0 0', background: '#f7f9fb', borderRadius: 18, boxShadow: '0 4px 24px #0001', padding: '32px 0' }}>
          <h2 style={{
            fontSize: '1.35rem',
            color: '#1a365d',
            fontWeight: 700,
            marginBottom: 18,
            textAlign: 'center',
            letterSpacing: '0.01em',
            textShadow: '0 1px 0 #fff, 0 2px 8px #0001'
          }}>Localisation du bien</h2>
          <div style={{ width: '100%', maxWidth: 900, margin: '0 auto', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px #0002', border: '1.5px solid #e6e6e6' }}>
            <MapContainer
              center={[parseFloat(bien.latitude), parseFloat(bien.longitude)]}
              zoom={15}
              style={{ height: 320, width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
              />
              <Marker position={[parseFloat(bien.latitude), parseFloat(bien.longitude)]} />
            </MapContainer>
          </div>
        </section>
      )}
    </div>
  );
}

export default PropertyDetail;