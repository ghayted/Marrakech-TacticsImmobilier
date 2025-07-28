import React from "react";
import { FaBars, FaHeart, FaChevronDown } from 'react-icons/fa'; // Import des icônes
import './Header.css';

function Header() {
  return (
    <header className="client-header">
      <div className="client-header-top">
        <div className="client-burger-menu">
          <FaBars />
        </div>
        <div className="client-logo-container">
          <span className="client-logo-main">Marrakech</span>
          <span className="client-logo-line"></span>
          <span className="client-logo-sub">TacTics</span>
         
        </div>
        <div className="client-header-utils">
          <span className="client-currency-selector">
            EUR <FaChevronDown className="arrow-down" />
          </span>
          <span className="client-language-selector">
            FR <FaChevronDown className="arrow-down" />
          </span>
          <span className="client-favorites">
            <FaHeart />
            <span className="client-favorite-count">0</span>
          </span>
        </div>
      </div>
      <div className="client-navbar-row">
        <div className="client-navbar-left"></div>
        <nav className="client-nav">
          <a href="#">ACHETER</a>
          <a href="#">LOUER</a>
          <a href="#">DÉCOUVRIR MARRAKECH</a>
          <a href="#">ACTUALITÉS</a>
          <a href="#">CONTACT</a>
        </nav>
        <a href="#" className="client-nav-estimation">DEMANDE D'ESTIMATION</a>
      </div>
    </header>
  );
}

export default Header;