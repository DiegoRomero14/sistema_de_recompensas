const movimientoRepository = require('../repositories/movimiento.repository');
const usuarioRepository = require('../repositories/usuario.repository');

const listarMovimientos = async () => {
  return await movimientoRepository.listarMovimientos();
};

const obtenerMovimientoPorId = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('El id del movimiento no es válido');
  }

  const movimiento = await movimientoRepository.obtenerMovimientoPorId(id);

  if (!movimiento) {
    throw new Error('Movimiento no encontrado');
  }

  return movimiento;
};

const listarMovimientosPorUsuario = async (usuarioId) => {
  if (!usuarioId || isNaN(usuarioId)) {
    throw new Error('El usuarioId no es válido');
  }

  const usuario = await usuarioRepository.obtenerUsuarioPorId(usuarioId);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return await movimientoRepository.listarMovimientosPorUsuario(usuarioId);
};

module.exports = {
  listarMovimientos,
  obtenerMovimientoPorId,
  listarMovimientosPorUsuario
};