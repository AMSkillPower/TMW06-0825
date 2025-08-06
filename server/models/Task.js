const { sql, getPool } = require('../config/database');
sql.MAX = -1;

class Task {
  static async getAll() {
    try {
      const pool = await getPool();
      const result = await pool.request().query(`
        SELECT id, codiceTask, descrizione, dataSegnalazione, dataScadenza, stato,
               software, utente, clienti, priorità, commenti, createdBy
        FROM Task
        ORDER BY dataSegnalazione DESC
      `);
      return result.recordset;
    } catch (error) {
      throw new Error(`Errore nel recupero task: ${error.message}`);
    }
  }

  static async getById(id) {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .query(`
          SELECT id, codiceTask, descrizione, dataSegnalazione, dataScadenza, stato,
                 software, utente, clienti, priorità, commenti, createdBy
          FROM Task
          WHERE id = @id
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Errore nel recupero task: ${error.message}`);
    }
  }

  static async create(taskData) {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('codiceTask', sql.NVarChar(50), taskData.codiceTask)
        .input('descrizione', sql.NVarChar(255), taskData.descrizione)
        .input('dataSegnalazione', sql.DateTime2, taskData.dataSegnalazione)
        .input('dataScadenza', sql.DateTime2, taskData.dataScadenza)
        .input('stato', sql.NVarChar(30), taskData.stato)
        .input('software', sql.NVarChar(50), taskData.software)
        .input('utente', sql.NVarChar(30), taskData.utente)
        .input('clienti', sql.NVarChar(50), taskData.clienti)
        .input('priorità', sql.NVarChar(30), taskData.priorità)
        .input('commenti', sql.NVarChar(4000), taskData.commenti)
        .input('createdBy', sql.Int, taskData.createdBy)
        .query(`
          INSERT INTO Task (codiceTask, descrizione, dataSegnalazione, dataScadenza, stato,
                            software, utente, clienti, priorità, commenti, createdBy)
          OUTPUT INSERTED.*
          VALUES (@codiceTask, @descrizione, @dataSegnalazione, @dataScadenza, @stato,
                  @software, @utente, @clienti, @priorità, @commenti, @createdBy)
        `);
      return result.recordset[0];
    } catch (error) {
      throw new Error(`Errore nella creazione del task: ${error.message}`);
    }
  }

  static async update(id, taskData) {
    try {
      const pool = await getPool();
      const result = await pool.request()
        .input('id', sql.Int, id)
        .input('codiceTask', sql.NVarChar(50), taskData.codiceTask)
        .input('descrizione', sql.NVarChar(255), taskData.descrizione)
        .input('dataSegnalazione', sql.DateTime2, taskData.dataSegnalazione)
        .input('dataScadenza', sql.DateTime2, taskData.dataScadenza)
        .input('stato', sql.NVarChar(30), taskData.stato)
        .input('software', sql.NVarChar(50), taskData.software)
        .input('utente', sql.NVarChar(30), taskData.utente)
        .input('clienti', sql.NVarChar(50), taskData.clienti)
        .input('priorità', sql.NVarChar(30), taskData.priorità)
        .input('commenti', sql.NVarChar(4000), taskData.commenti)
        .query(`
          UPDATE Task
          SET codiceTask = @codiceTask,
              descrizione = @descrizione,
              dataSegnalazione = @dataSegnalazione,
              dataScadenza = @dataScadenza,
              stato = @stato,
              software = @software,
              utente = @utente,
              clienti = @clienti,
              priorità = @priorità,
              commenti = @commenti
          WHERE id = @id
        `);
        const getResult = await pool.request()
      .input('id', sql.Int, id)
      .query('SELECT * FROM Task WHERE id = @id');
      return getResult.recordset[0];
    } catch (error) {
      throw new Error(`Errore nell'aggiornamento del task: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const pool = await getPool();
      await pool.request()
        .input('id', sql.Int, id)
        .query('DELETE FROM Task WHERE id = @id');
      return true;
    } catch (error) {
      throw new Error(`Errore nell'eliminazione del task: ${error.message}`);
    }
  }
}

module.exports = Task;
