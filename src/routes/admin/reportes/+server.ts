import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

// Obtener reportes pendientes
export const GET = async () => {
  try {
    const [rows] = await pool.query(`
      SELECT id, cliente_id, monto, referencia_pago, factura_id, moneda
      FROM reportes_pagos
      WHERE estado = 'pendiente de validación'
    `);

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error al obtener reportes pendientes:', error);
    return json({ success: false, message: 'Error al obtener reportes pendientes.' }, { status: 500 });
  }
};

// Validar un reporte y marcarlo como validado
export const POST = async ({ request }) => {
  try {
    const { reporteId, accion } = await request.json();

    if (!reporteId || !accion) {
      return json({ success: false, message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    if (accion === 'validar') {
      await pool.query(`
        UPDATE reportes_pagos
        SET estado = 'procesado'
        WHERE id = ?
      `, [reporteId]);

      return json({ success: true, message: 'Reporte validado correctamente.' });
    }

    return json({ success: false, message: 'Acción no válida.' }, { status: 400 });
  } catch (error) {
    console.error('Error al validar el reporte:', error);
    return json({ success: false, message: 'Error al validar el reporte.' }, { status: 500 });
  }
};
