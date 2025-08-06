import React, { useState, useEffect } from 'react';
import { FaCalendarAlt, FaSearch, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './DateSelectionBar.css';

const DateSelectionBar = ({ onDateSearch, isVisible }) => {
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [nombreVoyageurs, setNombreVoyageurs] = useState(1);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);

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
    const remainingDays = 42 - days.length; // 6 semaines * 7 jours
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
    
    if (selectedDates.length === 0) {
      setSelectedDates([dateStr]);
      setDateDebut(dateStr);
    } else if (selectedDates.length === 1) {
      const firstDate = selectedDates[0];
      if (dateStr < firstDate) {
        setSelectedDates([dateStr, firstDate]);
        setDateDebut(dateStr);
        setDateFin(firstDate);
      } else {
        setSelectedDates([firstDate, dateStr]);
        setDateDebut(firstDate);
        setDateFin(dateStr);
      }
    } else {
      setSelectedDates([dateStr]);
      setDateDebut(dateStr);
      setDateFin('');
    }
  };

  const isDateSelected = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return selectedDates.includes(dateStr);
  };

  const isDateInRange = (date) => {
    if (selectedDates.length !== 2) return false;
    const dateStr = date.date.toISOString().split('T')[0];
    return dateStr >= selectedDates[0] && dateStr <= selectedDates[1];
  };

  const isFirstDate = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return selectedDates[0] === dateStr;
  };

  const isLastDate = (date) => {
    const dateStr = date.date.toISOString().split('T')[0];
    return selectedDates[1] === dateStr;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dateDebut && dateFin) {
      onDateSearch({
        dateDebut,
        dateFin,
        nombreVoyageurs: parseInt(nombreVoyageurs)
      });
      setShowCalendar(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth);
    if (direction === 'next') {
      newMonth.setMonth(newMonth.getMonth() + 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() - 1);
    }
    setCurrentMonth(newMonth);
  };

  if (!isVisible) return null;

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="date-selection-bar">
      <div className="date-selection-container">
        <h3 className="date-selection-title">
          <FaCalendarAlt /> Sélectionnez vos dates de séjour
        </h3>
        
        <form className="date-selection-form" onSubmit={handleSubmit}>
          <div className="date-inputs">
            <div className="date-input-group">
              <label>Date d'arrivée</label>
              <div className="date-display" onClick={() => setShowCalendar(!showCalendar)}>
                {dateDebut ? new Date(dateDebut).toLocaleDateString('fr-FR') : 'Sélectionner'}
                <FaCalendarAlt />
              </div>
            </div>

            <div className="date-input-group">
              <label>Date de départ</label>
              <div className="date-display" onClick={() => setShowCalendar(!showCalendar)}>
                {dateFin ? new Date(dateFin).toLocaleDateString('fr-FR') : 'Sélectionner'}
                <FaCalendarAlt />
              </div>
            </div>

            <div className="date-input-group">
              <label htmlFor="nombreVoyageurs">Nombre de voyageurs</label>
              <select
                id="nombreVoyageurs"
                value={nombreVoyageurs}
                onChange={(e) => setNombreVoyageurs(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                  <option key={num} value={num}>
                    {num} {num === 1 ? 'personne' : 'personnes'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {showCalendar && (
            <div className="calendar-overlay">
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
                    onClick={() => setShowCalendar(false)}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className="calendar__button calendar__button--primary"
                    disabled={!dateDebut || !dateFin}
                  >
                    Appliquer
                  </button>
                </div>
              </div>
            </div>
          )}

          <button type="submit" className="search-dates-btn" disabled={!dateDebut || !dateFin}>
            <FaSearch /> Rechercher les biens disponibles
          </button>
        </form>
      </div>
    </div>
  );
};

export default DateSelectionBar; 