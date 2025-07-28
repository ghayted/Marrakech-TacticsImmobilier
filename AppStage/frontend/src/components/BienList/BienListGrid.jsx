import React from 'react';
import { useNavigate } from 'react-router-dom';
import './BienListGrid.css';

const BienListGrid = ({ biens, loading }) => {
  const navigate = useNavigate();
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
              style={{ cursor: 'pointer' }}
              onClick={() => navigate(`/property/${bien.id}`)}
            >
              {bien.nouveaute && <span className="bienslist-badge">NOUVEAUTÉS</span>}
              <div className="bienslist-img-container">
                <img src={bien.imagePrincipale || '/placeholder.svg'} alt={bien.titre} />
              </div>
              <div className="bienslist-card-content">
                <h3>{bien.titre}</h3>
                <div className="bienslist-card-desc">{bien.description?.substring(0, 80)}...</div>
                <div className="bienslist-card-meta">
                  {bien.golfs && <div>{bien.golfs}</div>}
                  {bien.nombreDeChambres && <span>{bien.nombreDeChambres} Chambres</span>}
                  {bien.surface && <span>{bien.surface} M²</span>}
                </div>
                <div className="bienslist-card-price">{bien.prix?.toLocaleString('fr-FR')} EUR</div>
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
