// /src/routes/api/admin/reportes-clientes/+server.ts
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';

export const GET = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT id, cliente_id, monto, referencia_pago, estado, fecha_reporte
      FROM reportes_pendientes
      WHERE estado = 'pendiente'
    `);

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error fetching pending reports:', error);
    return json({ success: false, message: 'Error al obtener reportes' }, { status: 500 });
  }
};
