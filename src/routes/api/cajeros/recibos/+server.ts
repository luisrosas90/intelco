import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export const GET = async () => {
  try {
    // Consulta a la base de datos para obtener los recibos
    const [rows] = await pool.execute(`
      SELECT id, cliente_id, metodo_pago, monto, referencia_pago, created_at
      FROM recibos
      WHERE DATE(created_at) = CURDATE()
    `);

    if (rows.length > 0) {
      return json({ success: true, recibos: rows });
    } else {
      return json({ success: true, recibos: [], message: 'No hay recibos generados hoy.' });
    }
  } catch (error) {
    console.error('Error al obtener los recibos:', error);
    return json({ success: false, message: 'Error al obtener los recibos.' }, { status: 500 });
  }
};
