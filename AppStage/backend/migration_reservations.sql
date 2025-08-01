-- =====================================================
-- SCRIPT DE MIGRATION POUR LES RÉSERVATIONS
-- =====================================================
-- 
-- INSTRUCTIONS POUR TON AMI :
-- 1. Ouvre un terminal dans le dossier backend
-- 2. Lance cette commande pour exécuter le script :
--    docker exec -it sqlserver-docker /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P azerty@123 -i /var/opt/mssql/backup/migration_reservations.sql
-- 
-- OU si le script est sur ton PC :
--    docker exec -i sqlserver-docker /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P azerty@123 < migration_reservations.sql
--
-- OU directement via la commande :
--    docker exec -it sqlserver-docker /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P azerty@123 -Q "$(cat migration_reservations.sql)"
--
-- REMARQUE : Ce script vérifie automatiquement si les tables/colonnes existent déjà
-- donc il n'y aura PAS de conflit même si tu l'exécutes plusieurs fois !
-- =====================================================

-- Script de migration pour ajouter les fonctionnalités de réservation

-- 1. Ajout de la colonne 'PrixParNuit' à la table 'BiensImmobiliers'
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'BiensImmobiliers' AND COLUMN_NAME = 'PrixParNuit')
BEGIN
    ALTER TABLE BiensImmobiliers
    ADD PrixParNuit DECIMAL(18, 2) NULL;
END
GO

-- 2. Ajout de colonnes à la table 'Utilisateurs'
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Utilisateurs' AND COLUMN_NAME = 'Email')
BEGIN
    ALTER TABLE Utilisateurs
    ADD Email NVARCHAR(255) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Utilisateurs' AND COLUMN_NAME = 'NomComplet')
BEGIN
    ALTER TABLE Utilisateurs
    ADD NomComplet NVARCHAR(255) NULL;
END
GO

IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'Utilisateurs' AND COLUMN_NAME = 'Telephone')
BEGIN
    ALTER TABLE Utilisateurs
    ADD Telephone NVARCHAR(20) NULL;
END
GO

-- 3. Création de la table 'Reservations'
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Reservations')
BEGIN
    CREATE TABLE Reservations (
        Id INT PRIMARY KEY IDENTITY(1,1),
        BienImmobilierId INT NOT NULL,
        UtilisateurId INT NOT NULL,
        DateDebut DATE NOT NULL,
        DateFin DATE NOT NULL,
        NombreDeVoyageurs INT NOT NULL,
        PrixTotal DECIMAL(18, 2) NOT NULL,
        Statut NVARCHAR(50) NOT NULL,
        DateDeReservation DATETIME2 NOT NULL DEFAULT GETDATE(),

        CONSTRAINT FK_Reservations_BiensImmobiliers FOREIGN KEY (BienImmobilierId) REFERENCES BiensImmobiliers(Id),
        CONSTRAINT FK_Reservations_Utilisateurs FOREIGN KEY (UtilisateurId) REFERENCES Utilisateurs(Id)
    );
END
GO

-- 4. Création de la table 'Paiements'
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Paiements')
BEGIN
    CREATE TABLE Paiements (
        Id INT PRIMARY KEY IDENTITY(1,1),
        ReservationId INT NOT NULL,
        Montant DECIMAL(18, 2) NOT NULL,
        DateDePaiement DATETIME2 NOT NULL DEFAULT GETDATE(),
        MethodeDePaiement NVARCHAR(50) NOT NULL,
        StatutPaiement NVARCHAR(50) NOT NULL,
        TransactionId NVARCHAR(255) NOT NULL,
        CheminFacture NVARCHAR(500) NULL,

        CONSTRAINT FK_Paiements_Reservations FOREIGN KEY (ReservationId) REFERENCES Reservations(Id)
    );
END
GO

-- 5. Création de la table 'Disponibilites'
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'Disponibilites')
BEGIN
    CREATE TABLE Disponibilites (
        Id INT PRIMARY KEY IDENTITY(1,1),
        BienImmobilierId INT NOT NULL,
        [Date] DATE NOT NULL,
        EstDisponible BIT NOT NULL DEFAULT 1,
        PrixNuit DECIMAL(18, 2) NULL,

        CONSTRAINT FK_Disponibilites_BiensImmobiliers FOREIGN KEY (BienImmobilierId) REFERENCES BiensImmobiliers(Id)
    );
END
GO

-- 6. Ajout d'index pour améliorer les performances
IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reservations_BienImmobilierId')
BEGIN
    CREATE INDEX IX_Reservations_BienImmobilierId ON Reservations(BienImmobilierId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Reservations_UtilisateurId')
BEGIN
    CREATE INDEX IX_Reservations_UtilisateurId ON Reservations(UtilisateurId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.indexes WHERE name = 'IX_Disponibilites_BienImmobilierId_Date')
BEGIN
    CREATE INDEX IX_Disponibilites_BienImmobilierId_Date ON Disponibilites(BienImmobilierId, [Date]);
END
GO

PRINT 'Migration terminée avec succès !';
