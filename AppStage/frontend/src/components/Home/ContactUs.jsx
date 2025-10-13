// src/pages/ContactPage.jsx
import React, { useState } from 'react';
import './ContactUs.css';

// Icônes
const PhoneIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const MailIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;
const MapPinIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    tel: '',
    message: ''
  });
  const [confirmation, setConfirmation] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://api.immotactics.live/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setConfirmation("Merci pour votre message ! Votre demande a bien été envoyée à notre équipe. Nous vous répondrons dans les plus brefs délais. — L’équipe Marrakech Tactics");
        setFormData({ nom: '', prenom: '', email: '', tel: '', message: '' });
      } else {
        setConfirmation("Une erreur est survenue lors de l'envoi. Merci de réessayer plus tard.");
      }
    } catch (err) {
      setConfirmation("Erreur réseau ou serveur. Merci de réessayer plus tard.");
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        
        <div className="contact-info-block">
          <div className="contact-image-wrapper">
            <img src="https://www.barnes-marrakech.com/images/office.jpg" alt="Bureau de l'agence" />
          </div>
          <h3>Marrakech Tactics</h3>
          <div className="contact-details">
            <div className="contact-item"><PhoneIcon /><span>+212 524 433 200</span></div>
            <div className="contact-item"><MailIcon /><span>marrakechTactics@gmail.com</span></div>
            <div className="contact-item">
  <MapPinIcon />
  <span>AL Massar 597, deuxième étage, Marrakech, 40000 Maroc</span>
</div>
          </div>
          <h4>Horaire d'ouverture</h4>
          <div className="contact-hours">
            <p>09:00 - 18:30 Lundi - Vendredi</p>
            <p>09:00 - 13:00 Samedi</p>
          </div>
        </div>

        <div className="contact-form-block">
          <h2>Contactez-Nous</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><input type="text" name="nom" placeholder="Nom *" value={formData.nom} onChange={handleChange} required /></div>
              <div className="form-group"><input type="text" name="prenom" placeholder="Prénom *" value={formData.prenom} onChange={handleChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required /></div>
              <div className="form-group"><input type="tel" name="tel" placeholder="Tél." value={formData.tel} onChange={handleChange} /></div>
            </div>
            <div className="form-group">
              <textarea name="message" placeholder="Votre message" value={formData.message} onChange={handleChange} rows="6"></textarea>
            </div>
            <p className="required-notice">(*) Champs obligatoires</p>
         
            <button type="submit" className="btn-submit2">ENVOYER</button>
          </form>
          {confirmation && (
            <div className="contact-confirmation">
              {confirmation}
            </div>
          )}
        </div>

      </div>
    </section>
  );
}

export default ContactPage;