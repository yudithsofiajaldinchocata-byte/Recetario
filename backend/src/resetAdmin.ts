import bcrypt from 'bcryptjs';
import { prisma } from './config/prisma.js';

async function resetAdmin() {
  const passwordHash = await bcrypt.hash('123456', 10);
  const usuario = await prisma.usuario.upsert({
    where: { email: 'admin@recetario.com' },
    update: {
      passwordHash,
      rol: 'ADMIN',
    },
    create: {
      nombre: 'Chef Administrador',
      email: 'admin@recetario.com',
      passwordHash,
      rol: 'ADMIN',
    },
  });

  console.log('Usuario admin reseteado con éxito:', usuario.email);
}

resetAdmin()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
