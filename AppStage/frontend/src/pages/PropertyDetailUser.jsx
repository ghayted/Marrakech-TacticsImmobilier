import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import des styles
import './PropertyDetailUser.css';
import 'leaflet/dist/leaflet.css';

// Import des sous-composants
import Header from '../components/Home/Header';
import Breadcrumb from '../components/Breadcrumb';
import PropertyGallery from '../components/PropertyDetail/PropertyGallery';
import PropertyInfo from '../components/PropertyDetail/PropertyInfo';
import ContactSidebar from '../components/PropertyDetail/ContactSidebar';
import LocationMap from '../components/PropertyDetail/LocationMap';
import SimilarProperties from '../components/PropertyDetail/SimilarProperties'; 
import Footer from '../components/Home/Footer';

const quartiersDeMarrakech = [
  "Guéliz", "Hivernage", "Palmeraie", "Sidi Youssef", "Ménara", "Agdal",
  "Targa", "Massira", "Daoudiate", "Semlalia", "Majorelle", "Médina",
  "Noria", "Prestigia"
];

// La fonction qui cherche le quartier dans l'adresse
const trouverQuartierDansAdresse = (adresse, listeQuartiers) => {
  if (!adresse) return 'Non spécifié';
  for (const quartier of listeQuartiers) {
    if (adresse.toLowerCase().includes(quartier.toLowerCase())) {
      return quartier;
    }
  }
  return 'Autre';
};
function PropertyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false); // Gardé pour une future utilisation
  const token = localStorage.getItem('authToken');

  // La logique pour récupérer les données reste ici, dans le composant parent
  useEffect(() => {
    const fetchBien = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5257/api/BiensImmobiliers/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (response.ok) setBien(await response.json());
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setLoading(false);
        }
    };
    fetchBien();
  }, [id, token]);
  
  // Fonctions pour la galerie, passées en props
  const nextImage = () => {
    if (bien?.imagesBiens) {
      setCurrentImageIndex(prev => (prev + 1) % bien.imagesBiens.length);
    }
  };
  const prevImage = () => {
    if (bien?.imagesBiens) {
      setCurrentImageIndex(prev => (prev - 1 + bien.imagesBiens.length) % bien.imagesBiens.length);
    }
  };

  if (loading) return <div className="property-detail-loading"><span>Chargement...</span></div>;
  if (!bien) return <div className="property-detail-error"><h2>Propriété introuvable</h2></div>;

  const isNew = bien.dateDePublication && (Date.now() - new Date(bien.dateDePublication).getTime() < 7 * 24 * 60 * 60 * 1000);
  const quartierDetecte = trouverQuartierDansAdresse(bien.adresse, quartiersDeMarrakech);

  // On crée une copie de l'objet 'bien' avec la nouvelle information 'quartier'
  const bienAvecQuartier = {
    ...bien,
    quartier: quartierDetecte
  };
  
  return (
    <div className="property-detail-page">
      <Header />
      <div className="property-detail-container">
        {/* En-tête de la propriété */}
        <Breadcrumb property={bien} />

        {/* Composant pour la Galerie d'images */}
        <PropertyGallery
          images={bien.imagesBiens || []}
          currentImageIndex={currentImageIndex}
          onSelectImage={setCurrentImageIndex}
          onPrev={prevImage}
          onNext={nextImage}
          onFullscreen={() => setShowFullscreen(true)}
        />
        
        <div className="property-detail-main-content">
          {/* Composant pour les Infos (Caractéristiques, Description...) */}
          <PropertyInfo property={bienAvecQuartier} />

          {/* Composant pour le Contact */}
          <ContactSidebar property={bien} />
        </div>
      </div>
      
      {/* Composant pour la Localisation */}
      <LocationMap latitude={bien.latitude} longitude={bien.longitude} />
      <SimilarProperties
  currentPropertyId={bien.id}
  propertyStatus={bien.statutTransaction}
  propertyType={bien.typeDeBien?.nom} // 👈 On ajoute simplement ".nom"
/>
      <Footer />
    </div>
  );
}

export default PropertyDetail;