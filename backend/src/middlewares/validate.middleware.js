// source: parte de la petición a validar ('body' por defecto, o 'query').
export function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      return res.status(400).json({
        ok: false,
        error: { message: 'Datos inválidos', code: 'VALIDATION_ERROR', details: result.error.flatten() },
      });
    }
    req[source] = result.data;
    next();
  };
}
