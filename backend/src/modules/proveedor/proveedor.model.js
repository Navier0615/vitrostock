import { pool } from '../../config/db.js';

export async function findAll() {
  const { rows } = await pool.query(
    'SELECT id, nombre, telefono, saldo_pendiente FROM proveedor ORDER BY id'
  );
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, nombre, telefono, saldo_pendiente FROM proveedor WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create({ nombre, telefono }) {
  const { rows } = await pool.query(
    `INSERT INTO proveedor (nombre, telefono)
     VALUES ($1, $2)
     RETURNING id, nombre, telefono, saldo_pendiente`,
    [nombre, telefono ?? null]
  );
  return rows[0];
}