# Besoins Fonctionnels et Non Fonctionnels

## **Besoins Fonctionnels**

### **1. Gestion des Biens Immobiliers**
- **Recherche et filtrage multi-critères** : par type de bien, ville, statut, prix, dates, nombre de voyageurs
- **Consultation de fiches détaillées** : médias (images), aménagements, localisation géographique
- **Gestion des propriétaires** : création, modification et suivi des propriétaires de biens
- **Gestion des types de biens** : catégorisation des biens (appartement, maison, etc.)

### **2. Système de Réservation**
- **Vérification de disponibilité** : consultation du calendrier et vérification des plages disponibles
- **Calcul dynamique des prix** : priorisation des tarifs spécifiques par date, calcul du prix total
- **Création de réservations** : blocage automatique des dates concernées
- **Gestion des statuts** : En attente de paiement, Confirmée, Annulée

### **3. Système de Paiement**
- **Paiement en ligne sécurisé** : intégration Stripe avec création et confirmation de PaymentIntent
- **Génération de factures PDF** : création automatique et mise à disposition des factures
- **Suivi des transactions** : enregistrement des paiements avec statuts (Réussi, Échoué, En attente)
- **Gestion des remboursements** : traitement des annulations avec remboursements automatiques

### **4. Authentification et Autorisation**
- **Authentification JWT** : pour les clients et administrateurs
- **Espaces dédiés** : 
  - **Client** : historique de réservations, gestion de profil
  - **Admin** : gestion des biens, des disponibilités, consultation d'indicateurs
- **Protection des routes** : sécurisation des zones administratives

### **5. Analytics et Suivi**
- **Suivi des vues** : taçage des visites du site et des biens
- **Agrégations mensuelles** r: statistiques de performance
- **Événements d'analytics** : enregistrement des actions utilisateurs

### **6. Gestion des Disponibilités**
- **Calendrier dynamique** : gestion des disponibilités par bien et par date
- **Prix spécifiques** : tarification différenciée selon les périodes
- **Vérification des chevauchements** : prévention des réservations conflictuelles

## **Besoins Non Fonctionnels**

### **1. Sécurité**
- **Sécurisation de l'API** : JWT, CORS maîtrisé en production
- **Protection des données** : hachage des mots de passe, validation des entrées
- **Sécurisation des paiements** : intégration Stripe sécurisée, gestion des secrets
- **Authentification robuste** : tokens JWT avec expiration, vérification des autorisations

### **2. Performance**
- **Requêtes optimisées** : filtrage et projections DTO pour réduire la charge
- **Performance raisonnable** : temps de réponse acceptable pour les opérations critiques
- **Gestion de la concurrence** : prévention des réservations simultanées sur les mêmes dates

### **3. Maintenabilité**
- **Architecture modulaire** : services métiers, contrôleurs fins
- **Séparation des responsabilités** : logique métier isolée dans les services
- **Code documenté** : commentaires et documentation technique
- **Tests unitaires** : couverture des services métiers critiques

### **4. Extensibilité**
- **Système de rôles** : support pour l'ajout de nouveaux rôles et permissions
- **Webhooks Stripe** : architecture prête pour l'extension des webhooks
- **Idempotence des paiements** : prévention des doublons de transactions
- **API RESTful** : design extensible pour de nouvelles fonctionnalités

### **5. Fiabilité**
- **Gestion d'erreurs** : traitement robuste des exceptions
- **Validation des données** : vérification des entrées utilisateur
- **Sauvegarde des données** : persistance fiable des informations critiques
- **Génération PDF fiable** : création et stockage sécurisé des factures

### **6. Utilisabilité**
- **Interface intuitive** : design moderne et responsive
- **Messages d'erreur clairs** : feedback utilisateur approprié
- **Parcours utilisateur fluide** : de la recherche à la réservation
- **Accessibilité** : prise en compte des standards d'accessibilité web

### **7. Intégration**
- **API REST** : endpoints standardisés et documentés
- **Intégration Stripe** : paiements sécurisés et fiables
- **Stockage client** : LocalStorage pour la persistance des sessions
- **Génération de documents** : création automatique de factures PDF

---

## **Cas d'Utilisation Principaux**

### **UC1 – Rechercher et filtrer les biens**
Saisie des filtres → GET `/api/BiensImmobiliers` → service applique filtres et retourne DTO.

### **UC2 – Vérifier la disponibilité et calculer le prix**
GET `/api/Disponibilites/verifier` → validations, vérification chevauchements, calcul `PrixTotal`.

### **UC3 – Créer une réservation et bloquer les dates**
POST `/api/Reservations` → re-vérif dispo, calcul prix, création réservation, marquage indisponibilités.

### **UC4 – Paiement Stripe et facture PDF**
Création `PaymentIntent`, confirmation, enregistrement paiement, génération facture PDF.

### **UC5 – Annulation et remboursement**
Déclenchement remboursement par réservation, mise à jour statuts.

### **UC6 – Authentification**
Clients et admin via JWT; front protège les routes admin.

### **UC7 – Analytics**
Envoi d'événements de vues et lecture agrégée.

---

*Document généré à partir de l'analyse du rapport final du projet de gestion immobilière.*
