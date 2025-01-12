import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';

// GET: Verificar si una factura ya fue reportada
export const GET = async ({ url }) => {
  try {
    const facturaId = url.searchParams.get('facturaId');

    if (!facturaId) {
      return json({ success: false, message: 'Falta el parámetro facturaId' }, { status: 400 });
    }

    const [facturaRows] = await pool.execute<RowDataPacket[]>(
      `SELECT * FROM reportes_pagos WHERE factura_id = ?`,
      [facturaId]
    );

    if (Array.isArray(facturaRows) && facturaRows.length > 0) {
      return json({ reportada: true });
    } else {
      return json({ reportada: false });
    }
  } catch (error) {
    console.error('Error al verificar el estado de la factura:', error);
    return json({ success: false, message: 'Error al verificar el estado de la factura.' }, { status: 500 });
  }
};

// POST: Procesar reporte de pago
export const POST = async ({ request }) => {
    try {
      const { clienteId, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono, cajeroNombre } = await request.json();
      console.log('Datos recibidos del cliente:', { clienteId, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono, cajeroNombre });
  
      // Asignar el nombre del cajero de forma manual o predeterminada
      const cajero = cajeroNombre || '1';
  
      // Verificar si la factura ya ha sido reportada
      const [facturaRows] = await pool.execute<RowDataPacket[]>(
        `SELECT * FROM reportes_pagos WHERE factura_id = ?`,
        [facturaId]
      );
  
      if (Array.isArray(facturaRows) && facturaRows.length > 0) {
        return json({ success: false, message: 'La factura ya fue reportada.', showAlert: true }, { status: 409 });
      }
  
      // Insertar reporte de pago
      const estado = 'pendiente de validación';
      const [result] = await pool.execute<ResultSetHeader>(
        `INSERT INTO reportes_pagos (cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco, id_cajero)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [clienteId, selectedMethod, montoEnUsd, facturaId, estado, referenceNumber, 'USD', telefono, banco, cajero]
      );
  
      console.log('Reporte de pago registrado:', result);
  
      return json({ success: true, message: 'Reporte de pago registrado correctamente.' });
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error al procesar el reporte de pago:', error.message);
      } else {
        console.error('Error desconocido:', error);
      }
      return json({ success: false, message: 'Error al procesar el reporte de pago.' }, { status: 500 });
    }
  };
  
  