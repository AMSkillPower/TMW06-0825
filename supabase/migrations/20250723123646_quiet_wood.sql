/*
  # Rimozione campo versione e aggiornamento categoria software

  1. Modifiche Tabelle
    - Rimosso campo `versione` dalla tabella Software
    - Aggiornato campo `categoria` con nuovi valori

  2. Aggiornamento Dati
    - Aggiornamento categorie esistenti secondo nuove regole
    - Pulizia dati obsoleti
*/

-- Rimozione campo versione se esiste
IF EXISTS (
  SELECT 1 FROM information_schema.columns 
  WHERE table_name = 'Software' AND column_name = 'versione'
)
BEGIN
  ALTER TABLE Software DROP COLUMN versione;
END;

-- Aggiornamento categorie esistenti secondo le nuove regole
-- PLC -> Licenza Software
UPDATE Software SET categoria = 'Licenza Software' WHERE tipoLicenza = 'PLC';

-- ALC -> Manutenzione Software  
UPDATE Software SET categoria = 'Manutenzione Software' WHERE tipoLicenza = 'ALC';

-- YLC e QLC -> Abbonamento Software
UPDATE Software SET categoria = 'Abbonamento Software' WHERE tipoLicenza IN ('YLC', 'QLC');

-- Aggiornamento categorie legacy
UPDATE Software SET categoria = 'Licenza Software' 
WHERE categoria IN ('Produttività', 'Design', 'Ingegneria') AND categoria IS NOT NULL;

UPDATE Software SET categoria = 'Manutenzione Software' 
WHERE categoria = 'Sicurezza' AND categoria IS NOT NULL;

-- Pulizia dati: se non c'è tipoLicenza ma c'è una categoria, mantienila
-- Altrimenti imposta default
UPDATE Software SET categoria = 'Licenza Software' 
WHERE categoria IS NULL OR categoria = '';