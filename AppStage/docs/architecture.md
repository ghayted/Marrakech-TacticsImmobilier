## Architecture fonctionnelle et logique

Ce document présente une vue d’ensemble du backend et du frontend de l’application, le diagramme de classes (domaine métier) et les cas d’utilisation clés avec leur logique.

### Stack
- Backend: ASP.NET Core, Entity Framework Core (SQL Server)
- Frontend: React (React Router), Stripe (paiement), LocalStorage (token)

### Diagramme de classes (domaine)
```mermaid
classDiagram
    class BiensImmobilier {
      int Id
      string Titre
      string? Description
      decimal Prix
      string Adresse
      string Ville
      int Surface
      DateTime DateDePublication
      bool EstDisponible
      int NombreDeChambres
      int NombreDeSallesDeBain
      int NombreDeSalons
      int NombreDeCuisines
      decimal? Latitude
      decimal? Longitude
      int TypeDeBienId
      string StatutTransaction
      decimal? PrixParNuit
      int? ProprietaireId
    }
    class TypesDeBien {
      int Id
      string Nom
    }
    class Amenagement {
      int Id
      string Nom
      string? Icone
    }
    class ImagesBien {
      int Id
      string UrlImage
      bool EstImagePrincipale
      int BienImmobilierId
    }
    class Utilisateur {
      int Id
      string NomUtilisateur
      string MotDePasseHashe
      string? Email
      string? NomComplet
      string? Telephone
    }
    class Reservation {
      int Id
      int BienImmobilierId
      int UtilisateurId
      DateTime DateDebut
      DateTime DateFin
      int NombreDeVoyageurs
      decimal PrixTotal
      string Statut
      DateTime DateDeReservation
    }
    class Paiement {
      int Id
      int ReservationId
      decimal Montant
      DateTime DateDePaiement
      string MethodeDePaiement
      string StatutPaiement
      string TransactionId
      string? CheminFacture
    }
    class Refund {
      int Id
      int ReservationId
      int PaiementId
      decimal MontantRembourse
      DateTime DateDeRemboursement
      string StatutRemboursement
      string MethodeDeRemboursement
      string TransactionIdRemboursement
      string? RaisonRemboursement
      string? CheminFactureRemboursement
    }
    class Disponibilite {
      int Id
      int BienImmobilierId
      DateTime Date
      bool EstDisponible
      decimal? PrixNuit
    }
    class Proprietaire {
      int Id
      string Nom
      string Prenom
      string Email
      string Telephone
      string Adresse
      DateTime DateCreation
      bool EstActif
    }
    class AnalyticsEvent {
      int Id
      string EventType
      int? BienImmobilierId
      string? Path
      DateTime CreatedAt
    }

    TypeseBien "1" --> "*" BiensImmobilier : type
    Proprietaire "1" --> "*" BiensImmobilier : possède
    BiensImmobilier "1" --> "*" ImagesBien : a
    BiensImmobilier "*" -- "*" Amenagement : amenagements
    BiensImmobilier "1" --> "*" Reservation : réservéPar
    Utilisateur "1" --> "*" Reservation : effectue
    Reservation "1" --> "*" Paiement : génère
    Paiement "1" --> "*" Refund : peutProvoquer
    Reservation "1" --> "*" Refund : liéÀ
    BiensImmobilier "1" --> "*" Disponibilite : calendrier
    AnalyticsEvent "*" ..> BiensImmobilier : référenceOptionnelle
```
D
Notes:
- Statuts clés: `Reservation.Statut` [En attente de paiement, Confirmée, Annulée]; `Paiement.StatutPaiement` [Réussi, Échoué, En attente]; `Refund.StatutRemboursement` [En cours, Réussi, Échoué]; `BiensImmobilier.StatutTransaction` [À Louer (Nuit), À Louer (Mois), À Vendre, Vendu, Loué].
- Le prix total d’une réservation est calculé par `DisponibiliteService.CalculerPrixTotalAsync` avec priorité aux `Disponibilite.PrixNuit` puis fallback `BiensImmobilier.PrixParNuit` ou `Prix/30`.

### Principaux endpoints (résumé)
- `AuthController`
  - POST `/api/Auth/login` (admin) ; POST `/api/Auth/client-login` ; POST `/api/Auth/client-register` ; GET `/api/Auth/verify`.
