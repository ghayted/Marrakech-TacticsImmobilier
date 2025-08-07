-- Migration pour ajouter la table Refunds
-- Exécutez cette requête dans votre base de données SQL Server

-- Créer la table Refunds
CREATE TABLE [dbo].[Refunds] (
    [Id] INT IDENTITY(1,1) NOT NULL,
    [ReservationId] INT NOT NULL,
    [PaiementId] INT NOT NULL,
    [MontantRembourse] DECIMAL(18,2) NOT NULL,
    [DateDeRemboursement] DATETIME2 NOT NULL DEFAULT (GETDATE()),
    [StatutRemboursement] NVARCHAR(50) NOT NULL,
    [MethodeDeRemboursement] NVARCHAR(50) NOT NULL,
    [TransactionIdRemboursement] NVARCHAR(255) NOT NULL,
    [RaisonRemboursement] NVARCHAR(500) NULL,
    [CheminFactureRemboursement] NVARCHAR(500) NULL,
    CONSTRAINT [PK__Refunds__3214EC07] PRIMARY KEY ([Id])
);

-- Ajouter les contraintes de clé étrangère
ALTER TABLE [dbo].[Refunds] 
ADD CONSTRAINT [FK_Refunds_Reservations] 
FOREIGN KEY ([ReservationId]) 
REFERENCES [dbo].[Reservations] ([Id]);

ALTER TABLE [dbo].[Refunds] 
ADD CONSTRAINT [FK_Refunds_Paiements] 
FOREIGN KEY ([PaiementId]) 
REFERENCES [dbo].[Paiements] ([Id]);

-- Créer un index pour améliorer les performances
CREATE INDEX [IX_Refunds_ReservationId] ON [dbo].[Refunds] ([ReservationId]);
CREATE INDEX [IX_Refunds_PaiementId] ON [dbo].[Refunds] ([PaiementId]);
CREATE INDEX [IX_Refunds_DateDeRemboursement] ON [dbo].[Refunds] ([DateDeRemboursement]); 