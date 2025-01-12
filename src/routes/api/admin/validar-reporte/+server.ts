import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import { procesarPagoConApiExterna } from '$lib/api';
import type { RequestHandler } from './$types';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { reporteId, accion } = await request.json();

    if (!reporteId || !accion) {
      return json({ success: false, message: 'Faltan parámetros requeridos.' }, { status: 400 });
    }

    if (accion !== 'validar') {
      return json({ success: false, message: 'Acción no válida.' }, { status: 400 });
    }

    console.log('Validando reporte:', { reporteId, accion });

    // Consulta para obtener el reporte
    const [reportes] = await pool.execute<RowDataPacket[]>(
      'SELECT * FROM reportes_pagos WHERE id = ?',
      [reporteId]
    );

    if (!reportes || reportes.length === 0) {
      return json({ success: false, message: 'Reporte no encontrado.' }, { status: 404 });
    }

    const pago = reportes[0];
    console.log('Reporte encontrado:', pago);

    // Procesar pago con la API externa
    const apiResponse = await procesarPagoConApiExterna(pago.factura_id, pago.monto, pago.metodo_pago);
    console.log('Respuesta de API externa:', apiResponse);

    if (apiResponse && apiResponse.estado === 'exito') {
      // Actualizar el estado en la base de datos
      const [updateResult] = await pool.execute<ResultSetHeader>(
        'UPDATE reportes_pagos SET estado = ? WHERE id = ?',
        ['procesado', reporteId]
      );

      if (updateResult.affectedRows > 0) {
        return json({ success: true, message: 'Pago validado correctamente.' });
      } else {
        console.error('Error al actualizar el reporte:', updateResult);
        return json({ success: false, message: 'No se pudo actualizar el estado del reporte.' }, { status: 500 });
      }
    } else {
      console.error('Error en la API externa:', apiResponse);
      return json({ success: false, message: 'Error al procesar el pago en la API externa.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error al validar el pago:', error.message, error.stack);
    return json({ success: false, message: 'Error al validar el pago.' }, { status: 500 });
  }
};
