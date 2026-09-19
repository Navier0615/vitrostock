import { pool } from '../../config/db.js';

const COLUMNS = 'id, nombre, categoria, unidad_medida, precio_unitario, stock_actual';

// pg devuelve NUMERIC como string; se convierte a número para el JSON.
function toProducto(row) {
  return row && { ...row, precio_unitario: Number(row.precio_unitario) };
}

export async function insert({ nombre, categoria, unidad_medida, precio_unitario }) {
  const { rows } = await pool.query(
    `INSERT INTO producto (nombre, categoria, unidad_medida, precio_unitario)
     VALUES ($1, $2, $3, $4)
     RETURNING ${COLUMNS}`,
    [nombre, categoria, unidad_medida, precio_unitario],
  );
  return toProducto(rows[0]);
}

export async function findAll() {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM producto ORDER BY id`);
  return rows.map(toProducto);
}

export async function findById(id) {
  const { rows } = await pool.query(`SELECT ${COLUMNS} FROM producto WHERE id = $1`, [id]);
  return toProducto(rows[0]);
}
