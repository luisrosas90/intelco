import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de tener una conexión a la base de datos.

export const GET = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco 
      FROM reportes_pagos 
      WHERE estado = 'pendiente de validación'
    `);

    if (rows.length > 0) {
      return json({ success: true, reportes: rows });
    } else {
      return json({ success: true, reportes: [], message: 'No hay reportes pendientes.' });
    }
  } catch (error) {
    console.error('Error al obtener reportes pendientes:', error);
    return json({ success: false, message: 'Error al obtener reportes pendientes.' }, { status: 500 });
  }
};
