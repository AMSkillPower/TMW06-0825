const express = require('express');
const app = express();
const cors = require('cors');
const sql = require('mssql');
require('dotenv').config();
const { getPool } = require('./config/database');
const path = require('path');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const softwareRoutes = require('./routes/software');
const taskRoutes = require('./routes/task');
const clientiRoutes = require('./routes/clienti');
const allegatiRoutes = require('./routes/allegati');
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
app.use('/api/allegati', allegatiRoutes);
app.use('/api/software', softwareRoutes);
app.use('/api/task', taskRoutes);
app.use('/api/clienti', clientiRoutes);

const frontendPath = path.join(__dirname, '..', 'dist');
app.use(express.static(frontendPath));

app.use(cors());
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));


app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});



app.get('/', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT TOP 1 * FROM Task'); // 🐞 cambia con la tua tabella!
    res.json(result.recordset);
  } catch (err) {
    console.error('Errore nella query:', err);
    res.status(500).send('Errore nel server');
  }
});

app.post('/api/software', async (req, res) => {
  try {
    const { nome, logo } = req.body;

    if (!nome || !logo ) {
      console.log('📦 Ricevuto nel body:', req.body);
      return res.status(400).json({ message: 'Dati incompleti' });
    }

    const pool = await getPool();
    await pool.request()
      .input('nomeSoftware', sql.VarChar, nome)
      .input('logo', sql.VarChar, logo)
      .query(`
        INSERT INTO Software (nomeSoftware, logo)
        VALUES (@nomeSoftware, @logo)
      `);

    res.status(201).json({ message: 'Software registrato correttamente' });
  } catch (err) {
    console.error('❌ Errore durante POST /api/software:', err.message);
    res.status(500).send('Errore nel salvataggio del software');
  }
});


// Avvia server su porta da .env o default 3002
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Server in asssscolto su http://localhost:${PORT}`);
});