- `BiensImmobiliersController`
  - GET `/api/BiensImmobiliers` (filtres: recherche, type, statut, ville, quartier, prix, dates, voyageurs, propriétaire) ; POST `/api/BiensImmobiliers` ; etc.
- `ReservationsController`
  - POST `/api/Reservations` ; GET `/api/Reservations` ; GET `/api/Reservations/{id}` ; filtres: id, clientId, status, search.
- `DisponibilitesController`
  - GET `/api/Disponibilites/verifier` ; GET `/api/Disponibilites` ; POST `/api/Disponibilites`.
- `PaiementsController`
  - POST `/api/Paiements` ; GET `/api/Paiements` ; GET `/api/Paiements/{id}` ; GET `/api/Paiements/reservation/{reservationId}` ; GET `/api/Paiements/{id}/facture`.
- `PaymentsController` (Stripe)
  - POST `/api/Payments/create-payment-intent` ; POST `/api/Payments/webhook` ; POST `/api/Payments/confirm-payment`.
- `RefundsController`
  - POST `/api/Refunds` ; GET `/api/Refunds` ; GET `/api/Refunds/{id}` ; GET `/api/Refunds/reservation/{reservationId}` ; PUT `/api/Refunds/{id}` ; PUT `/api/Refunds/{id}/confirmer` ; POST `/api/Refunds/process-reservation/{reservationId}`.
- `AnalyticsController`
  - POST `/api/Analytics/site-view` ; POST `/api/Analytics/bien-view/{bienId}` ; GET `/api/Analytics/site/monthly` ; GET `/api/Analytics/bien/{bienId}/monthly` ; GET `/api/Analytics/site/count` ; GET `/api/Analytics/bien/{bienId}/count` ; GET `/api/Analytics/bien/top`.
- `ProprietairesController`, `DashboardController`, `StatsController`, `ContactController`, `AgentController` (proxy IA) disponibles pour fonctions annexes.

## Cas d’utilisation et logique

### UC1. Rechercher et filtrer les biens
1) L’utilisateur (client) saisit des filtres (type, ville, statut, prix, dates, voyageurs).
2) Front appelle GET `/api/BiensImmobiliers` avec query params.
3) `BienImmobilierService.GetAllBiensAsync` applique les filtres, inclut `TypeDeBien`, `Amenagements`, `ImagesBiens`, `Disponibilites` et retourne des DTO légers.

### UC2. Vérifier la disponibilité et calculer le prix
1) Front appelle GET `/api/Disponibilites/verifier` avec `bienImmobilierId`, `dateDebut`, `dateFin`.
2) `DisponibiliteService.VerifierDisponibiliteAsync`:
   - Valide l’intervalle, vérifie chevauchements avec `Reservations` (sauf Annulée) et `Disponibilites` indisponibles.
   - Calcule `PrixTotal` via `CalculerPrixTotalAsync`.

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant DISP as DisponibilitesController
    participant DS as DisponibiliteService
    participant DB as DB (EF Core)
    UI->>DISP: GET /api/Disponibilites/verifier
    DISP->>DS: VerifierDisponibiliteAsync(bienId, dateDebut, dateFin)
    DS->>DB: Vérifie réservations & disponibilités
    DS->>DB: Récupère prix spécifiques & bien
    DS-->>DISP: DisponibiliteResultDto { EstDisponible, PrixTotal, NombreNuits }
    DISP-->>UI: 200 OK (JSON)
```

### UC3. Créer une réservation et bloquer les dates
1) Front envoie POST `/api/Reservations` avec `CreateReservationDto` (bien, utilisateur, dates, voyageurs).
2) `ReservationService.CreateReservationAsync`:
   - Re-vérifie la dispo, calcule le prix.
   - Crée `Reservation` (Statut = "Confirmée" par défaut).
   - Marque les dates comme indisponibles via `MarquerIndisponibleAsync`.

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant RES as ReservationsController
    participant RS as ReservationService
    participant DS as DisponibiliteService
    participant DB as DB
    UI->>RES: POST /api/Reservations
    RES->>RS: CreateReservationAsync(dto)
    RS->>DS: VerifierDisponibiliteAsync
    RS->>DS: CalculerPrixTotalAsync
    RS->>DB: Add Reservation
    RS->>DS: MarquerIndisponibleAsync(bienId, dates)
    RS-->>RES: ReservationDto
    RES-->>UI: 201 Created
```

