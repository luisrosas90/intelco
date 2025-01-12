// src/routes/[cajero]/dashboard/+layout.server.ts
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
  const sessionCookie = cookies.get('session');

  if (!sessionCookie) {
    console.log('No se encontró cookie de sesión, redirigiendo a /login');
    throw redirect(303, '/login');
  }

  let session;
  try {
    session = JSON.parse(sessionCookie);
  } catch (error) {
    console.error('Error al parsear la cookie de sesión:', error);
    throw redirect(303, '/login');
  }

  if (!session || session.role !== 'cajero') {
    throw redirect(303, '/login');
  }

  console.log('Acceso permitido para el usuario:', session.user);

  return {
    user: session.user
  };
};
