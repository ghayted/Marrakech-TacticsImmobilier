import React, { useEffect, useState } from 'react';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';
import ReservationCard from '../components/MesReservation/ReservationCard';
import ConfirmationModal from '../components/MesReservation/ConfirmationModal';
import './MesReservations.css';

const MesReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [reservationToCancel, setReservationToCancel] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError('');
      try {
        // Récupérer toutes les réservations (accès public)
        const reservationsResponse = await fetch(`https://api.immotactics.live/api/Reservations`);
        if (!reservationsResponse.ok) throw new Error('Erreur lors de la récupération des réservations');
        
        const baseReservations = await reservationsResponse.json();

        if (baseReservations.length === 0) {
          setReservations([]);
          return;
        }

        // Pour chaque réservation, récupérer les détails du bien
        const detailFetchPromises = baseReservations.map(res =>
          fetch(`https://api.immotactics.live/api/BiensImmobiliers/${res.bienImmobilierId}`)
            .then(response => response.json())
        );

        // Lancer tous les appels en parallèle et attendre qu'ils soient tous terminés
        const propertiesDetails = await Promise.all(detailFetchPromises);

        // Combiner les données des réservations avec les détails des biens
        const enrichedReservations = baseReservations.map((reservation, index) => {
          const details = propertiesDetails[index];
          return {
            ...reservation, // Garde les infos de la réservation (id, dates, statut, titreBien...)
            // Ajoute les infos manquantes depuis le 2ème appel
            ville: details.ville,
            imagesBiens: details.imagesBiens // 👈 On ajoute le tableau d'images complet
          };
        });

        // Mettre à jour l'état avec les données complètes
        enrichedReservations.sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut));
        setReservations(enrichedReservations);

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  // Le reste du composant (handleCancel, JSX, etc.) ne change pas.
  
  const handleOpenCancelModal = (reservation) => {
    setReservationToCancel(reservation);
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!reservationToCancel) return;

    try {
      const response = await fetch(`https://api.immotactics.live/api/Reservations/${reservationToCancel.id}/annuler`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });   

      if (response.ok) {
        // Recharger les réservations pour mettre à jour l'affichage
        window.location.reload();
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Erreur lors de l\'annulation de la réservation');
      }
    } catch (err) {
      setError('Erreur lors de l\'annulation de la réservation');
    } finally {
      setShowCancelModal(false);
      setReservationToCancel(null);
    }
  };
  
  const today = new Date();
  const upcomingReservations = reservations.filter(res => new Date(res.dateDebut) >= today && res.statut === 'Confirmée');
  const pastReservations = reservations.filter(res => new Date(res.dateDebut) < today || res.statut !== 'Confirmée');
  return (
    <div className="mes-reservations-page">
      <Header />
      <div className="page-container">
        <h1>Mes Réservations</h1>

        {loading && <div className="loader">Chargement de vos réservations...</div>}
        {error && <div className="error-message">{error}</div>}
        {!loading && !error && reservations.length === 0 && (
          <div className="no-reservation">Vous n'avez aucune réservation pour le moment.</div>
        )}

        {!loading && !error && reservations.length > 0 && (
          <>
            {upcomingReservations.length > 0 && (
              <section className="reservations-section">
                <h2>À venir</h2>
                {console.log("Données reçues pour la carte de réservation:", upcomingReservations)}
                <div className="reservations-list">
                  {upcomingReservations.map(res => (
                    <ReservationCard 
                      key={res.id} 
                      reservation={res} 
                      onCancel={() => handleOpenCancelModal(res)} 
                    />
                  ))}
                </div>
              </section>
            )}
            {pastReservations.length > 0 && (
              <section className="reservations-section">
                <h2>Passées et annulées</h2>
                <div className="reservations-list">
                  {pastReservations.map(res => (
                    <ReservationCard key={res.id} reservation={res} /> 
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {showCancelModal && (
        <ConfirmationModal
          message="Êtes-vous sûr de vouloir annuler cette réservation ?"
          reservation={reservationToCancel}
          onConfirm={handleConfirmCancel}
          onCancel={() => setShowCancelModal(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default MesReservations;