export function errorHandler(err, req, res, next) {
  console.error(err);
  res.status(500).json({ ok: false, error: { message: 'Error interno del servidor', code: 'INTERNAL_ERROR' } });
}
