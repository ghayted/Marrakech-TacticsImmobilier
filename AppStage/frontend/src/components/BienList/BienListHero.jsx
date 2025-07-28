import React from 'react';
import './BienListHero.css';

const BienListHero = ({ ville }) => {
  // J'ai utilisé une URL d'image qui correspond mieux à celle de la photo.
  const HERO_IMG = 'https://www.barnes-marrakech.com/images/banner.jpg';
  
  return (
    // On utilise un fragment (<>) pour retourner deux éléments frères.
    <>
      <div className="bienslist-hero" style={{backgroundImage: `url(${HERO_IMG})`}}>
        {/* L'overlay sombre est maintenant géré par un pseudo-élément en CSS */}
        <h1>Immobilier {ville}</h1>
      </div>

      {/* Le fil d'Ariane est maintenant à l'extérieur, comme sur l'image */}
      <div className="bienslist-breadcrumb-modern">
        <span>VOUS ÊTES ICI : </span>
        <span> &gt;  </span>
        <a href="/">ACCUEIL</a>
        <span> &gt;  </span>
        <span className="bienslist-breadcrumb-current"> IMMOBILIER {ville && ville.toUpperCase()}</span>
      </div>
    </>
  );
};

export default BienListHero;