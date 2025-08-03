import React, { useState } from 'react';
import './ReservationModal.css';
import { FaTimes, FaCalendarAlt, FaUsers } from 'react-icons/fa';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import StripePayment from './StripePayment';

// Initialiser Stripe avec votre clé publique
const stripePromise = loadStripe('pk_test_51RW28ZPNEpqAWzT7eCsUilQuStwuC1prDFJrpnsHLtOGCnZff84op1KxaukE48ILVMl4RlYjL2tvHFTuKxr7YyN800kTuYHpZe');

const ReservationModal = ({ isOpen, onClose, property }) => {
  const [formData, setFormData] = useState({
    dateDebut: '',
    dateFin: '',
    nombreDeVoyageurs: 1,
    // Données utilisateur
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [availability, setAvailability] = useState(null);
  const [prixTotal, setPrixTotal] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [reservationId, setReservationId] = useState(null);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset availability when dates change
    if (name === 'dateDebut' || name === 'dateFin') {
      setAvailability(null);
      setPrixTotal(0);
    }
  };

  const checkAvailability = async () => {
    if (!formData.dateDebut || !formData.dateFin) {
      setMessage('Veuillez sélectionner les dates de début et de fin');
      return;
    }

    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      setMessage('La date de fin doit être postérieure à la date de début');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:5257/api/Disponibilites/verifier?bienImmobilierId=${property.id}&dateDebut=${formData.dateDebut}&dateFin=${formData.dateFin}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAvailability(data);
        
        if (data.estDisponible) {
          // Get total price
          const priceResponse = await fetch(`http://localhost:5257/api/Disponibilites/prix?bienImmobilierId=${property.id}&dateDebut=${formData.dateDebut}&dateFin=${formData.dateFin}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (priceResponse.ok) {
            const priceData = await priceResponse.json();
            setPrixTotal(priceData.prixTotal || 0);
          }
        }
      } else {
        setMessage('Erreur lors de la vérification de disponibilité');
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!availability || !availability.estDisponible) {
      setMessage('Veuillez vérifier la disponibilité avant de réserver');
      return;
    }

    // Validation des champs utilisateur
    if (!formData.email || !formData.prenom || !formData.nom) {
      setMessage('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      
      // 1. Créer ou trouver l'utilisateur
      const userResponse = await fetch('http://localhost:5257/api/Auth/create-or-find-user', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          prenom: formData.prenom,
          nom: formData.nom,
          telephone: formData.telephone
        })
      });

      if (!userResponse.ok) {
        throw new Error('Erreur lors de la création de l\'utilisateur');
      }

      const userData = await userResponse.json();
      const userId = userData.userId;

      // 2. Créer la réservation
      const reservationResponse = await fetch('http://localhost:5257/api/Reservations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bienImmobilierId: property.id,
          utilisateurId: userId,
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
          nombreDeVoyageurs: parseInt(formData.nombreDeVoyageurs)
        })
      });

      if (reservationResponse.ok) {
        const reservationData = await reservationResponse.json();
        setReservationId(reservationData.id);
        setMessage('✅ Réservation créée ! Procédez maintenant au paiement.');
        
        // Afficher le composant de paiement
        setShowPayment(true);
      } else {
        const errorData = await reservationResponse.json();
        setMessage(`❌ Erreur: ${errorData.message || 'Impossible de créer la réservation'}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('❌ Erreur de connexion au serveur');
    } finally {
      setLoading(false);
    }
  };

  const calculateNights = () => {
    if (formData.dateDebut && formData.dateFin) {
      const start = new Date(formData.dateDebut);
      const end = new Date(formData.dateFin);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  // Gestionnaire de paiement réussi
  const handlePaymentSuccess = (paymentIntent) => {
    setMessage('🎉 Paiement réussi ! Votre réservation est confirmée.');
    setTimeout(() => {
      // Reset tout et fermer
      setFormData({
        dateDebut: '',
        dateFin: '',
        nombreDeVoyageurs: 1,
        nom: '',
        prenom: '',
        email: '',
        telephone: ''
      });
      setAvailability(null);
      setPrixTotal(0);
      setShowPayment(false);
      setReservationId(null);
      onClose();
    }, 3000);
  };

  // Gestionnaire d'erreur de paiement
  const handlePaymentError = (error) => {
    setMessage(`❌ Erreur de paiement: ${error.message}`);
    // Ne pas fermer le modal, laisser l'utilisateur réessayer
  };

  return (
    <div className="reservation-modal-overlay" onClick={onClose}>
      <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reservation-modal-header">
          <h2>Réserver cette propriété</h2>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="reservation-modal-body">
          <div className="property-summary">
            <h3>{property.titre}</h3>
            <p>{property.ville}, {property.quartier}</p>
            <p className="property-price">{property.prix?.toLocaleString('fr-FR')} EUR</p>
          </div>

          <form onSubmit={handleSubmit} className="reservation-form">
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Date d'arrivée
                </label>
                <input
                  type="date"
                  name="dateDebut"
                  value={formData.dateDebut}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="form-group">
                <label>
                  <FaCalendarAlt /> Date de départ
                </label>
                <input
                  type="date"
                  name="dateFin"
                  value={formData.dateFin}
                  onChange={handleChange}
                  min={formData.dateDebut || new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>
                <FaUsers /> Nombre de voyageurs
              </label>
              <select
                name="nombreDeVoyageurs"
                value={formData.nombreDeVoyageurs}
                onChange={handleChange}
                required
              >
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'voyageur' : 'voyageurs'}
                  </option>
                ))}
              </select>
            </div>

            {/* Section informations utilisateur */}
            <div className="user-info-section">
              <h4>📝 Vos informations</h4>
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    name="prenom"
                    value={formData.prenom}
                    onChange={handleChange}
                    placeholder="Votre prénom"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    name="nom"
                    value={formData.nom}
                    onChange={handleChange}
                    placeholder="Votre nom"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="votre@email.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={formData.telephone}
                    onChange={handleChange}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>
              </div>
            </div>

            <button 
              type="button" 
              className="check-availability-btn" 
              onClick={checkAvailability}
              disabled={loading || !formData.dateDebut || !formData.dateFin}
            >
              {loading ? 'Vérification...' : 'Vérifier la disponibilité'}
            </button>

            {availability && (
              <div className={`availability-result ${availability.estDisponible ? 'available' : 'unavailable'}`}>
                {availability.estDisponible ? (
                  <div>
                    <p>✅ Disponible pour {calculateNights()} nuit(s)</p>
                    {prixTotal > 0 && (
                      <p className="total-price">
                        Prix total: <strong>{prixTotal.toLocaleString('fr-FR')} EUR</strong>
                      </p>
                    )}
                  </div>
                ) : (
                  <p>❌ {availability.message || 'Non disponible pour ces dates'}</p>
                )}
              </div>
            )}

            {availability && availability.estDisponible && (
              <button 
                type="submit" 
                className="reserve-btn"
                disabled={loading}
              >
                {loading ? 'Réservation...' : 'Confirmer la réservation'}
              </button>
            )}

            {message && (
              <div className={`message ${message.includes('✅') || message.includes('🎉') ? 'success' : 'error'}`}>
                {message}
              </div>
            )}
          </form>

          {/* Composant de paiement Stripe */}
          {showPayment && prixTotal > 0 && (
            <Elements stripe={stripePromise}>
              <StripePayment
                amount={prixTotal}
                currency="eur"
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
                customerInfo={{
                  email: formData.email,
                  prenom: formData.prenom,
                  nom: formData.nom,
                  telephone: formData.telephone
                }}
                reservationData={{
                  reservationId: reservationId,
                  propertyId: property.id,
                  propertyTitle: property.titre,
                  dates: {
                    dateDebut: formData.dateDebut,
                    dateFin: formData.dateFin
                  },
                  guests: formData.nombreDeVoyageurs
                }}
              />
            </Elements>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;