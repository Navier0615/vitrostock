import { app } from './app.js';
import { env } from './config/env.js';
import { pool } from './config/db.js';

app.listen(env.port, async () => {
  console.log(`VitroStock backend corriendo en http://localhost:${env.port}`);
  try {
    await pool.query('SELECT 1');
    console.log('Conexión a la base de datos verificada.');
  } catch (err) {
    console.error('No se pudo conectar a la base de datos:', err.message);
  }
});
