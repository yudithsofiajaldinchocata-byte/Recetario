import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma.js';
import { MENSAJES_AUTH } from '../constants/mensajes.js';
import type { RolUsuario } from '../types/usuario.types.js';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secreto-jwt-llave-recetario-2026';

export const authService = {
  registroUsuario: async (nombre: string, email: string, contrasena: string) => {
    const emailNormalizado = email.toLowerCase().trim();

    // Verificar si el correo ya existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (usuarioExistente) {
      throw new Error(MENSAJES_AUTH.EMAIL_EN_USO);
    }

    // Hashear contraseña
    const passwordHash = await bcrypt.hash(contrasena, 10);

    // Crear usuario en base de datos
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        nombre: nombre.trim(),
        email: emailNormalizado,
        passwordHash,
        rol: 'USUARIO',
      },
    });

    // Generar token JWT
    const token = jwt.sign(
      { id: nuevoUsuario.id, email: nuevoUsuario.email, rol: nuevoUsuario.rol as RolUsuario },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      usuario: {
        id: nuevoUsuario.id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol as RolUsuario,
        avatarUrl: nuevoUsuario.avatarUrl,
      },
      token,
    };
  },

  loginUsuario: async (email: string, contrasena: string) => {
    const emailNormalizado = email.toLowerCase().trim();

    const usuario = await prisma.usuario.findUnique({
      where: { email: emailNormalizado },
    });

    if (!usuario) {
      throw new Error(MENSAJES_AUTH.CREDENCIALES_INVALIDAS);
    }

    const esValida = await bcrypt.compare(contrasena, usuario.passwordHash);
    if (!esValida) {
      throw new Error(MENSAJES_AUTH.CREDENCIALES_INVALIDAS);
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol as RolUsuario },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol as RolUsuario,
        avatarUrl: usuario.avatarUrl,
      },
      token,
    };
  },

  obtenerPerfil: async (usuarioId: string) => {
    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        avatarUrl: true,
        creadoEn: true,
      },
    });

    if (!usuario) {
      throw new Error(MENSAJES_AUTH.USUARIO_NO_ENCONTRADO);
    }

    return usuario;
  },
};
