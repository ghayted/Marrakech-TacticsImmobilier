import React, { useState, useEffect } from 'react';
import PropertyCard from '../PropertyCard/PropertyCard'; // On importe la carte qu'on vient de créer
import './SimilarProperties.css';

const SimilarProperties = ({ currentPropertyId, propertyStatus, propertyType }) => {
    const [properties, setProperties] = useState([]);
  
    useEffect(() => {
      // --- CODE DE DÉBOGAGE ---
      console.clear(); // Nettoie la console à chaque rechargement
      console.log("🕵️‍♂️ LANCEMENT DE LA RECHERCHE DE BIENS SIMILAIRES 🕵️‍♂️");
      console.log("Critères reçus:", {
        currentPropertyId,
        propertyStatus, // Le statut qu'on cherche
        propertyType,   // Le type qu'on cherche
      });
      // --- FIN DU CODE DE DÉBOGAGE ---
  
      if (!currentPropertyId) return;
  
      const fetchSimilar = async () => {
        try {
          const response = await fetch(`http://144.24.30.248:5257/api/BiensImmobiliers`);
          if (!response.ok) return;
          
          const allProperties = await response.json();
  
          // --- CODE DE DÉBOGAGE ---
          console.log("Propriétés reçues de l'API:", allProperties);
          // --- FIN DU CODE DE DÉBOGAGE ---
  
          // Plan A : On cherche des biens du MÊME TYPE et MÊME STATUT
          console.log("--- Plan A: Filtrage strict (Type ET Statut) ---");
          let similarItems = allProperties.filter(p => {
            
            // --- CODE DE DÉBOGAGE DÉTAILLÉ ---
            const isSameStatus = p.statutTransaction === propertyStatus;
            const isSameType = p.typeDeBien === propertyType;
            const isNotCurrent = p.id !== currentPropertyId;
  
            console.log(
              `Bien ID ${p.id}:`,
              `Statut ('${p.statutTransaction}' === '${propertyStatus}') -> ${isSameStatus}`,
              `| Type ('${p.typeDeBien}' === '${propertyType}') -> ${isSameType}`
            );
            // --- FIN DU CODE DE DÉBOGAGE DÉTAILLÉ ---
  
            return isSameStatus && isSameType && isNotCurrent;
          });
          
          console.log("Résultat du Plan A:", similarItems);
  
          if (similarItems.length === 0) {
             // ... (le reste de la logique Plan B et C)
          }
          
          const finalResults = similarItems.slice(0, 2);
          setProperties(finalResults);
  
        } catch (error) {
          console.error("Erreur:", error);
        }
      };
  
      fetchSimilar();
    }, [currentPropertyId, propertyStatus, propertyType]);
  
    if (properties.length === 0) {
      return null;
    }
  
    // Le JSX reste le même
    return (
      <section className="similar-properties-section">
        <h2 className="similar-title">Vous pourriez aimer aussi</h2>
        <div className="properties-grid">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <div className="discover-more-container">
          <button className="discover-more-btn">Découvrir nos offres</button>
        </div>
      </section>
    );
  };
  
  export default SimilarProperties;