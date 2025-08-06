import React, { useState, useEffect } from 'react';
// On importe les icônes nécessaires. FaBars n'est plus utilisé directement ici.
import { FaPlus, FaSearch, FaBell, FaCalendarAlt } from 'react-icons/fa'; 
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
  handleFilter,
  // Nouveaux props pour le calendrier
  isLouerMode = false,
  onDateSearch,
  selectedDates
}) => {

  const [showCalendar, setShowCalendar] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempSelectedDates, setTempSelectedDates] = useState(() => {
    // Si selectedDates est un tableau avec 2 dates, l'utiliser
    if (selectedDates && selectedDates.length === 2) {
      return selectedDates;
    }
    return [];
  });

  // Synchroniser tempSelectedDates avec selectedDates
  useEffect(() => {
    if (selectedDates && selectedDates.length === 2) {
      setTempSelectedDates(selectedDates);
    }
  }, [selectedDates]);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const daysOfWeek = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Ajouter les jours du mois précédent
    for (let i = startingDay - 1; i >= 0; i--) {
      const prevMonth = new Date(year, month - 1, 0);
      const day = prevMonth.getDate() - i;
      days.push({
        date: new Date(year, month - 1, day),
        isCurrentMonth: false,
        isGrey: true
      });
    }
    
    // Ajouter les jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
        isGrey: false
      });
    }
    
    // Ajouter les jours du mois suivant
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isGrey: true
      });
    }
    
    return days;
  };

  const handleDateClick = (date) => {
    if (date.isGrey) return;
    
    const dateStr = date.date.toISOString().split('T')[0];
    
    if (tempSelectedDates.length === 0) {
      // Première sélection
      setTempSelectedDates([dateStr]);
    } else if (tempSelectedDates.length === 1) {
      // Deuxième sélection - créer une plage
      const firstDate = tempSelectedDates[0];
      if (dateStr < firstDate) {
        setTempSelectedDates([dateStr, firstDate]);
      } else {
        setTempSelectedDates([firstDate, dateStr]);
      }
    } else {
      // Si on a déjà 2 dates, recommencer avec la nouvelle date
      setTempSelectedDates([dateStr]);
    }
  };

  const isDateSelected = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return tempSelectedDates.includes(dateStr);
  };

  const isDateInRange = (date) => {
    if (tempSelectedDates.length !== 2) return false;
    const dateStr = date.date.toISOString().split('T')[0];
    return dateStr >= tempSelectedDates[0] && dateStr <= tempSelectedDates[1];
  };

  const isFirstDate = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return tempSelectedDates[0] === dateStr;
  };

  const isLastDate = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return tempSelectedDates[1] === dateStr;
  };

  const handleCalendarApply = () => {
    if (tempSelectedDates.length === 2) {
      // S'assurer que les dates sont au bon format (YYYY-MM-DD)
      const dateDebut = new Date(tempSelectedDates[0]).toISOString().split('T')[0];
      const dateFin = new Date(tempSelectedDates[1]).toISOString().split('T')[0];
      
      console.log('🔍 [BienListFilter] Dates sélectionnées:', { dateDebut, dateFin });
      
      onDateSearch({
        dateDebut: dateDebut,
        dateFin: dateFin,
        nombreVoyageurs: 1
      });
      setShowCalendar(false);
    }
  };

  const handleCalendarCancel = () => {
    // Remettre les dates sélectionnées ou vider si aucune
    if (selectedDates && selectedDates.length === 2) {
      setTempSelectedDates(selectedDates);
    } else {
      setTempSelectedDates([]);
    }
    setShowCalendar(false);
  };

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

  const days = getDaysInMonth(currentMonth);

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

        {/* Icône calendrier - visible seulement en mode location */}
        {isLouerMode && (
          <div className="filter-field2 calendar-field">
            <button 
              type="button" 
              className="calendar-btn"
              onClick={() => setShowCalendar(!showCalendar)}
              title="Sélectionner les dates"
            >
              <FaCalendarAlt />
              {tempSelectedDates.length === 2 && (
                <span className="date-preview">
                  {new Date(tempSelectedDates[0]).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'})} - {new Date(tempSelectedDates[1]).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'})}
                </span>
              )}
            </button>
          </div>
        )}

        <div className="filter-buttons2">
          <button type="button" className="plus-btn2" aria-label="Ajouter un critère">
            <FaPlus />
          </button>
          <button type="submit" className="search-btn2" aria-label="Rechercher">
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Calendrier modal */}
      {showCalendar && (
        <div className="calendar-overlay" onClick={(e) => {
          if (e.target.className === 'calendar-overlay') {
            setShowCalendar(false);
          }
        }}>
          <div className="calendar">
            <div className="calendar__opts">
              <select 
                value={months[currentMonth.getMonth()]}
                onChange={(e) => {
                  const monthIndex = months.indexOf(e.target.value);
                  const newDate = new Date(currentMonth);
                  newDate.setMonth(monthIndex);
                  setCurrentMonth(newDate);
                }}
              >
                {months.map((month, index) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              <select 
                value={currentMonth.getFullYear()}
                onChange={(e) => {
                  const newDate = new Date(currentMonth);
                  newDate.setFullYear(parseInt(e.target.value));
                  setCurrentMonth(newDate);
                }}
              >
                {Array.from({length: 10}, (_, i) => new Date().getFullYear() + i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div className="calendar__body">
              <div className="calendar__days">
                {daysOfWeek.map(day => (
                  <div key={day}>{day}</div>
                ))}
              </div>

              <div className="calendar__dates">
                {days.map((day, index) => (
                  <div
                    key={index}
                    className={`calendar__date ${
                      day.isGrey ? 'calendar__date--grey' : ''
                    } ${
                      isDateSelected(day) ? 'calendar__date--selected' : ''
                    } ${
                      isDateInRange(day) ? 'calendar__date--in-range' : ''
                    } ${
                      isFirstDate(day) ? 'calendar__date--first-date' : ''
                    } ${
                      isLastDate(day) ? 'calendar__date--last-date' : ''
                    }`}
                    onClick={() => handleDateClick(day)}
                  >
                    <span>{day.date.getDate()}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="calendar__buttons">
              <button 
                type="button" 
                className="calendar__button calendar__button--grey"
                onClick={handleCalendarCancel}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="calendar__button calendar__button--primary"
                onClick={handleCalendarApply}
                disabled={tempSelectedDates.length !== 2}
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}

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