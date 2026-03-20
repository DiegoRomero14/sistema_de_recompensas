const pool = require('../config/db');

const crearUsuario = async ({ tipo_documento, numero_documento, nombre, correo, telefono }) => {
  const query = `
    INSERT INTO usuarios (
      tipo_documento,
      numero_documento,
      nombre,
      correo,
      telefono
    )
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [tipo_documento, numero_documento, nombre, correo || null, telefono || null];
  const { rows } = await pool.query(query, values);

  return rows[0];
};

const listarUsuarios = async () => {
  const query = `
    SELECT
      id,
      tipo_documento,
      numero_documento,
      nombre,
      correo,
      telefono,
      estado,
      fecha_creacion
    FROM usuarios
    ORDER BY id DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

const obtenerUsuarioPorId = async (id) => {
  const query = `
    SELECT
      id,
      tipo_documento,
      numero_documento,
      nombre,
      correo,
      telefono,
      estado,
      fecha_creacion
    FROM usuarios
    WHERE id = $1;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

const buscarPorNumeroDocumento = async (numero_documento) => {
  const query = `
    SELECT *
    FROM usuarios
    WHERE numero_documento = $1;
  `;

  const { rows } = await pool.query(query, [numero_documento]);
  return rows[0];
};

const buscarPorCorreo = async (correo) => {
  const query = `
    SELECT *
    FROM usuarios
    WHERE correo = $1;
  `;

  const { rows } = await pool.query(query, [correo]);
  return rows[0];
};

const actualizarEstadoUsuario = async (id, estado) => {
  const query = `
    UPDATE usuarios
    SET estado = $1
    WHERE id = $2
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [estado, id]);
  return rows[0];
};

const crearSaldoInicial = async (usuarioId) => {
  const query = `
    INSERT INTO saldos_puntos (
      usuario_id,
      saldo_actual
    )
    VALUES ($1, $2);
  `;

  await pool.query(query, [usuarioId, 0]);
};

const obtenerSaldoUsuario = async (usuarioId) => {
  const query = `
    SELECT
      id,
      usuario_id,
      saldo_actual,
      ultima_actualizacion
    FROM saldos_puntos
    WHERE usuario_id = $1;
  `;

  const { rows } = await pool.query(query, [usuarioId]);
  return rows[0];
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  buscarPorNumeroDocumento,
  buscarPorCorreo,
  actualizarEstadoUsuario,
  crearSaldoInicial,
  obtenerSaldoUsuario
};