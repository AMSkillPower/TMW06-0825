/*
  # Creazione tabella Allegati semplificata

  1. Nuova Tabella
    - `id` (identity, primary key)
    - `allegato` (nvarchar(max) per contenuto base64)
    - `idTask` (foreign key verso Task.id)

  2. Sicurezza
    - Foreign key constraint verso tabella Task
    - Indice per performance
*/

-- Elimina tabella esistente se presente
IF EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Allegati]') AND type in (N'U'))
DROP TABLE Allegati;

-- Creazione tabella Allegati semplificata
CREATE TABLE Allegati (
    id INT IDENTITY(1,1) PRIMARY KEY,
    allegato NVARCHAR(MAX) NOT NULL, -- Contenuto file in base64
    idTask INT NOT NULL,
    FOREIGN KEY (idTask) REFERENCES Task(id) ON DELETE CASCADE
);

-- Indice per performance
CREATE INDEX IX_Allegati_IdTask ON Allegati(idTask);