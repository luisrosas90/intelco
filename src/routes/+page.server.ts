// src/routes/+page.server.ts
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

    // Buscar el usuario en la configuración de cajeros usando find()
    const cajero = Object.values(cajerosConfig).find(c => c.usuario === usuario);

    console.log("cajero object:", cajero);
    if (!cajero || cajero.clave !== clave) {
      return fail(400, { error: 'Usuario o clave incorrectos' });
    }

    // Crear cookie de sesión
    const sessionData = JSON.stringify({
      userId: cajero.id, // Asegúrate de que sessionData SIEMPRE incluye userId
      user: cajero.usuario,
      token: cajero.token,
      role: 'cajero'
    });

    // Configurar la cookie
    cookies.set('session', sessionData, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24
    });

    console.log('Cookie de sesión creada:', sessionData);

    // Redirigir al dashboard del cajero
    redirect(303, `/${cajero.usuario}/dashboard`);
  }
};