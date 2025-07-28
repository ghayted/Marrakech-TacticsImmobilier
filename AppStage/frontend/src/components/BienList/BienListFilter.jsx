import React from 'react';
// On importe les icônes nécessaires. FaBars n'est plus utilisé directement ici.
import { FaPlus, FaSearch, FaBell } from 'react-icons/fa'; 
// On importe notre nouveau composant de menu déroulant
import CustomSortDropdown from './CustomSortDropdown'; 
import './BienListFilter.css';

const FilterSection2 = ({
  type, setType,
  quartier, setQuartier,
  budgetMin, setBudgetMin,
  budgetMax, setBudgetMax,
  search, setSearch,
  tri, setTri,
  ville,
  annoncesCount,
  handleFilter
}) => {

  // La logique pour gérer le budget reste la même
  const handleBudgetChange = (e) => {
    const value = e.target.value;
    if (value === 'Moins de 500 000 €') {
      setBudgetMin('');
      setBudgetMax('500000');
    } else if (value === '500 000 € - 1 000 000 €') {
      setBudgetMin('500000');
      setBudgetMax('1000000');
    } else if (value === 'Plus de 1 000 000 €') {
      setBudgetMin('1000000');
      setBudgetMax('');
    } else {
      setBudgetMin('');
      setBudgetMax('');
    }
  };

  // On définit ici les options qui seront passées à notre composant de tri
  const sortOptions = [
    { value: '', label: 'TRIER PAR : Nouveauté' },
    { value: 'asc', label: 'Prix croissant' },
    { value: 'desc', label: 'Prix décroissant' }
  ];

  return (
    <div className="filter-wrapper2">
      <h2 className="intro-title2">
        Marrakech Tactics vous présente une sélection de maisons, appartements et villas à vendre dans les plus belles destinations du monde.
      </h2>

      <form className="filter-bar2" onSubmit={handleFilter}>
        {/* Le reste du formulaire de recherche ne change pas */}
        <div className="filter-field2">
          <select aria-label="Type de bien" value={type} onChange={e => setType(e.target.value)}>
            <option value="">Type de bien</option>
            <option value="Villa">Villa</option>
            <option value="Appartement">Appartement</option>
            <option value="Studio">Studio</option>
            <option value="Maison">Maison</option>
          </select>
        </div>

        <div className="filter-field2">
          <select aria-label="Budget" onChange={handleBudgetChange}>
            <option value="">Budget</option>
            <option>Moins de 500 000 €</option>
            <option>500 000 € - 1 000 000 €</option>
            <option>Plus de 1 000 000 €</option>
          </select>
        </div>

        <div className="filter-field2">
          <select aria-label="Quartier" value={quartier} onChange={e => setQuartier(e.target.value)}>
            <option value="">Tous les quartiers</option>
            <option value="Guéliz">Guéliz</option>
            <option value="Hivernage">Hivernage</option>
            <option value="Palmeraie">Palmeraie</option>
            <option value="Sidi Youssef">Sidi Youssef</option>
            <option value="Ménara">Ménara</option>
            <option value="Agdal">Agdal</option>
            <option value="Targa">Targa</option>
            <option value="Massira">Massira</option>
            <option value="Daoudiate">Daoudiate</option>
            <option value="Semlalia">Semlalia</option>
            <option value="Majorelle">Majorelle</option>
            <option value="Médina">Médina</option>
            <option value="Noria">Noria</option>
            <option value="Prestigia">Prestigia</option>
          </select>
        </div>

        <div className="filter-field2">
          <input
            type="text"
            placeholder="Recherche avancée"
            aria-label="Recherche avancée"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-buttons2">
          <button type="button" className="plus-btn2" aria-label="Ajouter un critère">
            <FaPlus />
          </button>
          <button type="submit" className="search-btn2" aria-label="Rechercher">
            <FaSearch />
          </button>
        </div>
      </form>

      <div className="info-bar2">
        <div className="annonces-info2">
          <span className="annonces-count2">{annoncesCount !== null ? annoncesCount : '--'}</span>
          <span>ANNONCES{ville ? `: ${ville.toUpperCase()}` : ''}</span>
          <a href="#create-alert" className="create-alert-link2">
            <FaBell size={12} /> Créer une alerte
          </a>
        </div>

        {/* ICI, ON REMPLACE L'ANCIEN <select> PAR NOTRE NOUVEAU COMPOSANT.
          On lui passe les options, la valeur sélectionnée (tri) et la fonction pour la changer (setTri).
        */}
        <div className="sort-by2">
          <CustomSortDropdown 
            options={sortOptions}
            selectedValue={tri}
            onChange={setTri}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterSection2;