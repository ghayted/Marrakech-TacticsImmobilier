# Diagrammes UML du projet Marrakech Tactics

Ce fichier contient deux diagrammes Mermaid :
- Un diagramme de classes (structure principale de la base de données et des entités)
- Un diagramme de cas d'utilisation (Use Case) pour les principaux rôles

---

## 1. Diagramme de classes (UML)

```mermaid
classDiagram
    class Proprietaire {
        +int Id
        +string Nom
        +string Prenom
        +string Email
        +string Telephone
        +string Adresse
        +DateTime DateCreation
        +bool EstActif
    }
    class BiensImmobilier {
        +int Id
        +string Titre
        +string Adresse
        +string Ville
        +decimal Prix
        +double Surface
        +string StatutTransaction
        +int? ProprietaireId
        +int TypeDeBienId
        +List~ImageBien~ Images
        +List~Disponibilite~ Disponibilites
    }
    class Utilisateur {
        +int Id
        +string Nom
        +string Prenom
        +string Email
        +string Telephone
        +string MotDePasse
        +string Role
    }
    class Reservation {
        +int Id
        +DateTime DateDebut
        +DateTime DateFin
        +int NombreDeVoyageurs
        +decimal PrixTotal
        +string Statut
        +int UtilisateurId
        +int BienImmobilierId
    }
    class Paiement {
        +int Id
        +decimal Montant
        +DateTime DateDePaiement
        +string MethodeDePaiement
        +string StatutPaiement
        +int ReservationId
    }
    class Refund {
        +int Id
        +decimal MontantRembourse
        +DateTime DateDeRemboursement
        +string StatutRemboursement
        +string RaisonRemboursement
        +int ReservationId
        +int PaiementId
    }
    class TypeDeBien {
        +int Id
        +string Nom
    }
    class ImageBien {
        +int Id
        +string Url
        +int BienImmobilierId
    }
    class Disponibilite {
        +int Id
        +DateTime DateDebut
        +DateTime DateFin
        +int BienImmobilierId
    }

    Proprietaire "1" --o "*" BiensImmobilier : possède
    BiensImmobilier "1" --o "*" ImageBien : images
    BiensImmobilier "1" --o "*" Disponibilite : disponibilités
    BiensImmobilier "*" --o "1" TypeDeBien : type
    BiensImmobilier "1" --o "*" Reservation : réservations
    Reservation "*" --o "1" Utilisateur : client
    Reservation "1" --o "*" Paiement : paiements
    Reservation "1" --o "*" Refund : remboursements
    Paiement "*" --o "1" Reservation : concerne
    Refund "*" --o "1" Paiement : lié à
```

---

## 2. Diagramme de cas d'utilisation (Use Case)

```mermaid
usecaseDiagram
    actor Admin as A
    actor Client as C
    actor Proprietaire as P

    A --> (Gérer les biens immobiliers)
    A --> (Gérer les propriétaires)
    A --> (Gérer les utilisateurs)
    A --> (Gérer les réservations)
    A --> (Gérer les paiements)
    A --> (Gérer les remboursements)
    A --> (Consulter les statistiques)

    P --> (Consulter ses biens)
    P --> (Ajouter un bien)
    P --> (Modifier un bien)
    P --> (Consulter ses réservations)

    C --> (Rechercher un bien)
    C --> (Consulter les détails d'un bien)
    C --> (Faire une réservation)
    C --> (Payer une réservation)
    C --> (Annuler une réservation)
    C --> (Consulter ses réservations)
```

---

> **Astuce :** Vous pouvez visualiser ces diagrammes sur GitHub, VS Code (avec l'extension Mermaid), ou sur [mermaid.live](https://mermaid.live/).
