# 3. Architecture Technique - StageMarrakechTactics

## 3.1 Choix technologiques

### 3.1.1 Technologies principales

#### — .NET 8.0 (ASP.NET Core)
ASP.NET Core est un framework web open-source développé par Microsoft pour la création d'applications web modernes. Il offre une architecture modulaire, des performances élevées et une excellente intégration avec l'écosystème Microsoft. Le choix de .NET 8.0 s'explique par sa stabilité, ses performances optimisées et son support à long terme.

#### — React 19.1.0
React est une bibliothèque JavaScript open-source développée par Facebook pour la création d'interfaces utilisateur interactives. Sa popularité, sa grande communauté de développeurs et sa flexibilité en font un choix idéal pour le développement frontend moderne. React 19 apporte des améliorations significatives en termes de performances et de fonctionnalités.

#### — SQL Server
Microsoft SQL Server est un système de gestion de base de données relationnelle robuste et fiable. Son intégration native avec l'écosystème .NET, ses performances élevées et ses fonctionnalités avancées de sécurité en font un choix optimal pour les applications d'entreprise.

### 3.1.2 Frameworks et outils

#### — Entity Framework Core 9.0.7
Entity Framework Core est un ORM (Object-Relational Mapping) moderne pour .NET qui simplifie l'accès aux données. Il permet de travailler avec des objets .NET plutôt que d'écrire du SQL brut, facilitant ainsi la maintenance et l'évolution du code.

#### — Vite 7.0.3
Vite est un outil de build moderne pour le développement frontend. Il offre des performances exceptionnelles grâce à son serveur de développement basé sur ES modules natifs et sa compilation rapide en production.

#### — Tailwind CSS 4.1.11
Tailwind CSS est un framework CSS utilitaire qui permet de construire des interfaces utilisateur rapidement en utilisant des classes prédéfinies. Son approche "utility-first" facilite la création d'interfaces cohérentes et responsive.

#### — Stripe
Stripe est une plateforme de paiement en ligne qui fournit des API pour traiter les paiements de manière sécurisée. Son intégration simplifie la gestion des transactions financières dans l'application.

#### — JWT (JSON Web Tokens)
Les JWT sont utilisés pour l'authentification et l'autorisation des utilisateurs. Ils permettent de maintenir des sessions sécurisées sans stockage côté serveur.

### 3.1.3 Outils de développement

#### — Swagger/OpenAPI
Swagger est un outil qui génère automatiquement la documentation de l'API REST. Il facilite le développement, les tests et l'intégration avec d'autres systèmes.

#### — BCrypt.Net-Next
BCrypt est un algorithme de hachage de mots de passe sécurisé qui protège les informations d'authentification des utilisateurs.

#### — iTextSharp
iTextSharp est une bibliothèque pour la génération de documents PDF, utilisée pour créer des factures et des reçus de paiement.

## 3.2 Architecture technique

### 3.2.1 Vue d'ensemble

L'architecture de notre application a été conçue selon une approche moderne et modulaire, reposant sur une séparation claire des responsabilités entre le frontend et le backend. Notre application adopte une architecture en couches bien définies, où chaque composant a un rôle spécifique et communique avec les autres via des interfaces standardisées. Cette approche garantit la maintenabilité, la scalabilité et la sécurité de l'application tout en facilitant le développement et les tests.

