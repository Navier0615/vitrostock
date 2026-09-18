-- =========================================================
-- VitroStock - Esquema de base de datos (PostgreSQL)
-- Basado en el modelo E-R de docs/documentacion_vitrostock.md
-- Ejecutar una sola vez para crear las tablas en local:
--   psql -U postgres -d vitrostock -f backend/database/schema.sql
-- =========================================================

-- Entidades base (sin dependencias)

CREATE TABLE IF NOT EXISTS producto (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    categoria        VARCHAR(80),
    unidad_medida    VARCHAR(30),
    precio_unitario  NUMERIC(12,2) NOT NULL CHECK (precio_unitario > 0),
    stock_actual     INTEGER NOT NULL DEFAULT 0 CHECK (stock_actual >= 0)
);

CREATE TABLE IF NOT EXISTS cliente (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    telefono         VARCHAR(30),
    saldo_pendiente  NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS proveedor (
    id               SERIAL PRIMARY KEY,
    nombre           VARCHAR(150) NOT NULL,
    telefono         VARCHAR(30),
    saldo_pendiente  NUMERIC(12,2) NOT NULL DEFAULT 0
);

-- Entidades dependientes (con FK)

CREATE TABLE IF NOT EXISTS movimiento_inventario (
    id           SERIAL PRIMARY KEY,
    producto_id  INTEGER NOT NULL REFERENCES producto(id),
    tipo         VARCHAR(10) NOT NULL CHECK (tipo IN ('entrada', 'salida')),
    cantidad     INTEGER NOT NULL CHECK (cantidad > 0),
    fecha        DATE NOT NULL DEFAULT CURRENT_DATE,
    motivo       VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS cuenta_por_cobrar (
    id          SERIAL PRIMARY KEY,
    cliente_id  INTEGER NOT NULL REFERENCES cliente(id),
    monto       NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    estado      VARCHAR(10) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado'))
);

CREATE TABLE IF NOT EXISTS cuenta_por_pagar (
    id           SERIAL PRIMARY KEY,
    proveedor_id INTEGER NOT NULL REFERENCES proveedor(id),
    monto        NUMERIC(12,2) NOT NULL CHECK (monto > 0),
    fecha        DATE NOT NULL DEFAULT CURRENT_DATE,
    estado       VARCHAR(10) NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado'))
);

CREATE TABLE IF NOT EXISTS cotizacion (
    id          SERIAL PRIMARY KEY,
    cliente_id  INTEGER NOT NULL REFERENCES cliente(id),
    fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    total       NUMERIC(12,2) NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS detalle_cotizacion (
    id               SERIAL PRIMARY KEY,
    cotizacion_id    INTEGER NOT NULL REFERENCES cotizacion(id),
    producto_id      INTEGER NOT NULL REFERENCES producto(id),
    cantidad         INTEGER NOT NULL CHECK (cantidad > 0),
    precio_unitario  NUMERIC(12,2) NOT NULL CHECK (precio_unitario > 0)
);

-- Índices útiles para las consultas más comunes (HU04, HU06, HU07)
CREATE INDEX IF NOT EXISTS idx_movimiento_producto ON movimiento_inventario(producto_id);
CREATE INDEX IF NOT EXISTS idx_cxc_cliente        ON cuenta_por_cobrar(cliente_id);
CREATE INDEX IF NOT EXISTS idx_cxp_proveedor      ON cuenta_por_pagar(proveedor_id);
CREATE INDEX IF NOT EXISTS idx_producto_nombre    ON producto(nombre);
