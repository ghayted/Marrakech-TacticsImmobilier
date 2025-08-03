import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import './StripePayment.css';

const StripePayment = ({ amount, currency = 'eur', onSuccess, onError, customerInfo, reservationData }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1. Créer l'intention de paiement côté backend
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:5257/api/Payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Stripe utilise les centimes
          currency: currency,
          customerEmail: customerInfo.email,
          customerName: `${customerInfo.prenom} ${customerInfo.nom}`,
          reservationData: reservationData
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement');
      }

      const { clientSecret } = await response.json();

      // 2. Confirmer le paiement avec Stripe
      const cardElement = elements.getElement(CardElement);
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${customerInfo.prenom} ${customerInfo.nom}`,
            email: customerInfo.email,
            phone: customerInfo.telephone,
          },
        },
      });

      if (error) {
        console.error('Erreur de paiement:', error);
        setMessage(`Erreur: ${error.message}`);
        onError(error);
      } else if (paymentIntent.status === 'succeeded') {
        // 3. Confirmer le paiement côté backend pour enregistrer en BDD
        try {
          const confirmResponse = await fetch('http://localhost:5257/api/Payments/confirm-payment', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              reservationId: reservationData.reservationId,
              amount: Math.round(amount * 100), // Montant en centimes
              paymentIntentId: paymentIntent.id
            }),
          });

          if (!confirmResponse.ok) {
            throw new Error('Erreur lors de la confirmation du paiement');
          }

          const confirmResult = await confirmResponse.json();
          console.log('Paiement confirmé:', confirmResult);
          
          setMessage('✅ Paiement réussi et facture générée !');
          onSuccess(paymentIntent);
        } catch (confirmError) {
          console.error('Erreur de confirmation:', confirmError);
          setMessage('⚠️ Paiement réussi mais erreur lors de l\'enregistrement. Contactez le support.');
          onError(confirmError);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(`Erreur: ${error.message}`);
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
        padding: '12px',
      },
      invalid: {
        color: '#9e2146',
      },
    },
    hidePostalCode: true, // Cacher le code postal si pas nécessaire
  };

  return (
    <div className="stripe-payment">
      <h4>💳 Paiement sécurisé</h4>
      <div className="payment-summary">
        <p><strong>Montant à payer: {amount.toLocaleString('fr-FR')} {currency.toUpperCase()}</strong></p>
      </div>
      
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="card-element-container">
          <label>Informations de carte</label>
          <CardElement options={cardElementOptions} className="card-element" />
        </div>
        
        <button 
          type="submit" 
          disabled={!stripe || loading} 
          className="pay-button"
        >
          {loading ? 'Traitement...' : `Payer ${amount.toLocaleString('fr-FR')} ${currency.toUpperCase()}`}
        </button>
        
        {message && (
          <div className={`payment-message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}
      </form>
      
      <div className="payment-security">
        <p>🔒 Paiement sécurisé par Stripe</p>
        <p>Vos données bancaires sont chiffrées et sécurisées</p>
      </div>
    </div>
  );
};

export default StripePayment;