```
┌─────────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE EN COUCHES                      │
│                    StageMarrakechTactics                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    COUCHE DE PRÉSENTATION                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   React 19.1.0  │  │   React Router  │  │  Tailwind CSS   │  │
│  │   (SPA)         │  │   (Navigation)  │  │   (Styling)     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │     Vite        │  │   Components    │  │     Pages       │  │
│  │   (Build Tool)  │  │   (Reusable)    │  │   (Views)       │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTP/HTTPS + JSON
                                    │ JWT Authentication
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    COUCHE MÉTIER                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ ASP.NET Core    │  │   API REST      │  │   Controllers   │  │
│  │   8.0           │  │   (Endpoints)   │  │   (HTTP)        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Services      │  │   DTOs          │  │   Validation    │  │
│  │   (Business)    │  │   (Transfer)    │  │   (Data)        │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Entity Framework Core
                                    │ LINQ Queries
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                COUCHE D'ACCÈS AUX DONNÉES                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │ SQL Server      │  │   Entity        │  │   Migrations    │  │
│  │ (Database)      │  │   Framework     │  │   (Schema)      │  │
│  └─────────────────┘  │   Core 9.0.7    │  └─────────────────┘  │
│                       └─────────────────┘                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   Biens         │  │   Reservations  │  │   Paiements     │  │
│  │   Immobiliers   │  │   (Bookings)    │  │   (Payments)    │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    INTÉGRATIONS EXTERNES                        │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │     Stripe      │  │      SMTP       │  │   Google        │  │
│  │   (Payments)    │  │    (Emails)     │  │   Gemini AI     │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   iTextSharp    │  │     BCrypt      │  │     JWT         │  │
│  │    (PDF)        │  │   (Security)    │  │ (Auth Tokens)   │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    SÉCURITÉ & PERFORMANCE                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │      CORS       │  │   Validation    │  │   Caching       │  │
│  │ (Cross-Origin)  │  │   (Data)        │  │   (Performance) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │
│  │   HTTPS         │  │   Connection    │  │   Async/Await   │  │
│  │ (Encryption)    │  │   Pooling       │  │   (Scalability) │  │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2.2 Les couches de l'application

La couche de présentation constitue l'interface utilisateur de notre application et est développée avec React 19.1.0. Cette bibliothèque JavaScript moderne nous permet de créer une Single Page Application (SPA) performante et interactive. L'application utilise React Router pour la navigation côté client, permettant une expérience utilisateur fluide sans rechargement de page. Le frontend est structuré de manière modulaire avec des composants réutilisables organisés par fonctionnalité : authentification, gestion des biens immobiliers, réservations, et administration. L'interface utilisateur est stylisée avec Tailwind CSS, un framework CSS utilitaire qui facilite la création d'interfaces responsive et modernes. Le développement frontend est optimisé grâce à Vite, un outil de build moderne qui offre un serveur de développement rapide et une compilation efficace en production.

La couche métier, développée avec ASP.NET Core 8.0, implémente toute la logique applicative et expose une API REST complète. Cette couche est organisée selon le pattern Repository-Service-Controller, garantissant une séparation claire des responsabilités. Les contrôleurs API gèrent les requêtes HTTP et délèguent le traitement aux services métier appropriés. Ces services encapsulent la logique métier complexe, notamment la gestion des réservations, des paiements via Stripe, l'authentification JWT, et l'envoi d'emails automatiques. L'injection de dépendances est utilisée pour maintenir un couplage faible entre les composants, facilitant ainsi les tests unitaires et la maintenance du code.

La couche d'accès aux données est gérée par Entity Framework Core 9.0.7, un ORM moderne qui simplifie l'interaction avec la base de données SQL Server. Le contexte de base de données (AgenceImmoDbContext) définit les entités métier principales : biens immobiliers, utilisateurs, réservations, paiements, disponibilités, et propriétaires. Les relations entre ces entités sont configurées avec des clés étrangères et des contraintes appropriées. Entity Framework Core gère automatiquement les migrations de base de données, permettant une évolution contrôlée du schéma. Les requêtes sont optimisées grâce à LINQ, qui permet d'écrire des requêtes type-safe et performantes.

La couche de sécurité est intégrée à travers plusieurs mécanismes. L'authentification est basée sur les JWT (JSON Web Tokens) avec une clé de chiffrement sécurisée. Les mots de passe sont hachés avec BCrypt, un algorithme de hachage sécurisé. L'API est protégée par CORS (Cross-Origin Resource Sharing) pour contrôler les accès cross-origin. La validation des données est effectuée côté serveur pour chaque endpoint, garantissant l'intégrité des données reçues.

### 3.2.3 Communication inter-couches

La communication entre les couches suit un modèle client-serveur standardisé. Le frontend React communique avec le backend via des requêtes HTTP REST, utilisant le format JSON pour l'échange de données. Les requêtes sont authentifiées via des tokens JWT inclus dans les headers HTTP. Le backend traite ces requêtes, applique la logique métier, interroge la base de données via Entity Framework Core, et retourne les réponses au format JSON avec les codes de statut HTTP appropriés.

### 3.2.4 Intégrations externes

Notre application intègre plusieurs services externes pour enrichir ses fonctionnalités. Stripe est utilisé pour le traitement sécurisé des paiements par carte bancaire, incluant la gestion des remboursements. L'envoi d'emails automatiques est géré via SMTP (Gmail), permettant l'envoi de confirmations de réservation, factures, et notifications importantes. La génération de documents PDF est assurée par iTextSharp pour la création de factures et reçus. Enfin, l'intégration avec Google Gemini AI permet d'ajouter des fonctionnalités d'analyse intelligente des données.

### 3.2.5 Configuration et déploiement

L'application est configurée pour fonctionner en mode développement et production. En développement, le frontend est servi par le serveur de développement Vite sur le port 5173, tandis que le backend ASP.NET Core écoute sur le port 5257. La documentation de l'API est automatiquement générée avec Swagger, facilitant le développement et les tests. En production, l'application peut être déployée sur des serveurs web standard avec support HTTPS pour la sécurité des communications.

## 3.3 Avantages de l'architecture choisie

### 3.3.1 Flexibilité et maintenabilité
- **Séparation des responsabilités** : Chaque couche a un rôle bien défini
- **Code modulaire** : Facilité d'ajout de nouvelles fonctionnalités
- **Tests unitaires** : Architecture propice aux tests automatisés

### 3.3.2 Performance et scalabilité
- **API REST** : Communication efficace entre frontend et backend
- **Base de données optimisée** : Requêtes performantes avec Entity Framework
- **Architecture stateless** : Facilité de mise à l'échelle horizontale

### 3.3.3 Sécurité
- **Authentification robuste** : JWT avec expiration automatique
- **Validation des données** : Protection contre les injections et attaques
- **HTTPS** : Chiffrement des communications en production

### 3.3.4 Développement et déploiement
- **Hot reload** : Développement rapide avec Vite
- **Documentation automatique** : API documentée avec Swagger
- **Docker ready** : Architecture compatible avec la conteneurisation

## 3.4 Conclusion

Cette architecture nous permet de répondre aux exigences de sécurité, de modularité et de performance, tout en facilitant la maintenance et l'évolutivité du produit. Le choix des technologies — React pour le front-end, ASP.NET Core pour le back-end et SQL Server pour la base de données — s'explique par leur maturité, leur communauté active et leur parfaite intégration dans notre environnement de développement.
