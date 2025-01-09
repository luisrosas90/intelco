import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';

export const POST = async ({ request }) => {
  const { reporteId, accion } = await request.json();

  try {
    const estado = accion === 'verificar' ? 'verificado' : 'rechazado';

    await pool.query(`
      UPDATE reportes_pendientes
      SET estado = ?
      WHERE id = ?
    `, [estado, reporteId]);

    return json({ success: true, message: 'Reporte actualizado exitosamente.' });
  } catch (error) {
    console.error('Error updating report status:', error);
    return json({ success: false, message: 'Error al actualizar el estado del reporte' });
  }
};
