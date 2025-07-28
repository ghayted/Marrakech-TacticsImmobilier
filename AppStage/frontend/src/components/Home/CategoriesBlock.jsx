// src/components/QuartiersBlock.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './CategoriesBlock.css';

// Données des quartiers avec des images de remplacement
const quartiersData = [
  { nom: 'Palmeraie', image: 'https://www.barnes-marrakech.com/images/localisations/61.jpg' },
  { nom: 'Hivernage', image: 'https://reportage.com.tr/storage/post/large/MN29e2wKUGxLHk6gA8zTPNyF5YhB9rQ2apfoa6sZ.jpg' },
  { nom: 'Guéliz', image: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { nom: 'Agdal', image: 'https://www.barnes-marrakech.com/images/localisations/route_de_ouarzazate,_golf_amelkis.jpg' },
  { nom: 'Médina', image: 'https://media.licdn.com/dms/image/v2/C561BAQGDcAue4IKyIQ/company-background_10000/company-background_10000/0/1606738350994/medina_mall_marrakech_cover?e=2147483647&v=beta&t=-fFokRLTGvkHPB0e6rIf8Zp-fu_HJdVrerWp-_lYX3E' },
  { nom: 'Majorelle', image: 'https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { nom: 'Semlalia', image: 'https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { nom: 'Targa', image: 'https://images.pexels.com/photos/2635038/pexels-photo-2635038.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' },
  { nom: 'Prestigia', image: 'https://www.barnes-marrakech.com/images/localisations/2-11-17_villa_royal_palm_12.jpg' },
];

function QuartiersBlock() {
  const navigate = useNavigate();

  const handleQuartierClick = (quartierNom) => {
    // On navigue vers la page de la liste des biens en passant le quartier comme paramètre de filtre
    navigate(`/biens?quartier=${encodeURIComponent(quartierNom)}`);
  };

  return (
    <section className="quartiers-section">
      <div className="quartiers-container">
        <div className="quartiers-header">
          <h2>L'immobilier De Prestige À Marrakech</h2>
          <p>Découvrez les plus beaux biens immobiliers en vente et à la location à Marrakech par <span className="highlight">QUARTIER</span></p>
        </div>
        <div className="quartiers-grid">
          {quartiersData.map((quartier, index) => (
            <div 
              key={quartier.nom} 
              className={`quartier-card item-${index + 1}`}
              onClick={() => handleQuartierClick(quartier.nom)}
            >
              <img src={quartier.image} alt={`Vue du quartier ${quartier.nom}`} className="quartier-image" />
              <div className="quartier-overlay"></div>
              <span className="quartier-name">{quartier.nom}</span>
              <div className="quartier-hover-content">
                <span>Découvrir</span>
                <span className="arrow-icon">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default QuartiersBlock;