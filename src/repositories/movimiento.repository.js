const pool = require('../config/db');

const listarMovimientos = async () => {
  const query = `
    SELECT
      m.id,
      m.usuario_id,
      u.nombre AS usuario_nombre,
      u.numero_documento,
      m.tipo_movimiento,
      m.puntos,
      m.descripcion,
      m.origen,
      m.referencia_id,
      m.fecha_movimiento
    FROM movimientos_puntos m
    INNER JOIN usuarios u ON u.id = m.usuario_id
    ORDER BY m.id DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const obtenerMovimientoPorId = async (id) => {
  const query = `
    SELECT
      m.id,
      m.usuario_id,
      u.nombre AS usuario_nombre,
      u.numero_documento,
      m.tipo_movimiento,
      m.puntos,
      m.descripcion,
      m.origen,
      m.referencia_id,
      m.fecha_movimiento
    FROM movimientos_puntos m
    INNER JOIN usuarios u ON u.id = m.usuario_id
    WHERE m.id = $1;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const listarMovimientosPorUsuario = async (usuarioId) => {
  const query = `
    SELECT
      m.id,
      m.usuario_id,
      u.nombre AS usuario_nombre,
      u.numero_documento,
      m.tipo_movimiento,
      m.puntos,
      m.descripcion,
      m.origen,
      m.referencia_id,
      m.fecha_movimiento
    FROM movimientos_puntos m
    INNER JOIN usuarios u ON u.id = m.usuario_id
    WHERE m.usuario_id = $1
    ORDER BY m.id DESC;
  `;

  const { rows } = await pool.query(query, [usuarioId]);
  return rows;
};

module.exports = {
  listarMovimientos,
  obtenerMovimientoPorId,
  listarMovimientosPorUsuario
};