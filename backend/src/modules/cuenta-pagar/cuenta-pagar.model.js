import { pool } from '../../config/db.js';

// Filtros opcionales: proveedor_id (¿de quién?) y estado (pendiente|pagado).
export async function findAll({ proveedorId, estado } = {}) {
  let sql = `
    SELECT cp.id, cp.proveedor_id, cp.monto, cp.fecha, cp.estado,
           p.nombre AS proveedor_nombre
    FROM cuenta_por_pagar cp
    JOIN proveedor p ON p.id = cp.proveedor_id
  `;
  const where = [];
  const params = [];

  if (proveedorId) {
    params.push(proveedorId);
    where.push(`cp.proveedor_id = $${params.length}`);
  }
  if (estado) {
    params.push(estado);
    where.push(`cp.estado = $${params.length}`);
  }

  if (where.length > 0) sql += ' WHERE ' + where.join(' AND ');
  sql += ' ORDER BY cp.fecha DESC, cp.id DESC';

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function findById(id) {
  const { rows } = await pool.query(
    'SELECT id, proveedor_id, monto, fecha, estado FROM cuenta_por_pagar WHERE id = $1',
    [id]
  );
  return rows[0] || null;
}

export async function create({ proveedor_id, monto, fecha }) {
  const { rows } = await pool.query(
    `INSERT INTO cuenta_por_pagar (proveedor_id, monto, fecha)
     VALUES ($1, $2, COALESCE($3::date, CURRENT_DATE))
     RETURNING id, proveedor_id, monto, fecha, estado`,
    [proveedor_id, monto, fecha || null]
  );
  return rows[0];
}

export async function markAsPagada(id) {
  const { rows } = await pool.query(
    `UPDATE cuenta_por_pagar
        SET estado = 'pagado'
      WHERE id = $1 AND estado = 'pendiente'
      RETURNING id, proveedor_id, monto, fecha, estado`,
    [id]
  );
  return rows[0] || null;
}