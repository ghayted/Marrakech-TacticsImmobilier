import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './AboutBlock.css';

const MARRON = "#8B4513";
const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MARRON} strokeWidth="2"><path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/></svg>
);
const SquareIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={MARRON} strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/></svg>
);

function NextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "flex", right: -30, zIndex: 2 }}
      onClick={onClick}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MARRON} strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
    </div>
  );
}
function PrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "flex", left: -30, zIndex: 2 }}
      onClick={onClick}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={MARRON} strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
    </div>
  );
}

function ServicesBlock() {
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecentBiens = async () => {
      try {
        const response = await fetch('https://api.immotactics.live/api/BiensImmobiliers');
        const data = await response.json();
        // Sort by DateDePublication descending (most recent first)
        const sorted = data.sort((a, b) => new Date(b.dateDePublication) - new Date(a.dateDePublication));
        setBiens(sorted.slice(0, 4));
      } catch (error) {
        console.error("Erreur lors de la récupération des biens:", error);
      }
      setLoading(false);
    };
    fetchRecentBiens();
  }, []);

  const sliderSettings = {
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 1,
    arrows: true,
    dots: false,
    autoplay: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          adaptiveHeight: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          dots: true,
          adaptiveHeight: true
        }
      }
    ]
  };

  if (loading) {
    return <div>Chargement des biens récents...</div>;
  }

  return (
    <section className="about-block-section">
      <div className="about-block-container">
        <div className="about-text-content">
          <h2>Nos biens les plus récents</h2>
          <p>
        Marrakech Tactics vous propose sa sélection de bien immobilier inédite à Marrakech
           
          </p>
          <button className="btn-view-all" onClick={() => navigate('/biens')}>
          VOIR TOUTES LES NOUVEAUTÉS
          </button>
        </div>
        <div className="about-properties-list-slider">
          <Slider {...sliderSettings}>
            {biens.map(bien => (
              <div key={bien.id}>
                <div className="property-card-about" style={{cursor: 'pointer'}} onClick={() => navigate(`/property/${bien.id}`)}>
                  <div className="card-image-container">
                    <img src={bien.imagePrincipale || 'placeholder.jpg'} alt={bien.titre} />
                    <div className="card-image-overlay"></div>
                  </div>
                  <div className="card-content">
                    <p className="property-type">{bien.typeDeBien}</p>
                    <h3 className="property-title-about">{bien.titre}</h3>
                    <div className="property-features-about">
                      <span><BedIcon /> {bien.nombreDeChambres} Chambres</span>
                      <span><SquareIcon /> {bien.surface} m²</span>
                    </div>
                    <div className="property-bottom-about">
                      <span className="property-ref-about">
                        REF. 5860{bien.id}
                      </span>
                      <span className="property-price-about">
                        {bien.prix.toLocaleString('fr-FR')} €
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

export default ServicesBlock; 