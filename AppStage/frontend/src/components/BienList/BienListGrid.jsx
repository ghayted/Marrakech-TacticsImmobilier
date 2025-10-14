import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './BienListGrid.css';

const BienListGrid = ({ biens, loading }) => {
  // Debug pour voir la structure exacte des données
  console.log('Détail des biens:', biens.map(bien => ({
    id: bien.id,
    titre: bien.titre,
    statut: bien.statutTransaction,
    prix: bien.prix,
    prixParNuit: bien.prixParNuit
  })));
  const navigate = useNavigate();
  const location = useLocation();

  const handlePropertyClick = (bienId) => {
    const searchParams = new URLSearchParams(location.search);
    const dateDebut = searchParams.get('dateDebut');
    const dateFin = searchParams.get('dateFin');
    const nombreVoyageurs = searchParams.get('nombreVoyageurs');

    console.log('🔍 [BienListGrid] Dates dans l\'URL actuelle:', { dateDebut, dateFin, nombreVoyageurs });

    let propertyUrl = `/property/${bienId}`;
    
    // Si nous avons des dates, les ajouter à l'URL
    if (dateDebut && dateFin) {
      propertyUrl += `?dateDebut=${dateDebut}&dateFin=${dateFin}`;
      if (nombreVoyageurs) {
        propertyUrl += `&nombreVoyageurs=${nombreVoyageurs}`;
      }
    }
    
    console.log('🔍 [BienListGrid] Navigation vers:', propertyUrl);
    navigate(propertyUrl);
  };

  return (
    <section className="bienslist-section">
      <div className="bienslist-grid">
        {loading ? (
          <div className="client-biens-empty">Chargement...</div>
        ) : biens.length === 0 ? (
          <div className="client-biens-empty">Aucun bien trouvé.</div>
        ) : (
          biens.map(bien => (
            <div
              className="bienslist-card"
              key={bien.id}
              onClick={() => handlePropertyClick(bien.id)}
            >
              {/* Le texte en superposition sur l'image pour le premier bien n'est PAS dans ce code. S'il réapparaît, il est injecté ailleurs. */}
              
              {bien.nouveaute && <span className="bienslist-badge">NOUVEAUTÉS</span>}
              
              {/* Le conteneur d'image doit rester simple */}
              <div className="bienslist-img-container">
                <img src={bien.imagePrincipale || '/placeholder.svg'} alt={bien.titre} />
              </div>

              {/* Le contenu de la carte */}
              <div className="bienslist-card-content">
                <h3>{bien.titre}</h3>
                <div className="bienslist-card-desc">{bien.description?.substring(0, 80) || '...'}</div> {/* Ajout du '...' par défaut si la description est vide pour éviter le "tassement" */}
                
                <div className="bienslist-card-meta">
                  {/* C'est ici que le texte '4 Chambres 400 M²' apparaît. */}
                  {bien.golfs && <div>{bien.golfs}</div>}
                  {bien.nombreDeChambres && <span>{bien.nombreDeChambres} Chambres</span>}
                  {bien.surface && <span>{bien.surface} M²</span>}
                </div>
                
                <div className="bienslist-card-price">
                  <span className="price-amount">
                    {bien.statutTransaction?.includes('Louer') && !bien.statutTransaction?.includes('Mois')
                      ? `${bien.prixParNuit?.toLocaleString('fr-FR')} EUR`
                      : `${bien.prix?.toLocaleString('fr-FR')} EUR`}
                  </span>
                  {bien.statutTransaction?.includes('Louer') && !bien.statutTransaction?.includes('Mois') && (
                    <span className="price-unit">/nuit</span>
                  )}
                  {bien.statutTransaction === 'À Louer (Mois)' && (
                    <span className="price-unit">/mois</span>
                  )}
                </div>
                
                <button className="bienslist-card-btn">Voir Le Bien</button>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default BienListGrid;