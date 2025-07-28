import React from 'react';
import './PropertyInfo.css'; // Nous allons créer ce fichier

import { FaBed, FaBath, FaRulerCombined, FaShareAlt, FaCheck } from 'react-icons/fa';
const PropertyInfo = ({ property }) => {
  if (!property) return null;

  // Création du titre dynamique
  const title = `${property.statutTransaction?.toUpperCase()} – ${property.typeDeBien?.nom?.toUpperCase()} – ${property.quartier || property.ville}`;

  return (
    <main className="property-info-container">
      {/* Titre et infos clés */}
     
<header className="property-info-header">
  <h1>{title}</h1>
  <div className="property-key-features">
    {/* 👇 On regroupe les caractéristiques ici pour un meilleur alignement 👇 */}
    <div className="features-group">
      <span><FaBed /> {property.nombreDeChambres} chambres</span>

      {/* --- LIGNE AJOUTÉE POUR LES SALLES DE BAIN --- */}
      <span><FaBath /> {property.nombreDeSallesDeBain} salle{property.nombreDeSallesDeBain > 1 ? 's' : ''} de bain</span>

      {/* --- LIGNE AJOUTÉE POUR LA SURFACE --- */}
      <span><FaRulerCombined /> {property.surface} m²</span>
    </div>

    {/* Le prix reste à droite */}
    <span className="price-ask">
      {property.prix ? property.prix.toLocaleString('fr-FR') : 'Nous consulter'} EUR
    </span>
  </div>
</header>

      {/* Description */}
      <p className="property-description">{property.description}</p>

      {/* Liens d'action */}
      <div className="property-actions">
        <a href="#partager"><FaShareAlt /> Partager cette annonce</a>
        <a href="/honoraires">Voir nos honoraires</a>
      </div>

      {/* Grille d'informations détaillées */}
      <section className="property-details-grid">
        <h3>Informations Sur Le Bien</h3>
        <div className="details-grid">
          <div className="detail-item"><span>RÉF</span><span>{property.id}</span></div>
          <div className="detail-item"><span>SUR. HABITABLE</span><span>{property.surface} m²</span></div>
          <div className="detail-item"><span>VILLE</span><span>{property.ville}</span></div>
          <div className="detail-item"><span>CHAMBRES</span><span>{property.nombreDeChambres}</span></div>
          <div className="detail-item"><span>SDB</span><span>{property.nombreDeSallesDeBain}</span></div>

          <div className="detail-item"><span>OPÉRATION</span><span>{property.statutTransaction}</span></div>
          <div className="detail-item"><span>TYPE</span><span>{property.typeDeBien?.nom}</span></div>
          <div className="detail-item"><span>QUARTIER</span><span>{property.quartier || 'Non spécifié'}</span></div>
        </div>
      </section>

      {/* Équipements */}
      {property.amenagements && property.amenagements.length > 0 && (
        <section className="property-amenities">
          <h3>Equipements</h3>
          <ul className="amenities-list">
            {property.amenagements.map((amenity) => (
              <li key={amenity.id}><FaCheck /> {amenity.nom}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
};

export default PropertyInfo;