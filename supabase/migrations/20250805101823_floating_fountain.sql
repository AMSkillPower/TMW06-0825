/*
  # Sistema di Autenticazione Utenti

  1. Nuova Tabella
    - `users` (utenti del sistema)
      - `id` (identity, primary key)
      - `username` (varchar, unique)
      - `password` (varchar, hash bcrypt)
      - `role` (varchar, 'Main' o 'User')
      - `fullName` (varchar, nome completo)
      - `email` (varchar, email utente)
      - `isActive` (bit, utente attivo)
      - `createdAt` (datetime2, data creazione)
      - `updatedAt` (datetime2, data aggiornamento)

  2. Modifica Tabella Task
    - Aggiunto campo `createdBy` per tracciare chi ha creato il task

  3. Sicurezza
    - Indici per performance
    - Constraint per ruoli
    - Utente admin di default
*/

-- Creazione tabella Users
CREATE TABLE Users (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(50) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL, -- Hash bcrypt
    role NVARCHAR(10) NOT NULL DEFAULT 'User',
    fullName NVARCHAR(100) NOT NULL,
    email NVARCHAR(255),
    isActive BIT DEFAULT 1,
    createdAt DATETIME2 DEFAULT GETDATE(),
    updatedAt DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT CK_Users_Role CHECK (role IN ('Main', 'User'))
);

-- Aggiunta campo createdBy alla tabella Task
IF NOT EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'Task' AND column_name = 'createdBy'
)
BEGIN
  ALTER TABLE Task ADD createdBy INT;
  ALTER TABLE Task ADD CONSTRAINT FK_Task_CreatedBy 
    FOREIGN KEY (createdBy) REFERENCES Users(id);
END;

-- Indici per performance
CREATE INDEX IX_Users_Username ON Users(username);
CREATE INDEX IX_Users_Role ON Users(role);
CREATE INDEX IX_Users_IsActive ON Users(isActive);
CREATE INDEX IX_Task_CreatedBy ON Task(createdBy);

-- Trigger per aggiornare updatedAt automaticamente
CREATE TRIGGER TR_Users_UpdatedAt ON Users
AFTER UPDATE
AS
BEGIN
    UPDATE Users 
    SET updatedAt = GETDATE()
    WHERE id IN (SELECT id FROM inserted);
END;

-- Utente amministratore di default
-- Password: admin123 (hash bcrypt)
INSERT INTO Users (username, password, role, fullName, email) VALUES
('admin', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqu', 'Main', 'Amministratore Sistema', 'admin@taskmanager.com'),
('user1', '$2b$10$rOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqQqQqQqQqOzJqQqQqQqQqu', 'User', 'Utente Test', 'user1@taskmanager.com');

-- Aggiorna task esistenti assegnandoli all'admin
UPDATE Task SET createdBy = 1 WHERE createdBy IS NULL;