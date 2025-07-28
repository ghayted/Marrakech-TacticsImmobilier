import React, { useState } from 'react'; // 👈 1. Importer useState
import './PropertyGalleryGrid.css';

import ImageLightbox from './ImageLightbox'; // 👈 3. Importer le composant Lightbox

import { FaCamera, FaHeart } from 'react-icons/fa';

/**
 * Composant galerie qui gère lui-même l'ouverture de la lightbox.
 *
 * @param {object} props
 * @param {Array<object>} props.images - Tableau d'objets image venant de votre BDD.
 * @param {string} props.status - Le statut du bien, ex: "VENTE", "LOCATION"
 */
const PropertyGalleryGrid = ({ images = [], status }) => {
  // --- GESTION DE LA LIGHTBOX ---
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxStartIndex, setLightboxStartIndex] = useState(0);

  // Fonction pour ouvrir la lightbox avec la bonne image
  const handleOpenLightbox = (index) => {
    setLightboxStartIndex(index);
    setLightboxOpen(true);
  };
  // --- FIN DE LA GESTION LIGHTBOX ---

  if (images.length === 0) {
    return (
      <div className="gallery-no-image-placeholder">
        Aucune image disponible pour ce bien
      </div>
    );
  }

  const mainImage = images[0];
  const smallImage1 = images[1];
  const smallImage2 = images[2];

  const statusClassName = status?.toLowerCase() === 'vente' ? 'status-badge-sale' : 'status-badge-rent';
  const containerClassName = `gallery-grid-container image-count-${Math.min(images.length, 3)}`;

  // On utilise un Fragment (<>...</>) pour retourner plusieurs éléments au même niveau
  return (
    <>
      <div className={containerClassName}>
        {/* Colonne de gauche (cliquable pour ouvrir la lightbox à l'index 0) */}
        {mainImage && (
          <div className="gallery-large-image" onClick={() => handleOpenLightbox(0)}>
            <img src={mainImage.url || mainImage.urlImage} alt={mainImage.alt || 'Image principale'} />
            {status && <div className={`gallery-status-badge ${statusClassName}`}>{status}</div>}
            <button className="gallery-favorite-btn" onClick={(e) => { e.stopPropagation(); /* Logique favori ici */ }}><FaHeart /></button>
            <div className="gallery-bottom-controls">
              <button className="gallery-photos-btn">
                <FaCamera />
                <span>{images.length} Photos</span>
              </button>
            </div>
          </div>
        )}

        {/* Colonne de droite */}
        {images.length > 1 && (
          <div className="gallery-small-images">
            {/* Image 2 (cliquable pour ouvrir la lightbox à l'index 1) */}
            {smallImage1 && (
              <div className="gallery-small-image-item" onClick={() => handleOpenLightbox(1)}>
                <img src={smallImage1.url || smallImage1.urlImage} alt={smallImage1.alt || 'Image secondaire 1'} />
              </div>
            )}
            {/* Image 3 (cliquable pour ouvrir la lightbox à l'index 2) */}
            {smallImage2 && (
              <div className="gallery-small-image-item" onClick={() => handleOpenLightbox(2)}>
                <img src={smallImage2.url || smallImage2.urlImage} alt={smallImage2.alt || 'Image secondaire 2'} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- AFFICHAGE CONDITIONNEL DE LA LIGHTBOX --- */}
      {isLightboxOpen && (
        <ImageLightbox
          images={images}
          startIndex={lightboxStartIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default PropertyGalleryGrid;