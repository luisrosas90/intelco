///api/admin/reportes/+server.ts
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import type { RequestHandler } from './$types';
import type { RowDataPacket } from 'mysql2';

export const GET = async () => {
  try {
    const [rows] = await pool.execute<RowDataPacket[]>(`
      SELECT rp.id, rp.cliente_id, rp.metodo_pago, rp.monto, rp.monto_bs, rp.factura_id, rp.estado, rp.referencia_pago, rp.moneda, rp.telefono, rp.banco, rp.created_at, c.nombre AS nombre_cajero
      FROM reportes_pagos rp
      INNER JOIN cajeros c ON rp.id_cajero = c.id
      WHERE rp.estado = 'pendiente de validación'
    `);

    console.log('Reportes pendientes obtenidos:', rows);

    return json({ success: true, reportes: rows });
  } catch (error) {
    console.error('Error al obtener los reportes pendientes:', error);
    return json({ success: false, message: 'Error al obtener los reportes.' }, {status: 500});
  }
};