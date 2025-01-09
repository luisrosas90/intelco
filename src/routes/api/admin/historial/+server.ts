import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  const cajero_id = url.searchParams.get('cajero_id');

  if (!cajero_id) {
    return json({ success: false, message: 'Cajero ID es requerido.' }, { status: 400 });
  }

  try {
    // Consultar el historial de operaciones del cajero
    const [historial]: any = await pool.query(
      'SELECT tipo_operacion, monto, motivo, fecha FROM historial_operaciones WHERE cajero_id = ? ORDER BY fecha DESC',
      [cajero_id]
    );

    return json({ success: true, historial });
  } catch (error) {
    console.error('Error fetching historial:', error);
    return json({ success: false, message: 'Error fetching historial.' }, { status: 500 });
  }
};
