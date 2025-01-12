// src/routes/api/auth/logout/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ cookies }) => {
  // Eliminar la cookie de sesión
  cookies.delete('session', { path: '/' });

  return json({ message: 'Sesión cerrada correctamente' });
};
