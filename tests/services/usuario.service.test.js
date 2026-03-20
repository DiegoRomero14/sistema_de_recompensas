const usuarioRepository = require('../../src/repositories/usuario.repository');
const usuarioService = require('../../src/services/usuario.service');

describe('Pruebas unitarias - usuario.service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('crearUsuario', () => {
    it('debe crear un usuario correctamente', async () => {
      const data = {
        tipo_documento: 'CC',
        numero_documento: '123456789',
        nombre: 'Jaider Rios',
        correo: 'jaider@mail.com',
        telefono: '3001234567'
      };

      vi.spyOn(usuarioRepository, 'buscarPorNumeroDocumento').mockResolvedValue(null);
      vi.spyOn(usuarioRepository, 'buscarPorCorreo').mockResolvedValue(null);
      vi.spyOn(usuarioRepository, 'crearUsuario').mockResolvedValue({
        id: 1,
        ...data,
        estado: true
      });
      vi.spyOn(usuarioRepository, 'crearSaldoInicial').mockResolvedValue();

      const resultado = await usuarioService.crearUsuario(data);

      expect(usuarioRepository.buscarPorNumeroDocumento).toHaveBeenCalledWith('123456789');
      expect(usuarioRepository.buscarPorCorreo).toHaveBeenCalledWith('jaider@mail.com');
      expect(usuarioRepository.crearUsuario).toHaveBeenCalled();
      expect(usuarioRepository.crearSaldoInicial).toHaveBeenCalledWith(1);
      expect(resultado.nombre).toBe('Jaider Rios');
    });

    it('debe lanzar error si faltan campos obligatorios', async () => {
      const data = {
        tipo_documento: 'CC',
        numero_documento: '',
        nombre: ''
      };

      await expect(usuarioService.crearUsuario(data)).rejects.toThrow(
        'Los campos tipo_documento, numero_documento y nombre son obligatorios'
      );
    });

    it('debe lanzar error si ya existe un usuario con ese documento', async () => {
      const data = {
        tipo_documento: 'CC',
        numero_documento: '123456789',
        nombre: 'Jaider Rios'
      };

      vi.spyOn(usuarioRepository, 'buscarPorNumeroDocumento').mockResolvedValue({
        id: 1,
        numero_documento: '123456789'
      });

      await expect(usuarioService.crearUsuario(data)).rejects.toThrow(
        'Ya existe un usuario con ese número de documento'
      );
    });

    it('debe lanzar error si ya existe un usuario con ese correo', async () => {
      const data = {
        tipo_documento: 'CC',
        numero_documento: '987654321',
        nombre: 'Jaider Rios',
        correo: 'jaider@mail.com'
      };

      vi.spyOn(usuarioRepository, 'buscarPorNumeroDocumento').mockResolvedValue(null);
      vi.spyOn(usuarioRepository, 'buscarPorCorreo').mockResolvedValue({
        id: 1,
        correo: 'jaider@mail.com'
      });

      await expect(usuarioService.crearUsuario(data)).rejects.toThrow(
        'Ya existe un usuario con ese correo'
      );
    });
  });

  describe('listarUsuarios', () => {
    it('debe retornar la lista de usuarios', async () => {
      const usuariosMock = [
        { id: 1, nombre: 'Jaider Rios' },
        { id: 2, nombre: 'Ana Torres' }
      ];

      vi.spyOn(usuarioRepository, 'listarUsuarios').mockResolvedValue(usuariosMock);

      const resultado = await usuarioService.listarUsuarios();

      expect(usuarioRepository.listarUsuarios).toHaveBeenCalled();
      expect(resultado).toHaveLength(2);
    });
  });

  describe('obtenerUsuarioPorId', () => {
    it('debe retornar un usuario si existe', async () => {
      const usuarioMock = { id: 1, nombre: 'Jaider Rios' };

      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue(usuarioMock);

      const resultado = await usuarioService.obtenerUsuarioPorId(1);

      expect(usuarioRepository.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
      expect(resultado).toEqual(usuarioMock);
    });

    it('debe lanzar error si el id no es válido', async () => {
      await expect(usuarioService.obtenerUsuarioPorId('abc')).rejects.toThrow(
        'El id del usuario no es válido'
      );
    });

    it('debe lanzar error si el usuario no existe', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue(null);

      await expect(usuarioService.obtenerUsuarioPorId(99)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });
  });

  describe('cambiarEstadoUsuario', () => {
    it('debe cambiar el estado correctamente', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue({
        id: 1,
        nombre: 'Jaider Rios',
        estado: true
      });

      vi.spyOn(usuarioRepository, 'actualizarEstadoUsuario').mockResolvedValue({
        id: 1,
        nombre: 'Jaider Rios',
        estado: false
      });

      const resultado = await usuarioService.cambiarEstadoUsuario(1, false);

      expect(usuarioRepository.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
      expect(usuarioRepository.actualizarEstadoUsuario).toHaveBeenCalledWith(1, false);
      expect(resultado.estado).toBe(false);
    });

    it('debe lanzar error si estado no es boolean', async () => {
      await expect(usuarioService.cambiarEstadoUsuario(1, 'false')).rejects.toThrow(
        'El campo estado debe ser true o false'
      );
    });

    it('debe lanzar error si el usuario no existe', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue(null);

      await expect(usuarioService.cambiarEstadoUsuario(100, false)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });
  });

  describe('obtenerSaldoUsuario', () => {
    it('debe retornar el saldo del usuario', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue({
        id: 1,
        nombre: 'Jaider Rios'
      });

      vi.spyOn(usuarioRepository, 'obtenerSaldoUsuario').mockResolvedValue({
        usuario_id: 1,
        saldo_actual: 50
      });

      const resultado = await usuarioService.obtenerSaldoUsuario(1);

      expect(usuarioRepository.obtenerUsuarioPorId).toHaveBeenCalledWith(1);
      expect(usuarioRepository.obtenerSaldoUsuario).toHaveBeenCalledWith(1);
      expect(resultado.saldo_actual).toBe(50);
    });

    it('debe lanzar error si no existe el usuario', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue(null);

      await expect(usuarioService.obtenerSaldoUsuario(5)).rejects.toThrow(
        'Usuario no encontrado'
      );
    });

    it('debe lanzar error si no existe saldo', async () => {
      vi.spyOn(usuarioRepository, 'obtenerUsuarioPorId').mockResolvedValue({
        id: 1,
        nombre: 'Jaider Rios'
      });

      vi.spyOn(usuarioRepository, 'obtenerSaldoUsuario').mockResolvedValue(null);

      await expect(usuarioService.obtenerSaldoUsuario(1)).rejects.toThrow(
        'Saldo no encontrado'
      );
    });
  });
});