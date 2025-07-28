import React, { useState } from "react";
import "./SearchBar.css";
// Si vous voulez l'icône de la loupe de Font Awesome, installez react-icons: npm install react-icons
import { FaSearch, FaPlus } from 'react-icons/fa';


export default function SearchBar({
  ville, setVille,
  type, setType,
  budgetMin, setBudgetMin, // Gardez vos inputs pour la logique
  budgetMax, setBudgetMax, // Gardez vos inputs pour la logique
  mode, setMode,
  advancedSearch, setAdvancedSearch,
  onSearch: parentOnSearch
}) {


  // Nouvelle fonction de recherche qui envoie les bons paramètres
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (ville) params.append("ville", ville);
    if (type) params.append("typeDeBienNom", type);
    if (budgetMin !== "" && !isNaN(Number(budgetMin))) params.append("prixMin", budgetMin);
    if (budgetMax !== "" && !isNaN(Number(budgetMax))) params.append("prixMax", budgetMax);
    if (advancedSearch) params.append("recherche", advancedSearch);
    if (mode === 'acheter') params.append("statut", "À Vendre");
    if (mode === 'louer') params.append("statut", "À Louer");
    // Appelle la fonction parent si besoin (ex: navigation)
    if (parentOnSearch) {
      parentOnSearch(e, params);
    } else {
      // Par défaut, redirige
      window.location.href = `/biens?${params.toString()}`;
    }
  };

  return (

    <div className="searchbar-wrapper">
      <div className="searchbar-switch">
        <button
          type="button"
          className={`searchbar-switch-btn ${mode === 'acheter' ? 'active' : ''}`}
          onClick={() => setMode('acheter')}
        >
          Acheter
        </button>
        <button
          type="button"
          className={`searchbar-switch-btn ${mode === 'louer' ? 'active' : ''}`}
          onClick={() => setMode('louer')}
        >
          Louer
        </button>
        {/* L'image montre aussi "LOCATION SAISONNIÈRE" */}
        {/* <button
          type="button"
          className={`searchbar-switch-btn ${mode === 'saisonniere' ? 'active' : ''}`}
          onClick={() => setMode('saisonniere')}
        >
          Location Saisonnière
        </button> */}
      </div>

      <div className="searchbar-full">
        <form className="search-bar" onSubmit={handleSearch}>
          <select value={ville} onChange={e => setVille(e.target.value)}>
            <option>Marrakech</option>
            <option>Casablanca</option>
            <option>Rabat</option>
            <option>Agadir</option>
          </select>

          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="">Type de bien</option>
            <option value="Appartement">Appartement</option>
            <option value="Maison">Maison</option>
            <option value="Villa">Villa</option>
            <option value="Studio">Studio</option>
          </select>

          {/* Budget group sur une seule ligne avec séparateur */}
          <div className="budget-group">
            <input
              type="number"
              placeholder="Budget min"
              value={budgetMin}
              onChange={e => setBudgetMin(e.target.value)}
              min={0}
            />
            <span className="budget-separator">-</span>
            <input
              type="number"
              placeholder="Budget max"
              value={budgetMax}
              onChange={e => setBudgetMax(e.target.value)}
              min={0}
            />
          </div>

          {/* Recherche avancée : input texte éditable + icône + */}
          <div className="advanced-search-placeholder">
            <input
              type="text"
              className="advanced-search-input"
              placeholder="Recherche avancée"
              value={advancedSearch}
              onChange={e => setAdvancedSearch(e.target.value)}
            />
            <FaPlus />
          </div>

          <button className="search-btn" type="submit">
            <FaSearch /> {/* Icône de loupe */}
          </button>
        </form>
      </div>

      {/* Bouton "Estimer votre bien" - il n'était pas dans votre code HTML initial, mais il est dans l'image */}
      <div className="estimate-button-container">
          <button className="estimate-button">ESTIMER VOTRE BIEN</button>
      </div>

    </div>
  );
}