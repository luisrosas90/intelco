import { pool } from '../../../../lib/db';
import { json } from '@sveltejs/kit';


export const POST = async ({ request }) => {
  const { idPago } = await request.json();

  try {
    // Actualizar el estado del pago en la base de datos
    await pool.query(`
      UPDATE reportes_pagos
      SET estado = 'procesado'
      WHERE id = ?
    `, [idPago]);

    return json({ success: true, message: 'Pago validado exitosamente.' });
  } catch (error) {
    console.error('Error al validar el pago:', error);
    return json({ success: false, message: 'Error al validar el pago.' });
  }
};
