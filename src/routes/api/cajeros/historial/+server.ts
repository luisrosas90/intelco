export const GET = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT cliente_id, monto, metodo_pago, referencia_pago, banco, telefono, created_at 
      FROM reportes_pagos 
      WHERE estado = 'validado'
    `);

    if (rows.length > 0) {
      return json({ success: true, historial: rows });
    } else {
      return json({ success: true, historial: [], message: 'No hay pagos registrados.' });
    }
  } catch (error) {
    console.error('Error al obtener el historial de pagos:', error);
    return json({ success: false, message: 'Error al obtener el historial de pagos.' }, { status: 500 });
  }
};