### UC4. Paiement Stripe et génération de facture PDF
1) Front crée un PaymentIntent: POST `/api/Payments/create-payment-intent` (montant en centimes, metadata réservation).
2) Stripe retourne un `client_secret` pour confirmer côté front.
3) Après succès, front confirme: POST `/api/Payments/confirm-payment` (ReservationId, Amount, PaymentIntentId).
4) `PaiementService.CreatePaiementAsync`:
   - Crée `Paiement`, met à jour statut de réservation si montant total atteint.
   - Génère facture PDF via iTextSharp, persiste `CheminFacture` et expose `LienFacture`.

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant PAY as PaymentsController
    participant PS as PaiementService
    participant RS as ReservationService
    participant DB as DB
    UI->>PAY: POST create-payment-intent (amount, metadata)
    PAY-->>UI: client_secret
    UI->>Stripe: Confirme le paiement côté client
    UI->>PAY: POST confirm-payment (ReservationId, Amount, PaymentIntentId)
    PAY->>PS: CreatePaiementAsync(dto)
    PS->>DB: Insert Paiement
    PS->>DB: Somme paiements (si >= PrixTotal)
    PS->>RS: UpdateReservationStatutAsync("Confirmée")
    PS->>DB: Génère et enregistre facture (PDF)
    PS-->>PAY: PaiementDto { LienFacture }
    PAY-->>UI: 200 OK (Success, FactureUrl)
```

### UC5. Annulation et remboursement
1) Front (client ou admin) déclenche POST `/api/Refunds/process-reservation/{reservationId}`.
2) `RefundService.ProcessRefundForReservationAsync` orchestre la création du `Refund`, interaction PSP (selon implémentation), mise à jour des statuts.
3) Optionnel: PUT `/api/Refunds/{id}/confirmer` pour marquer le remboursement comme confirmé.

```mermaid
sequenceDiagram
    participant UI as Frontend
    participant REF as RefundsController
    participant RFS as RefundService
    participant DB as DB
    UI->>REF: POST process-reservation/{reservationId}
    REF->>RFS: ProcessRefundForReservationAsync
    RFS->>DB: Crée Refund + MAJ statuts
    RFS-->>REF: success
    REF-->>UI: 200 OK / 400
```

### UC6. Authentification client et admin
- Client: POST `/api/Auth/client-login` → JWT; stockage `localStorage.authToken`; GET `/api/Auth/verify` pour valider le token.
- Admin: POST `/api/Auth/login` → JWT; le frontend dispose d’un `ProtectedRoute` basé sur la présence du token (à étendre si besoin pour rôles).

### UC7. Analytics (vues site et biens)
- Le frontend envoie des événements: POST `/api/Analytics/site-view` et `/api/Analytics/bien-view/{bienId}`.
- Lecture agrégée mensuelle et comptages via endpoints GET correspondants.

## Frontend (routage et pages)
- Routes principales (`src/App.jsx`):
  - `/` → `ClientHome`
  - `/biens` → `BiensList`
  - `/property/:id` → `PropertyDetailUser`
  - `/reservation/:id` → `ReservationPage`
  - `/mes-reservations` → `MesReservations`
  - `/admin`, `/admin/dashboard` → `AdminDashboard` (peut être protégé par `ProtectedRoute`)

Interactions notables:
- `ReservationPage` intègre Stripe (`@stripe/react-stripe-js`) et consomme `PaymentsController` pour PaymentIntent et confirmation.
- `ClientLoginModal` consomme `/api/Auth/client-login` et écrit le token.

## Remarques de conception
- Les services backend encapsulent la logique métier: disponibilités, calculs, paiements, remboursements, analytics.
- Les contrôleurs restent fins et délèguent aux services.
- CORS ouvert en dev; prévoir un durcissement en prod.
- Facturation PDF générée côté serveur et servie depuis `wwwroot/factures`.

## Évolutions suggérées (rapides)
- Ajouter un rôle/claim pour distinguer Admin/Client et protéger les routes Admin côté API et Front.
- Gérer l’idempotence des paiements et des remboursements (duplicate handling).
- Webhook Stripe: compléter la MAJ de réservation au succès/échec.


