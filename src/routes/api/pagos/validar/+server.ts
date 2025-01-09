// src/routes/api/pagos/validar/+server.ts
import { pool } from '$lib/db'; // Conexión a la base de datos
import { json } from '@sveltejs/kit';

// Procesar pagos
export const POST = async ({ request }) => {
  try {
    const { clienteId, nombreCliente, montoEnUsd, facturaId, selectedMethod, referenceNumber, cajero_id } = await request.json();

    console.log('Datos recibidos en el backend:', {
      clienteId, nombreCliente, montoEnUsd, facturaId, selectedMethod, referenceNumber, cajero_id
    });

    if (!clienteId || !nombreCliente || !montoEnUsd || !facturaId || !cajero_id) {
      return json({ success: false, message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    // Insertar el pago en la base de datos junto con el `cajero_id`
    const estado = selectedMethod === 'Efectivo' ? 'procesado' : 'pendiente de validación';
    const [result] = await pool.execute(
      `
      INSERT INTO reportes_pagos (cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, cajero_id, moneda)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [clienteId, selectedMethod, montoEnUsd, facturaId, estado, referenceNumber || '', cajero_id, 'USD']
    );

    return json({ success: true, message: 'Pago registrado correctamente.' });
  } catch (error) {
    console.error('Error al procesar el pago:', error);
    return json({ success: false, message: 'Error al procesar el pago.' }, { status: 500 });
  }
};
