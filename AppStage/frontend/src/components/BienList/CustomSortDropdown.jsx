import React, { useState, useEffect, useRef } from 'react';
import { FaBars, FaCheck } from 'react-icons/fa';
import './CustomSortDropdown.css'; // Nous allons créer ce fichier CSS

const CustomSortDropdown = ({ options, selectedValue, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Pour détecter les clics en dehors du menu

  // Trouve le label de l'option actuellement sélectionnée
  const selectedLabel = options.find(opt => opt.value === selectedValue)?.label || options[0].label;

  // Gère la fermeture du menu si on clique n'importe où sur la page
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    // Ajoute l'écouteur d'événement
    document.addEventListener('mousedown', handleClickOutside);
    // Nettoie l'écouteur pour éviter les fuites de mémoire
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (value) => {
    onChange(value); // Met à jour l'état dans le composant parent
    setIsOpen(false); // Ferme le menu
  };

  return (
    <div className="custom-dropdown2" ref={dropdownRef}>
      <button type="button" className="dropdown-toggle2" onClick={() => setIsOpen(!isOpen)}>
        <FaBars className="sort-icon2" />
        <span>{selectedLabel}</span>
        <span className={`arrow2 ${isOpen ? 'up' : 'down'}`}></span>
      </button>

      {isOpen && (
        <ul className="dropdown-menu2">
          {options.map((option) => (
            <li
              key={option.value}
              className={`dropdown-item2 ${selectedValue === option.value ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
              {selectedValue === option.value && <FaCheck className="check-icon2" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSortDropdown;