import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
  const cajero_id = locals.user?.id; // Obtener `cajero_id` desde la sesión del usuario autenticado

  if (!cajero_id) {
    return json({ success: false, message: 'Cajero no autenticado.' }, { status: 401 });
  }

  try {
    // Consulta para obtener el historial específico del cajero
    const [rows] = await pool.query(
      'SELECT * FROM historial WHERE cajero_id = ? ORDER BY fecha DESC',
      [cajero_id]
    );

    return json({ success: true, historial: rows });
  } catch (error) {
    console.error('Error al obtener el historial:', error);
    return json({ success: false, message: 'Error al obtener el historial.' }, { status: 500 });
  }
};
