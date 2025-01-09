import { fail, redirect } from '@sveltejs/kit';
import { cajerosConfig } from '$lib/config/cajeros';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    const usuario = formData.get('usuario') as string;
    const clave = formData.get('clave') as string;

    console.log('Usuario recibido:', usuario);
    console.log('Clave recibida:', clave);

    // Verificar si el usuario existe en la configuración de cajeros
    const cajero = cajerosConfig[usuario];
    if (!cajero || cajero.clave !== clave) {
      return fail(400, { error: 'Usuario o clave incorrectos' });
    }

    // Crear cookie de sesión
    const sessionData = JSON.stringify({
      user: cajero.usuario,
      token: cajero.token,
      role: 'cajero'
    });

    // Configurar la cookie
    cookies.set('session', sessionData, {
      path: '/',              // Asegura que sea accesible desde toda la aplicación
      httpOnly: true,         // Asegura que la cookie no sea accesible desde el cliente (solo servidor)
      sameSite: 'strict',     // Previene el envío de la cookie a otros sitios
      secure: false, // Solo en HTTPS en producción
      maxAge: 60 * 60 * 24    // La cookie durará 24 horas
    });

    console.log('Cookie de sesión creada:', sessionData);

    // Redirigir al dashboard del cajero
    redirect(303, `/${cajero.usuario}/dashboard`);
  }
};
