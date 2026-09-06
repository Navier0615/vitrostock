const express = require('express');
const cors = require('cors');
const app = express();

const users = [
	{
		name: 'María',
		age: '33',
		email: 'maria.gmail.com'
	},
	{
		name: 'Mario',
		age: '33',
		email: 'mario.gmail.com'
	},
];

app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json()); // Permite leer JSON en el body de las peticiones

app.get('/users', (req, res) => {
	res.json(users); // envía la lista al cliente
});
// TODO: CREAR AQUÍ LOS DEMÁS MÉTODOS

// Endpoint GET personalizado por URL
app.get('/hello/:nombre', (req, res) => {
  const { nombre } = req.params;
  res.send(`¡Hola, ${nombre}!`);
});

// Función de validación
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
  const nuevoUsuario = req.body;
  users.push(nuevoUsuario);
  res.status(201).json(nuevoUsuario);
});

// PUT - Actualizar un usuario por índice
app.put('/users/:index', (req, res) => {
  const { index } = req.params;
  const errores = validarUsuario(req.body);
  if (errores.length > 0) {
    return res.status(400).json({ errores });
  }
  if (!users[index]) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  users[index] = req.body;
  res.json(users[index]);
});

// DELETE - Eliminar un usuario por índice
app.delete('/users/:index', (req, res) => {
  const { index } = req.params;
  if (!users[index]) {
    return res.status(404).json({ error: 'Usuario no encontrado' });
  }
  const eliminado = users.splice(index, 1);
  res.json({ mensaje: 'Usuario eliminado', eliminado });
});

app.listen(3000, () => {
	console.log('El servidor está escuchando en el puerto 3000');
});