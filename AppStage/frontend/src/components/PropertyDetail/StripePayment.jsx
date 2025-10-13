import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePayment.css'; // On va utiliser ce nouveau CSS

const StripePayment = ({ amount, currency = 'eur', onSuccess, onError, customerInfo, reservationData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'paypal', etc.
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('FR'); // 'FR' pour France par défaut

  // Votre logique handleSubmit reste très similaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setMessage('');
    
    // On ne traite que le paiement par carte pour l'instant
    if (paymentMethod === 'card') {
      try {
        const token = localStorage.getItem('authToken');
        const response = await fetch('https://api.immotactics.live/api/Payments/create-payment-intent', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: Math.round(amount * 100),
            currency: currency,
            customerEmail: customerInfo.email,
          }),
        });

        if (!response.ok) throw new Error('Erreur serveur lors de la création du paiement');

        const { clientSecret } = await response.json();
        const cardElement = elements.getElement(CardElement);
        
        const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${customerInfo.prenom} ${customerInfo.nom}`,
              email: customerInfo.email,
              phone: customerInfo.telephone,
              address: {
                  postal_code: postalCode,
                  country: country,
              }
            },
          },
        });

        if (error) {
          setMessage(`Erreur: ${error.message}`);
          if (onError) onError(error);
        } else if (paymentIntent.status === 'succeeded') {
          setMessage('✅ Paiement Stripe réussi !');
          onSuccess(paymentIntent);
        }
      } catch (err) {
        setMessage(`Erreur: ${err.message}`);
        if (onError) onError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        '::placeholder': { color: '#aab7c4' },
      },
      invalid: { color: '#fa755a', iconColor: '#fa755a' },
    },
    // On affiche maintenant le code postal dans un champ séparé
    hidePostalCode: true, 
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-payment-form">
      {/* --- Section Carte de crédit --- */}
      <div className="payment-method-header">
        <h4>Carte de crédit ou de débit</h4>
        <div className="card-logos">
          <span>VISA</span> <span>MasterCard</span> <span>AMEX</span>
        </div>
      </div>
      
      <div className="card-input-container">
        <label>Numéro de carte</label>
        <CardElement options={cardElementOptions} className="StripeElement" />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="postalCode">Code postal</label>
          <input 
            id="postalCode" 
            name="postalCode" 
            type="text" 
            placeholder="Code postal" 
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className="stripe-input"
          />
        </div>
        <div className="form-group">
          <label htmlFor="country">Pays/Région</label>
          <select 
            id="country" 
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className="stripe-input"
          >
            <option value="FR">France</option>
            <option value="MA">Maroc</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
          </select>
        </div>
      </div>
      
      {/* --- Autres méthodes de paiement (visuelles pour l'instant) --- */}
      <div className="other-payment-options">
        <div className="payment-option">
          <input type="radio" id="paypal" name="paymentMethod" value="paypal" disabled />
          <label htmlFor="paypal">PayPal</label>
        </div>
        <div className="payment-option">
          <input type="radio" id="gpay" name="paymentMethod" value="gpay" disabled />
          <label htmlFor="gpay">Google Pay</label>
        </div>
      </div>

      {message && <div className={`payment-message ${message.includes('✅') ? 'success' : 'error'}`}>{message}</div>}
      
      <button type="submit" disabled={!stripe || loading} className="pay-button">
        {loading ? 'Traitement...' : 'Confirmer'}
      </button>
    </form>
  );
};

export default StripePayment;