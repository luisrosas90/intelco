// src/routes/api/auth/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { cajerosConfig } from '$lib/config/cajeros';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { usuario, clave } = await request.json();

    // Busca el cajero en la configuración
    const cajero = cajerosConfig[usuario];

    // Verifica si el cajero existe y la clave es correcta
    if (!cajero || cajero.clave !== clave) {
      return json({ message: 'Credenciales incorrectas' }, { status: 403 });
    }

    // Si las credenciales son correctas, crear la sesión
    const session = {
      user: cajero.usuario,
      token: cajero.token,
      role: 'cajero'
    };

    // Establecer la cookie de sesión
    return json({ message: 'Autenticado', session }, { status: 200 });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    return json({ message: 'Error en el servidor' }, { status: 500 });
  }
};
