// src/routes/[cajero]/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import { getUserRoleFromSession } from '$lib/utils/session';

export const load = async ({ cookies }) => {
  console.log('Verificando cookie de sesión...');

  const sessionCookie = cookies.get('session');

  if (!sessionCookie) {
    console.log('No se encontró cookie de sesión, redirigiendo a /login');
    redirect(303, '/login');
  }

  let session;

  try {
    console.log('Cookie de sesión encontrada:', sessionCookie);
    session = JSON.parse(sessionCookie);
  } catch (error) {
    console.error('Error al parsear la cookie de sesión:', error);
    redirect(303, '/login');
  }

  const userRole = getUserRoleFromSession(session);

  if (userRole !== 'cajero') {
    console.error(`Rol inválido (${userRole}), redirigiendo a /login`);
    redirect(303, '/login');
  }

  console.log('Acceso permitido para el usuario:', session.user);
  return {
    user: session.user // Devolver el usuario de la sesión al layout
  };
};
