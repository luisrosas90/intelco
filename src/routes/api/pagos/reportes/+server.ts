import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de que la conexión a la base de datos esté correctamente configurada

// GET: Obtener reportes pendientes de validación
export const GET = async () => {
  try {
    const [rows] = await pool.execute(`
      SELECT id, cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco
      FROM reportes_pagos 
      WHERE estado = 'pendiente de validación'
    `);

    console.log('Reportes pendientes obtenidos:', rows);

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

// POST: Procesar reporte de pago
export const POST = async ({ request }) => {
  try {
    const { clienteId, nombreCliente, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono } = await request.json();

    console.log('Datos recibidos para reporte de pago:', {
      clienteId,
      nombreCliente,
      montoEnUsd,
      facturaId,
      selectedMethod,
      referenceNumber,
      banco,
      telefono
    });

    // Verificación de campos
    if (!clienteId || !nombreCliente || !montoEnUsd || !facturaId || !referenceNumber || !banco || !telefono) {
      return json({ success: false, message: 'Faltan datos obligatorios.' }, { status: 400 });
    }

    // Insertar reporte de pago en la base de datos
    const estado = 'pendiente de validación';
    const [result] = await pool.execute(
      `
        INSERT INTO reportes_pagos (cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [clienteId, selectedMethod, montoEnUsd, facturaId, estado, referenceNumber, 'USD', telefono, banco]
    );

    console.log('Reporte de pago registrado en la base de datos:', result);

    return json({ success: true, message: 'Reporte de pago registrado correctamente.' });
  } catch (error) {
    console.error('Error al procesar el reporte de pago:', error);
    return json({ success: false, message: 'Error al procesar el reporte de pago.' }, { status: 500 });
  }
};
