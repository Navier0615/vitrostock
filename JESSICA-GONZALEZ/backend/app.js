const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// Conexión y configuración de la base de datos SQLite

const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err.message);
  } else {
    console.log('Conectado a la base de datos SQLite (users.db)');
  }
});

// Crear la tabla de usuarios si no existe
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age TEXT NOT NULL,
    email TEXT
  )
`, () => {
  // Insertar los usuarios iniciales solo si la tabla está vacía
  db.get('SELECT COUNT(*) as total FROM users', [], (err, row) => {
    if (!err && row.total === 0) {
      db.run(`INSERT INTO users (name, age, email) VALUES ('María', '33', 'maria.gmail.com')`);
      db.run(`INSERT INTO users (name, age, email) VALUES ('Mario', '33', 'mario.gmail.com')`);
    }
  });
});

// GET - Listar todos los usuarios

app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows); // envía la lista al cliente
  });
});

// GET - Endpoint personalizado por URL

app.get('/hello/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.send(`¡Hola, ${nombre}!`);
});

// Función de validación de datos del usuario

function validarUsuario(body) {
  const errores = [];
  if (!body.name || typeof body.name !== 'string') {
    errores.push('El campo "name" es obligatorio.');
  }
  if (!body.age) {
    errores.push('El campo "age" es obligatorio.');
  }
  return errores;
}

// POST - Crear un nuevo usuario

app.post('/users', (req, res) => {
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const { name, age, email } = req.body;

  db.run(
    'INSERT INTO users (name, age, email) VALUES (?, ?, ?)',
    [name, age, email || null],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, name, age, email: email || null });
    }
  );
});

// PUT - Actualizar un usuario por id

app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }

  const { name, age, email } = req.body;

  db.run(
    'UPDATE users SET name = ?, age = ?, email = ? WHERE id = ?',
    [name, age, email || null, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json({ id: Number(id), name, age, email: email || null });
    }
  );
});

// DELETE - Eliminar un usuario por id

app.delete('/users/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM users WHERE id = ?', [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.json({ mensaje: 'Usuario eliminado', id: Number(id) });
  });
});

app.listen(3000, () => {
  console.log('El servidor está escuchando en el puerto 3000');
});