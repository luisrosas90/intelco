// src/routes/api/admin/validar-reporte/+server.ts
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import { procesarPagoConApiExterna } from '$lib/api'; // Importa la función

export const POST = async ({ request }) => {
  try {
    const { reporteId, accion } = await request.json();

    if (accion !== 'validar') {
      return json({ success: false, message: 'Acción no válida.' }, { status: 400 });
    }

    // Obtiene el reporte de pago desde la base de datos
    const [reporte] = await pool.execute('SELECT * FROM reportes_pagos WHERE id = ?', [reporteId]);

    if (!reporte || reporte.length === 0) {
      return json({ success: false, message: 'Reporte no encontrado.' }, { status: 404 });
    }

    const pago = reporte[0];

    // Llama a la API externa para procesar el pago si es necesario
    const apiResponse = await procesarPagoConApiExterna(pago.factura_id, pago.monto, pago.metodo_pago);

    if (apiResponse && apiResponse.estado === 'exito') {
      // Actualiza el estado del pago a "procesado" en la base de datos
      await pool.execute('UPDATE reportes_pagos SET estado = ? WHERE id = ?', ['procesado', reporteId]);

      return json({ success: true, message: 'Pago validado correctamente.' });
    } else {
      return json({ success: false, message: 'Error al procesar el pago en la API externa.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error al validar el pago:', error);
    return json({ success: false, message: 'Error al validar el pago.' }, { status: 500 });
  }
};
