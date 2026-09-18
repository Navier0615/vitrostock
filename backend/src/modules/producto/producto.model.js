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

// Listado de stock (HU04). Sin `buscar` devuelve todo; con `buscar` filtra por nombre.
export async function findStock(buscar) {
  // Se escapan % _ \ para que el texto se busque literal y no como comodín de ILIKE.
  const patron = `%${(buscar ?? '').replace(/[\\%_]/g, '\\$&')}%`;
  const { rows } = await pool.query(
    `SELECT id, nombre, categoria, unidad_medida, stock_actual
       FROM producto
      WHERE nombre ILIKE $1
      ORDER BY nombre, id`,
    [patron],
  );
  return rows;
}
