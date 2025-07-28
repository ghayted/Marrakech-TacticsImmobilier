import React, { useState, useEffect } from 'react';
import './ImageLghtbox.css'; // Nous allons créer ce fichier CSS

import { FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';

const ImageLightbox = ({ images, startIndex = 0, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Fonctions pour naviguer entre les images
  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === images.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  // Gérer la navigation avec les flèches du clavier
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowLeft') {
        goToPrevious();
      } else if (event.key === 'ArrowRight') {
        goToNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Nettoyage de l'écouteur d'événement
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex]);


  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      <button className="lightbox-nav-btn prev" onClick={(e) => { e.stopPropagation(); goToPrevious(); }}>
        <FaArrowLeft />
      </button>

      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img
          src={images[currentIndex].url || images[currentIndex].urlImage}
          alt={images[currentIndex].alt || `Photo ${currentIndex + 1}`}
          className="lightbox-image"
        />
        <div className="lightbox-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
      
      <button className="lightbox-nav-btn next" onClick={(e) => { e.stopPropagation(); goToNext(); }}>
        <FaArrowRight />
      </button>
    </div>
  );
};

export default ImageLightbox;