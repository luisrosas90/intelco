// src/routes/api/cajeros/historial/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export const GET: RequestHandler = async ({ cookies }) => {
  try {
    const sessionCookie = cookies.get('session');
    console.log('Verificando cookie de sesión...');
    if (!sessionCookie) {
      console.log('Cookie de sesión no encontrada.');
      return json({ error: 'No se encontró la sesión.' }, { status: 401 });
    }

    console.log('Cookie de sesión encontrada:', sessionCookie);
    const session = JSON.parse(sessionCookie);

    if (session.role !== 'cajero') {
      console.log('Rol de usuario no válido:', session.role);
      return json({ error: 'Acceso no autorizado.' }, { status: 403 });
    }

    console.log('Rol de usuario encontrado en la sesión:', session.role);
    console.log('Acceso permitido para el usuario:', session.user);

    // Filtrar por id_cajero y obtener solo los campos necesarios
    const [rows] = await pool.execute(
      `SELECT
        fecha,
        monto_bs,
        metodo_pago,
        referencia,
        banco,
        telefono
      FROM pagos
      WHERE id_cajero = ?
      ORDER BY fecha DESC`,
      [session.user]
    );

    console.log('Historial de pagos obtenido:', rows);

    return json({ historial: rows });
  } catch (error) {
    console.error('Error al obtener el historial de pagos:', error);
    return json({ error: 'Hubo un error al obtener el historial de pagos.' }, { status: 500 });
  }
};