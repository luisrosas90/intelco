import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2';

export const GET = async () => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT id, cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco
      FROM reportes_pagos
      WHERE estado = 'pendiente de validación'
    `);

    console.log('Reportes pendientes obtenidos:', rows);

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error al obtener los reportes pendientes:', error);
    return json({ success: false, message: 'Error al obtener los reportes.' }, {status: 500});
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
      await pool.execute(
        `
          UPDATE reportes_pagos
          SET estado = 'procesado'
          WHERE id = ?
        `, [reporteId]
      );

      return json({ success: true, message: 'Reporte validado correctamente.' });
    }

    return json({ success: false, message: 'Acción no válida.' }, { status: 400 });
  } catch (error) {
    console.error('Error al validar el reporte:', error);
    return json({ success: false, message: 'Error al validar el reporte.' }, { status: 500 });
  }
};