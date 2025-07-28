import React, { useState } from 'react';
import './ContactSidebar.css';
import { FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactSidebar = ({ property }) => {
  const [formData, setFormData] = useState({
    nom: '', // Ce champ contiendra le nom complet
    tel: '',
    email: '',
    message: `Bonjour, je souhaiterais plus d'informations sur le bien (Réf: ${property.id}). Pouvez-vous me recontacter à ce sujet ?`,
    consent: false,
  });
  
  const [statusMessage, setStatusMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Envoi en cours...');

    // --- 👇 LOGIQUE MISE À JOUR ICI 👇 ---

    // 1. On divise le nom complet en prénom et nom
    const nameParts = formData.nom.trim().split(' ');
    const prenom = nameParts[0] || ''; // Le premier mot est le prénom
    const nom = nameParts.slice(1).join(' ') || ''; // Le reste est le nom

    try {
      // 2. On envoie à la bonne URL de votre API principale
      const response = await fetch('http://localhost:5257/api/Contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // 3. On envoie le corps de la requête avec les bons champs
        body: JSON.stringify({
          nom: nom,
          prenom: prenom,
          email: formData.email,
          tel: formData.tel,
          message: formData.message,
        }),
      });

      if (response.ok) {
        // Si le serveur répond avec succès (status 200-299)
        setStatusMessage('✅ Message envoyé avec succès !');
        setFormData({
            nom: '', tel: '', email: '', message: '', consent: false
        });
      } else {
        // Si le serveur répond avec une erreur (status 400, 500, etc.)
        const errorResult = await response.json();
        setStatusMessage(`❌ Erreur: ${errorResult.message || 'Le serveur a rencontré un problème.'}`);
      }
    } catch (error) {
      console.error('Erreur de connexion au serveur:', error);
      setStatusMessage('❌ Erreur: Impossible de contacter le serveur.');
    }
  };

  return (
    <aside className="contact-sidebar-container">
      {/* ... Votre JSX reste identique ... */}
      <div className="agent-card">
         <img src="https://www.barnes-marrakech.com/images/photo_nobody.jpg" alt="Agent immobilier" className="agent-avatar" />
         <div className="agent-details">
           <h4>Marrakech Tactics</h4>
           <div><FaPhone className="agent-icon" /><FaEnvelope className="agent-icon" /></div>
         </div>
      </div>
      <button className="agent-properties-btn">PLUS DE PROPRIÉTÉS</button>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="nom" placeholder="Prénom & Nom *" value={formData.nom} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <input type="tel" name="tel" placeholder="Tél." value={formData.tel} onChange={handleChange} />
        </div>
        <div className="form-group">
          <input type="email" name="email" placeholder="Email *" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <textarea name="message" value={formData.message} onChange={handleChange} rows="5"></textarea>
        </div>
        <div className="form-group consent-group">
          <input type="checkbox" id="consent" name="consent" checked={formData.consent} onChange={handleChange} />
          <label htmlFor="consent">
            J'accepte que MARRAKECH TACTICS m'envoie par e-mail ses actualités...
          </label>
        </div>
        
        <button type="submit" className="submit-btn">Envoyer</button>
        
        {statusMessage && <p className="status-message">{statusMessage}</p>}
      </form>
    </aside>
  );
};

export default ContactSidebar;