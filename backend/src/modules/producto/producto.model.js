import { pool } from '../../config/db.js';

const COLUMNS = 'id, nombre, categoria, unidad_medida, precio_unitario, stock_actual';

// pg devuelve NUMERIC como string; se convierte a número para el JSON.
function toProducto(row) {
  return row && { ...row, precio_unitario: Number(row.precio_unitario) };
}

// Crea el producto y, si trae stock inicial, deja registrada la entrada en movimiento_inventario.
// Todo va en una transacción para que el stock y el historial no queden desfasados.
export async function insert({ nombre, categoria, unidad_medida, precio_unitario, stock_inicial = 0 }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO producto (nombre, categoria, unidad_medida, precio_unitario, stock_actual)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING ${COLUMNS}`,
      [nombre, categoria, unidad_medida, precio_unitario, stock_inicial],
    );
    if (stock_inicial > 0) {
      await client.query(
        `INSERT INTO movimiento_inventario (producto_id, tipo, cantidad, motivo)
         VALUES ($1, 'entrada', $2, 'Stock inicial')`,
        [rows[0].id, stock_inicial],
      );
    }
    await client.query('COMMIT');
    return toProducto(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Registra una entrada (HU02): guarda el movimiento y suma la cantidad al stock actual.
// Devuelve el producto actualizado, o null si no existe.
export async function registrarEntrada(id, { cantidad, motivo }) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows } = await client.query(
      `UPDATE producto
          SET stock_actual = stock_actual + $2
        WHERE id = $1
        RETURNING ${COLUMNS}`,
      [id, cantidad],
    );
    if (!rows[0]) {
      await client.query('ROLLBACK');
      return null;
    }
    await client.query(
      `INSERT INTO movimiento_inventario (producto_id, tipo, cantidad, motivo)
       VALUES ($1, 'entrada', $2, $3)`,
      [id, cantidad, motivo || null],
    );
    await client.query('COMMIT');
    return toProducto(rows[0]);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
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
