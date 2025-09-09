# Diagramme de Classes Complet - Application de Gestion Immobilière

## Diagramme Mermaid

```mermaid
classDiagram
    %% Entités principales
    class BiensImmobilier {
        +int Id
        +string Titre
        +string? Description
        +decimal Prix
        +string Adresse
        +string Ville
        +int Surface
        +DateTime DateDePublication
        +bool EstDisponible
        +int NombreDeChambres
        +int NombreDeSallesDeBain
        +int NombreDeSalons
        +int NombreDeCuisines
        +decimal? Latitude
        +decimal? Longitude
        +int TypeDeBienId
        +string StatutTransaction
        +decimal? PrixParNuit
        +int? ProprietaireId
    }

    class Utilisateur {
        +int Id
        +string NomUtilisateur
        +string MotDePasseHashe
        +string? Email
        +string? NomComplet
        +string? Telephone
    }

    class Reservation {
        +int Id
        +int BienImmobilierId
        +int UtilisateurId
        +DateTime DateDebut
        +DateTime DateFin
        +int NombreDeVoyageurs
        +decimal PrixTotal
        +string Statut
        +DateTime DateDeReservation
    }

    class Paiement {
        +int Id
        +int ReservationId
        +decimal Montant
        +DateTime DateDePaiement
        +string MethodeDePaiement
        +string StatutPaiement
        +string TransactionId
        +string? CheminFacture
    }

    class Refund {
        +int Id
        +int ReservationId
        +int PaiementId
        +decimal MontantRembourse
        +DateTime DateDeRemboursement
        +string StatutRemboursement
        +string MethodeDeRemboursement
        +string TransactionIdRemboursement
        +string? RaisonRemboursement
        +string? CheminFactureRemboursement
    }

    %% Entités de configuration et métier
    class TypesDeBien {
        +int Id
        +string Nom
    }

    class Amenagement {
        +int Id
        +string Nom
        +string? Icone
    }

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

    %% Entités de gestion
    class Disponibilite {
        +int Id
        +int BienImmobilierId
        +DateTime Date
        +bool EstDisponible
        +decimal? PrixNuit
    }

    class ImagesBien {
        +int Id
        +string UrlImage
        +bool EstImagePrincipale
        +int BienImmobilierId
    }

    class AnalyticsEvent {
        +int Id
        +string EventType
        +int? BienImmobilierId
        +string? Path
        +DateTime CreatedAt
    }

    %% RELATIONS - COMPOSITION (diamant plein)
    %% Une réservation est composée de paiements (si la réservation est supprimée, les paiements aussi)
    Reservation ||--o{ Paiement : "compose"
    
    %% Un paiement peut être composé de remboursements (si le paiement est supprimé, les remboursements aussi)
    Paiement ||--o{ Refund : "compose"
    
    %% Un bien immobilier est composé d'images (si le bien est supprimé, les images aussi)
    BiensImmobilier ||--o{ ImagesBien : "compose"
    
    %% Un bien immobilier est composé de disponibilités (si le bien est supprimé, les disponibilités aussi)
    BiensImmobilier ||--o{ Disponibilite : "compose"

    %% RELATIONS - AGRÉGATION (diamant vide)
    %% Un type de bien agrège des biens immobiliers (les biens peuvent exister sans le type)
    TypesDeBien o--o{ BiensImmobilier : "agrège"
    
    %% Un propriétaire agrège des biens immobiliers (les biens peuvent exister sans propriétaire)
    Proprietaire o--o{ BiensImmobilier : "agrège"
    
    %% Un utilisateur agrège des réservations (les réservations peuvent exister sans utilisateur)
    Utilisateur o--o{ Reservation : "agrège"
    
    %% Un bien immobilier agrège des réservations (les réservations peuvent exister sans le bien)
    BiensImmobilier o--o{ Reservation : "agrège"

    %% RELATIONS - ASSOCIATION (ligne simple)
    %% Association many-to-many entre biens immobiliers et aménagements
    BiensImmobilier }o--o{ Amenagement : "associe"
    
    %% Association optionnelle entre analytics et biens immobiliers
    AnalyticsEvent }o--|| BiensImmobilier : "associe"

    %% RELATIONS - DÉPENDANCE (ligne pointillée)
    %% Refund dépend de Reservation (relation de navigation)
    Refund ..> Reservation : "dépend"
    
    %% Refund dépend de Paiement (relation de navigation)
    Refund ..> Paiement : "dépend"
```

## Légende des Relations

### Composition (||--o{)
- **Réservation → Paiement** : Une réservation est composée de paiements. Si la réservation est supprimée, tous ses paiements sont supprimés.
- **Paiement → Refund** : Un paiement peut être composé de remboursements. Si le paiement est supprimé, tous ses remboursements sont supprimés.
- **BiensImmobilier → ImagesBien** : Un bien immobilier est composé d'images. Si le bien est supprimé, toutes ses images sont supprimées.
- **BiensImmobilier → Disponibilite** : Un bien immobilier est composé de disponibilités. Si le bien est supprimé, toutes ses disponibilités sont supprimées.

### Agrégation (o--o{)
- **TypesDeBien → BiensImmobilier** : Un type de bien agrège des biens immobiliers. Les biens peuvent exister indépendamment du type.
- **Proprietaire → BiensImmobilier** : Un propriétaire agrège des biens immobiliers. Les biens peuvent exister sans propriétaire.
- **Utilisateur → Reservation** : Un utilisateur agrège des réservations. Les réservations peuvent exister sans utilisateur.
- **BiensImmobilier → Reservation** : Un bien immobilier agrège des réservations. Les réservations peuvent exister sans le bien.

### Association (}o--o{)
- **BiensImmobilier ↔ Amenagement** : Association many-to-many entre biens immobiliers et aménagements.
- **AnalyticsEvent → BiensImmobilier** : Association optionnelle (0..1) entre événements analytics et biens immobiliers.

### Dépendance (..>)
- **Refund → Reservation** : Relation de navigation, le remboursement dépend de la réservation.
- **Refund → Paiement** : Relation de navigation, le remboursement dépend du paiement.

## Explications des Relations

### Composition (||--o{)
Utilisée quand une entité "possède" une autre entité et que la suppression de l'entité parent entraîne la suppression de l'entité enfant.

### Agrégation (o--o{)
Utilisée quand une entité "contient" une autre entité mais que l'entité enfant peut exister indépendamment.

### Association (}o--o{)
Utilisée pour les relations many-to-many ou les relations simples entre entités.

### Dépendance (..>)
Utilisée pour les relations de navigation ou les dépendances logiques.

## Cardinalités

- **1** : Exactement un
- **0..1** : Zéro ou un
- **0..*** ou **o{** : Zéro ou plusieurs
- **1..*** ou **||** : Un ou plusieurs
- **}o** : Optionnel (0..1)
- **||** : Obligatoire (1)

## Notes Techniques

1. **Cascade Delete** : Les relations de composition impliquent une suppression en cascade.
2. **Navigation Properties** : Toutes les relations sont bidirectionnelles avec des propriétés de navigation.
3. **Clés étrangères** : Chaque relation est matérialisée par une clé étrangère en base de données.
4. **Contraintes d'intégrité** : Les contraintes de clé étrangère assurent l'intégrité référentielle.
