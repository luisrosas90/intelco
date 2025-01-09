// GET: Obtener reportes pendientes
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export const GET = async () => {
  try {
    const [rows] = await pool.query('SELECT * FROM reportes_pendientes WHERE estado = "pendiente"');

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error al obtener los reportes pendientes:', error);
    return json({ success: false, message: 'Error al obtener los reportes.' });
  }
};
