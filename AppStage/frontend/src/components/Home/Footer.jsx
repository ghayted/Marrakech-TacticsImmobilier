import React from 'react';
import { FaPhoneAlt, FaFacebookF, FaLinkedinIn, FaPinterestP, FaYoutube, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import { FiChevronUp } from 'react-icons/fi';
import './Footer.css';

const BarnesFooter = () => {
  return (
    <>
      <footer className="barnes-footer">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-contact">
              <div className="logo">
                <div className="logo-outer-circle">
                  <img
                    src="/logo site.png"
                    alt="Logo Marrakech Tactics"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: '50%'
                    }}
                  />
                </div>
              </div>
              <div className="contact-details">
                <h2>Marrakech Tactics</h2>
                <p className="phone-numbers">
                  <FaPhoneAlt size={14} /> +212 5 24 433 200
                  <span className="phone-separator"></span>
                  <FaPhoneAlt size={14} /> +212 6 69 290 290
                </p>
                <p className="address"> AL Massar 597, deuxième étage, Marrakech, 40000 Maroc
                </p>
              </div>
            </div>
            <div className="footer-social">
              <p>Suivez-nous sur les réseaux sociaux</p>
              <div className="social-icons">
                <a href="#facebook" aria-label="Facebook"><FaFacebookF /></a>
                <a href="#linkedin" aria-label="LinkedIn"><FaLinkedinIn /></a>
                <a href="#pinterest" aria-label="Pinterest"><FaPinterestP /></a>
                <a href="#youtube" aria-label="YouTube"><FaYoutube /></a>
                <a href="#instagram" aria-label="Instagram"><FaInstagram /></a>
              </div>
            </div>
          </div>

          <hr className="footer-divider" />

          <div className="footer-middle">
            <h3>TACTICS IMMOBILIER DE LUXE - Les plus belles demeures et appartements de prestige</h3>
            <p>
              Poussez la porte d’une de nos <span className="highlight">agences immobilières</span> parmi nos 75 destinations et confiez-nous vos projets d’investissement. <span className="highlight">Groupe immobilier de prestige</span> spécialisé dans les propriétés d’exception au Maroc depuis plus de 4 ans, nous vous proposons des appartements de luxe, des chalets sur les pistes, des villas en bord de mer ou encore des <span className="highlight">châteaux</span> à la campagne avec ou sans <span className="highlight">domaine de chasse</span>. Nous offrons également à nos clients des services complémentaires de conciergerie, de <span className="highlight">gestion des propriétés</span>, de <span className="highlight">financement</span>, ou encore de <span className="highlight">rénovation</span>.
            </p>
          </div>
          
          <div className="footer-bottom">
             <p>© 2025 Marrakech Tactics INTERNATIONAL REALTY</p>
             <div className="footer-links">
                <a href="#charte">CHARTE</a>
                <a href="#mentions">MENTIONS LÉGALES</a>
             </div>
          </div>
        </div>
      </footer>
      
      {/* Floating Action Buttons */}
      <div className="floating-action-buttons">
          <button className="fab fab-up" aria-label="Scroll to top"><FiChevronUp /></button>
          <button className="fab fab-whatsapp" aria-label="WhatsApp"><FaWhatsapp /></button>
          <button className="fab fab-phone" aria-label="Call us"><FaPhoneAlt /></button>
      </div>
    </>
  );
};

export default BarnesFooter;