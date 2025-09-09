# Schéma d'Architecture - StageMarrakechTactics

## Architecture en Couches (Version Améliorée)

```mermaid
graph TB
    %% Styling amélioré
    classDef frontend fill:#e8f5e8,stroke:#2e7d32,stroke-width:3px,color:#1b5e20
    classDef backend fill:#e3f2fd,stroke:#1565c0,stroke-width:3px,color:#0d47a1
    classDef database fill:#fff3e0,stroke:#f57c00,stroke-width:3px,color:#e65100
    classDef external fill:#fce4ec,stroke:#c2185b,stroke-width:3px,color:#880e4f
    classDef security fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px,color:#4a148c
    
    subgraph "COUCHE DE PRÉSENTATION" as Presentation
        direction TB
        A["React 19.1.0<br/>Single Page Application"] 
        B["React Router<br/>Navigation Client"] 
        C["Tailwind CSS<br/>Framework Styling"] 
        D["Vite<br/>Build Tool & Dev Server"] 
        E["Components<br/>Réutilisables"] 
        F["Pages/Vues<br/>Interface Utilisateur"] 
        
        A --> B
        A --> C
        A --> D
        A --> E
        A --> F
    end
    
    subgraph "COUCHE MÉTIER" as Business
        direction TB
        G["ASP.NET Core 8.0<br/>Framework Backend"] 
        H["API REST<br/>Endpoints HTTP"] 
        I["Controllers<br/>Gestion Requêtes"] 
        J["Services Métier<br/>Logique Applicative"] 
        K["DTOs<br/>Transfert de Données"] 
        L["Validation<br/>Contrôle des Données"] 
        
        G --> H
        H --> I
        I --> J
        J --> K
        J --> L
    end
    
    subgraph "COUCHE D'ACCÈS AUX DONNÉES" as Data
        direction TB
        M["Entity Framework<br/>Core 9.0.7"] 
        N["SQL Server<br/>Base de Données"] 
        O["Migrations<br/>Gestion Schéma"] 
        P["Biens Immobiliers<br/>Entité Métier"] 
        Q["Réservations<br/>Entité Métier"] 
        R["Paiements<br/>Entité Métier"] 
        S["Utilisateurs<br/>Entité Métier"] 
        
        M --> N
        O --> M
        P --> M
        Q --> M
        R --> M
        S --> M
    end
    
    subgraph "INTÉGRATIONS EXTERNES" as External
        direction TB
        T["Stripe<br/>Paiements Sécurisés"] 
        U["SMTP Gmail<br/>Envoi d'Emails"] 
        V["Google Gemini<br/>Intelligence Artificielle"] 
        W["iTextSharp<br/>Génération PDF"] 
    end
    
    subgraph "SÉCURITÉ & PERFORMANCE" as Security
        direction TB
        X["JWT<br/>Authentification"] 
        Y["BCrypt<br/>Hachage Mots de Passe"] 
        Z["CORS<br/>Cross-Origin"] 
        AA["HTTPS<br/>Chiffrement"] 
        BB["Validation<br/>Données"] 
        CC["Caching<br/>Performance"] 
    end
    
    %% Flux de données avec style amélioré
    A -.->|"HTTP/HTTPS + JSON<br/>JWT Authentication"| H
    H -.->|"Entity Framework Core<br/>LINQ Queries"| M
    J -.->|"API Calls"| T
    J -.->|"API Calls"| U
    J -.->|"API Calls"| V
    J -.->|"API Calls"| W
    H -.->|"Security Checks"| X
    H -.->|"Security Checks"| Y
    H -.->|"Security Checks"| Z
    
    %% Relations internes
    A --> E
    A --> F
    I --> J
    J --> M
    T --> R
    U --> J
    V --> J
    W --> J
    
    %% Application des styles
    class A,B,C,D,E,F frontend
    class G,H,I,J,K,L backend
    class M,N,O,P,Q,R,S database
    class T,U,V,W external
    class X,Y,Z,AA,BB,CC security
```

## Flux de Données Détaillé

```mermaid
sequenceDiagram
    participant U as Utilisateur
    participant F as Frontend (React)
    participant B as Backend (ASP.NET Core)
    participant D as Base de Données (SQL Server)
    participant E as Services Externes
    
    Note over U,E: Flux de Données Complet
    
    U->>F: Interaction utilisateur
    F->>B: Requête HTTP + JWT
    B->>B: Validation des données
    B->>D: Requête Entity Framework
    D->>B: Résultats
    B->>E: Appel service externe (si nécessaire)
    E->>B: Réponse service externe
    B->>F: Réponse JSON
    F->>U: Mise à jour interface
    
    Note over U,E: Cycle complet d'une requête utilisateur
```

## Technologies Utilisées (Mindmap Amélioré)

```mermaid
mindmap
  root((StageMarrakechTactics))
    Frontend
      React 19.1.0
      React Router
      Tailwind CSS
      Vite
    Backend
      ASP.NET Core 8.0
      Entity Framework Core 9.0.7
      JWT Authentication
      API REST
    Base de Données
      SQL Server
      Migrations
      LINQ
    Intégrations
      Stripe
      SMTP Gmail
      Google Gemini AI
      iTextSharp
    Sécurité
      BCrypt
      CORS
      HTTPS
      Validation
```

## Architecture Détaillée par Couche

```mermaid
graph LR
    subgraph "PRÉSENTATION"
        A1[React SPA]
        A2[Components]
        A3[Pages]
        A4[Routing]
    end
    
    subgraph "MÉTIER"
        B1[Controllers]
        B2[Services]
        B3[DTOs]
        B4[Validation]
    end
    
    subgraph "DONNÉES"
        C1[Entity Framework]
        C2[SQL Server]
        C3[Migrations]
        C4[Entités]
    end
    
    A1 --> B1
    B1 --> B2
    B2 --> C1
    C1 --> C2
    
    classDef layer1 fill:#e8f5e8,stroke:#2e7d32,stroke-width:2px
    classDef layer2 fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
    classDef layer3 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    
    class A1,A2,A3,A4 layer1
    class B1,B2,B3,B4 layer2
    class C1,C2,C3,C4 layer3
```
