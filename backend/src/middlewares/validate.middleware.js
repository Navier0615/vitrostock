export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        error: { message: 'Datos inválidos', code: 'VALIDATION_ERROR', details: result.error.flatten() },
      });
    }
    req.body = result.data;
    next();
  };
}
