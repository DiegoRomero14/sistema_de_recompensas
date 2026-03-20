const usuarioRepository = require('../repositories/usuario.repository');

const crearUsuario = async (data) => {
  const { tipo_documento, numero_documento, nombre, correo, telefono } = data;

  if (!tipo_documento || !numero_documento || !nombre) {
    throw new Error('Los campos tipo_documento, numero_documento y nombre son obligatorios');
  }

  const usuarioExistente = await usuarioRepository.buscarPorNumeroDocumento(numero_documento);

  if (usuarioExistente) {
    throw new Error('Ya existe un usuario con ese número de documento');
  }

  if (correo) {
    const correoExistente = await usuarioRepository.buscarPorCorreo(correo);
    if (correoExistente) {
      throw new Error('Ya existe un usuario con ese correo');
    }
  }

  const nuevoUsuario = await usuarioRepository.crearUsuario({
    tipo_documento,
    numero_documento,
    nombre,
    correo,
    telefono
  });

  await usuarioRepository.crearSaldoInicial(nuevoUsuario.id);

  return nuevoUsuario;
};

const listarUsuarios = async () => {
  return await usuarioRepository.listarUsuarios();
};

const obtenerUsuarioPorId = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('El id del usuario no es válido');
  }

  const usuario = await usuarioRepository.obtenerUsuarioPorId(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return usuario;
};

const cambiarEstadoUsuario = async (id, estado) => {
  if (!id || isNaN(id)) {
    throw new Error('El id del usuario no es válido');
  }

  if (typeof estado !== 'boolean') {
    throw new Error('El campo estado debe ser true o false');
  }

  const usuario = await usuarioRepository.obtenerUsuarioPorId(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  return await usuarioRepository.actualizarEstadoUsuario(id, estado);
};

const obtenerSaldoUsuario = async (id) => {
  if (!id || isNaN(id)) {
    throw new Error('El id del usuario no es válido');
  }

  const usuario = await usuarioRepository.obtenerUsuarioPorId(id);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

  const saldo = await usuarioRepository.obtenerSaldoUsuario(id);

  if (!saldo) {
    throw new Error('Saldo no encontrado');
  }

  return saldo;
};

module.exports = {
  crearUsuario,
  listarUsuarios,
  obtenerUsuarioPorId,
  cambiarEstadoUsuario,
  obtenerSaldoUsuario
};