import React, { useState, useEffect, useRef } from "react";
import { FaBars, FaHeart, FaChevronDown, FaUser, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import './Header.css';
import ClientLoginModal from '../Auth/ClientLoginModal';
import { useNavigate } from 'react-router-dom';

function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSidebarMenu, setShowSidebarMenu] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier l'authentification au chargement
    const token = localStorage.getItem('authToken');
    const storedUserData = localStorage.getItem('userData');
    if (token && storedUserData) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    function handleClickOutside(event) {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setShowSidebarMenu(false);
      }
    }
    if (showSidebarMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSidebarMenu]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUserData(null);
    window.location.href = '/';
  };

  const handleLogin = () => {
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
    setShowLoginModal(false);
  };

  const handleRegisterSuccess = (user) => {
    setIsAuthenticated(true);
    setUserData(user);
    setShowLoginModal(false);
  };

  const handleNavigateReservations = () => {
    setShowSidebarMenu(false);
    navigate('/mes-reservations');
  };

  return (
    <>
      <header className="client-header">
        <div className="client-header-top">
          <div className="client-burger-menu" onClick={() => setShowSidebarMenu(true)}>
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
          {isAuthenticated ? (
            <div className="client-auth-section">
              <span className="client-user-info">
                <FaUser />
                {userData?.prenom || 'Utilisateur'}
              </span>
              <button onClick={handleLogout} className="client-logout-btn">
                <FaSignOutAlt />
                Se déconnecter
              </button>
            </div>
          ) : (
            <button onClick={handleLogin} className="client-login-btn">
              <FaUser />
              Se connecter
            </button>
          )}
        </div>
      </header>

      {/* Sidebar menu */}
      {showSidebarMenu && (
        <div className="sidebar-menu-overlay">
          <div className="sidebar-menu" ref={sidebarRef}>
            <button className="sidebar-menu-close" onClick={() => setShowSidebarMenu(false)}><FaTimes /></button>
            <h3>Menu</h3>
            <ul>
              {isAuthenticated && (
                <li>
                  <button className="sidebar-link" onClick={handleNavigateReservations}>
                    Mes Réservations
                  </button>
                </li>
              )}
              {/* Tu peux ajouter d'autres liens ici */}
            </ul>
          </div>
        </div>
      )}

      {/* Modal de connexion */}
      {showLoginModal && (
        <ClientLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}
    </>
  );
}

export default Header;