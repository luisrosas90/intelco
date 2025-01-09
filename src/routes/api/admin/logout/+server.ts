// /src/routes/api/admin/logout/+server.ts
import { redirect } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
  // Elimina la cookie de sesión
  cookies.delete('session', { path: '/' });

  // Redirige al login
  redirect(303, '/admin/login');
};
