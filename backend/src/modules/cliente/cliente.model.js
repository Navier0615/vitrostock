import { pool } from '../../config/db.js';

export async function findAll() {
  const { rows } = await pool.query('SELECT id, nombre, telefono FROM cliente ORDER BY nombre, id');
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query('SELECT id, nombre, telefono FROM cliente WHERE id = $1', [id]);
  return rows[0] || null;
}

export async function create({ nombre, telefono }) {
  const { rows } = await pool.query(
    `INSERT INTO cliente (nombre, telefono)
     VALUES ($1, $2)
     RETURNING id, nombre, telefono`,
    [nombre, telefono ?? null],
  );
  return rows[0];
}
