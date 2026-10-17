import { pool } from '../../config/db.js';

// Crear una nueva cuenta por cobrar
export async function create({ cliente_id, monto, fecha }) {
  const query = fecha
    ? `INSERT INTO cuenta_por_cobrar (cliente_id, monto, fecha) VALUES ($1, $2, $3) RETURNING *`
    : `INSERT INTO cuenta_por_cobrar (cliente_id, monto) VALUES ($1, $2) RETURNING *`;
  const params = fecha ? [cliente_id, monto, fecha] : [cliente_id, monto];

  const { rows } = await pool.query(query, params);
  return rows[0];
}

// Listar todas las cuentas por cobrar
export async function findAll() {
  const { rows } = await pool.query(
    `SELECT * FROM cuenta_por_cobrar ORDER BY fecha DESC`
  );
  return rows;
}

// Listar cuentas por cobrar de un cliente específico
export async function findByCliente(cliente_id) {
  const { rows } = await pool.query(
    `SELECT * FROM cuenta_por_cobrar WHERE cliente_id = $1 ORDER BY fecha DESC`,
    [cliente_id]
  );
  return rows;
}

// Buscar una cuenta por su id
export async function findById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM cuenta_por_cobrar WHERE id = $1`,
    [id]
  );
  return rows[0];
}

// Actualizar el estado de una cuenta (marcar como pagada / pendiente)
export async function updateEstado(id, estado) {
  const { rows } = await pool.query(
    `UPDATE cuenta_por_cobrar SET estado = $1 WHERE id = $2 RETURNING *`,
    [estado, id]
  );
  return rows[0];
}

// Verificar si un cliente existe (para validar la FK antes de insertar)
export async function clienteExiste(cliente_id) {
  const { rows } = await pool.query(
    `SELECT id FROM cliente WHERE id = $1`,
    [cliente_id]
  );
  return rows.length > 0;
}
