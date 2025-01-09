// /src/routes/api/admin/reportes-cajeros/+server.ts
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';

export const GET = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT id, cajero_id, tipo, monto, fecha
      FROM caja
    `);

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error fetching cashier reports:', error);
    return json({ success: false, message: 'Error al obtener reportes de cajeros' }, { status: 500 });
  }
};
