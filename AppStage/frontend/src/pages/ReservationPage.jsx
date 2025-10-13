import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { FaArrowLeft, FaCalendarAlt, FaUsers, FaCreditCard, FaShieldAlt, FaCheck, FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from '../components/PropertyDetail/StripePayment';
import Header from '../components/Home/Header';
import Footer from '../components/Home/Footer';
import ClientLoginModal from '../components/Auth/ClientLoginModal';
import CancellationPolicyModal from '../components/PropertyDetail/CancellationPolicyModal';
import './ReservationPage.css';

// Initialisation de Stripe avec votre clé publique
const stripePromise = loadStripe('pk_test_51RW28ZPNEpqAWzT7eCsUilQuStwuC1prDFJrpnsHLtOGCnZff84op1KxaukE48ILVMl4RlYjL2tvHFTuKxr7YyN800kTuYHpZe');

const ReservationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCancellationModal, setShowCancellationModal] = useState(false);
  // Récupérer les paramètres de l'URL
  const searchParams = new URLSearchParams(location.search);
  const urlDateDebut = searchParams.get('dateDebut');
  const urlDateFin = searchParams.get('dateFin');
  const urlNombreVoyageurs = searchParams.get('nombreVoyageurs');

  console.log('🔍 [ReservationPage] URL complète:', location.pathname + location.search);
  console.log('🔍 [ReservationPage] Paramètres URL:', { urlDateDebut, urlDateFin, urlNombreVoyageurs });

  const [reservationData, setReservationData] = useState(() => {
    const initialData = {
      dateDebut: urlDateDebut || '',
      dateFin: urlDateFin || '',
      nombreVoyageurs: urlNombreVoyageurs ? parseInt(urlNombreVoyageurs) : 1,
      prixTotal: 0,
      nombreNuits: urlDateDebut && urlDateFin ? 
        Math.ceil((new Date(urlDateFin) - new Date(urlDateDebut)) / (1000 * 60 * 60 * 24)) : 0
    };
    console.log('🔍 [ReservationPage] Données initiales:', initialData);
    return initialData;
  });
  const [reservationForm, setReservationForm] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    // Récupérer les données de la propriété
    const fetchProperty = async () => {
      try {
        const response = await fetch(`https://api.immotactics.live/api/BiensImmobiliers/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProperty(data);
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };

    // Récupérer les données utilisateur
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setUserData(user);
      // Pré-remplir le formulaire avec les données utilisateur
      setReservationForm(prev => ({
        ...prev,
        nom: user.nom || '',
        prenom: user.prenom || '',
        email: user.email || '',
        telephone: user.telephone || ''
      }));
    }

    // Les dates sont déjà initialisées dans l'état initial de reservationData

    fetchProperty();
  }, [id, location.search]);

  // Calculer le prix total quand la propriété est chargée
  useEffect(() => {
    if (property && reservationData.nombreNuits > 0) {
      const prixTotal = reservationData.nombreNuits * property.prixParNuit;
      setReservationData(prev => ({
        ...prev,
        prixTotal
      }));
    }
    
    // Debug pour l'image
    if (property) {
      console.log('🔍 [ReservationPage] Propriété chargée:', {
        titre: property.titre,
        imagesBiens: property.imagesBiens,
        hasImages: property.imagesBiens?.length > 0,
        firstImage: property.imagesBiens?.[0]?.urlImage,
        mainImage: property.imagesBiens?.find(img => img.estImagePrincipale)?.urlImage
      });
    }
  }, [property, reservationData.nombreNuits]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setReservationForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLoginSuccess = (user) => {
    setUserData(user);
    setShowLoginModal(false);
    // Pré-remplir le formulaire avec les données utilisateur
    setReservationForm(prev => ({
      ...prev,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || ''
    }));
  };

  const handleRegisterSuccess = (user) => {
    setUserData(user);
    setShowLoginModal(false);
    // Pré-remplir le formulaire avec les données utilisateur
    setReservationForm(prev => ({
      ...prev,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || ''
    }));
  };

  const handlePaymentSuccess = async (paymentIntent) => {
    setSubmitting(true);
    setStatusMessage('Création de votre réservation...');

    try {
      // 1. Créer la réservation
      const reservationResponse = await fetch('https://api.immotactics.live/api/Reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          bienImmobilierId: parseInt(id),
          utilisateurId: userData.id,
          dateDebut: reservationData.dateDebut,
          dateFin: reservationData.dateFin,
          nombreDeVoyageurs: reservationData.nombreVoyageurs,
          prixTotal: reservationData.prixTotal,
          statut: 'Confirmée',
          message: reservationForm.message || `Réservation pour ${reservationData.nombreVoyageurs} voyageur(s) du ${reservationData.dateDebut} au ${reservationData.dateFin}`
        })
      });

      if (reservationResponse.ok) {
        const reservationResult = await reservationResponse.json();
        
        // 2. Créer le paiement avec l'ID de réservation
        const paymentResponse = await fetch('https://api.immotactics.live/api/Payments/confirm-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: JSON.stringify({
            reservationId: reservationResult.id,
            amount: Math.round(reservationData.prixTotal * 100), // Montant en centimes
            paymentIntentId: paymentIntent.id
          })
        });

        if (paymentResponse.ok) {
          setStatusMessage('✅ Réservation et paiement réussis !');
          setTimeout(() => navigate('/biens'), 2000);
        } else {
          setStatusMessage('✅ Réservation créée mais erreur lors de l\'enregistrement du paiement');
        }
      } else {
        const errorData = await reservationResponse.json();
        setStatusMessage(`❌ Erreur: ${errorData.message || 'Erreur lors de la création de la réservation'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setStatusMessage('❌ Erreur: Impossible de contacter le serveur');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentError = (error) => {
    setStatusMessage(`❌ Erreur de paiement: ${error.message}`);
  };

  if (loading) {
    return (
      <div className="app-reservation-page reservation-loading">
        <div className="loading-spinner"></div>
        <p>Chargement de votre réservation...</p>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="app-reservation-page reservation-error">
        <h2>Propriété introuvable</h2>
        <button onClick={handleBack}>Retour</button>
      </div>
    );
  }

  const reduction = 0; // À remplacer par ta logique de réduction si besoin
  const dateLimiteAnnulation = reservationData.dateDebut
    ? new Date(new Date(reservationData.dateDebut).getTime() - 5 * 24 * 60 * 60 * 1000)
        .toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })
    : '';

  return (
    <div className="app-reservation-page">
      <Header />
      
      <div className="reservation-container">
        {/* Section gauche - Détails de réservation */}
        <div className="reservation-left">
          <div className="reservation-header">
            <button className="back-btn" onClick={handleBack}>
              <FaArrowLeft />
            </button>
            <h1>Demande de réservation</h1>
          </div>
          <div className="booking-details-card">

          {/* Section Voyage */}
          <div className="trip-section">
            <h2>Votre voyage</h2>
            <div className="trip-details">
              <div className="trip-item">
                <FaCalendarAlt />
                <span>
                  {reservationData.dateDebut && reservationData.dateFin ? (
                    <>
                      {new Date(reservationData.dateDebut).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })} - {new Date(reservationData.dateFin).toLocaleDateString('fr-FR', { 
                        day: 'numeric', 
                        month: 'short' 
                      })}
                    </>
                  ) : (
                    <span className="no-dates">Aucune date sélectionnée</span>
                  )}
                </span>
                <button className="modify-btn" onClick={() => navigate(`/property/${id}${location.search ? `?${location.search}` : ''}`)}>
                  {reservationData.dateDebut ? 'Modifier' : 'Sélectionner'}
                </button>
              </div>
              <div className="trip-item">
                <FaUsers />
                <span>{reservationData.nombreVoyageurs} voyageur{reservationData.nombreVoyageurs > 1 ? 's' : ''}</span>
                <button className="modify-btn" onClick={() => navigate(`/property/${id}${location.search ? `?${location.search}` : ''}`)}>
                  Modifier
                </button>
              </div>

            </div>
          </div>

          {/* Intégration Stripe */}
          <div className="payment-form-section">
            <h2>1. Ajoutez un mode de paiement</h2>
            {userData && reservationData.dateDebut ? (
              <Elements stripe={stripePromise}>
                                 <StripePayment
                   amount={reservationData.prixTotal}
                   currency="eur"
                   onSuccess={handlePaymentSuccess}
                   onError={handlePaymentError}
                   customerInfo={reservationForm}
                   reservationData={{
                     reservationId: null, // Sera généré après la création de la réservation
                     bienImmobilierId: parseInt(id),
                     utilisateurId: userData.id,
                     dateDebut: reservationData.dateDebut,
                     dateFin: reservationData.dateFin,
                     nombreVoyageurs: reservationData.nombreVoyageurs,
                     prixTotal: reservationData.prixTotal,
                     message: reservationForm.message
                   }}
                 />
              </Elements>
            ) : (
              <div className="login-prompt">
                <p>Veuillez vous connecter et sélectionner des dates pour payer.</p>
                {!userData && (
                  <button className="login-btn" onClick={() => setShowLoginModal(true)}>
                    <FaUser />
                    Se connecter
                  </button>
                )}
              </div>
            )}
            </div>
          </div>
        </div>

                 {/* Section droite - Résumé de réservation fusionné */}
         <div className="reservation-right">
           <div className="reservation-summary-card">
             {/* Image et infos propriété */}
             <div className="property-summary">
               <div className="property-image">
                 <img
                   src={property.imagesBiens && property.imagesBiens.length > 0 ?
                     property.imagesBiens.find(img => img.estImagePrincipale)?.urlImage ||
                     property.imagesBiens[0]?.urlImage :
                     '/placeholder-property.jpg'
                   }
                   alt={property.titre}
                   onError={(e) => {
                     e.target.src = '/placeholder-property.jpg';
                   }}
                 />
               </div>
               <div className="property-info">
                 <h3>{property.titre}</h3>
                 <div className="property-rating">
                </div>
                 <p className="property-type">{property.typeDeBien?.nom}</p>
                 <p className="property-location">{property.ville}, {property.quartier}</p>
               </div>
             </div>

             {/* Annulation gratuite */}
             <div className="cancellation-policy">
               <h4>Annulation gratuite</h4>
               <p>Annulez avant le {dateLimiteAnnulation} pour recevoir un remboursement intégral.</p>
               <a href="#" className="policy-link" onClick={e => { e.preventDefault(); setShowCancellationModal(true); }}>
                Consulter les conditions complètes
              </a>
             </div>

             {/* Bloc informations voyage */}
             <div className="trip-info-block">
               <div className="trip-info-header">
                 <span>Informations sur le voyage</span>
                 <button className="modify-btn" onClick={() => navigate(`/property/${id}${location.search ? `?${location.search}` : ''}`)}>Modifier</button>
               </div>
               <div>{reservationData.dateDebut && reservationData.dateFin ? `${new Date(reservationData.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – ${new Date(reservationData.dateFin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}` : 'Dates non sélectionnées'}</div>
               <div>{reservationData.nombreVoyageurs} {reservationData.nombreVoyageurs > 1 ? 'adultes' : 'adulte'}</div>
             </div>

             {/* Bloc détail du prix */}
             <div className="price-details-block">
               <h4>Détail du prix</h4>
               <div className="price-row">
                 <span>{reservationData.nombreNuits} nuits x {property.prixParNuit?.toLocaleString('fr-FR')} €</span>
                 <span>{(property.prixParNuit * reservationData.nombreNuits)?.toLocaleString('fr-FR')} €</span>
               </div>
               {reduction > 0 && (
                 <div className="price-row reduction">
                   <span>Réduction à la semaine</span>
                   <span>-{reduction.toLocaleString('fr-FR')} €</span>
                 </div>
               )}
               <div className="price-row total">
                 <span>Total EUR</span>
                 <span>{reservationData.prixTotal?.toLocaleString('fr-FR')} €</span>
               </div>
               <a href="#" className="price-details-link">Détail du prix</a>
             </div>
           </div>
         </div>
      </div>

      {/* Modal de connexion */}
      {showLoginModal && (
        <ClientLoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
        />
      )}

      {/* Modal d'annulation */}
      <CancellationPolicyModal isOpen={showCancellationModal} onClose={() => setShowCancellationModal(false)} dateDebut={reservationData.dateDebut} />

      <Footer />
    </div>
    
  );
};

export default ReservationPage;
