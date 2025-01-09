// src/routes/logout/+server.ts
import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
  // Asegúrate de que la cookie de sesión se borre correctamente
  cookies.delete('session', { path: '/' });

  // Devuelve una respuesta exitosa
  return json({ success: true });
};
