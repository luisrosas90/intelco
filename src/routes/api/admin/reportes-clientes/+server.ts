// /api/admin/reportar-pago/+server.ts
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export const POST = async ({ request }) => {
  const { clienteId, idFactura, descripcion, monto } = await request.json();

  if (!clienteId || !idFactura || !monto) {
    return json({ success: false, message: 'Faltan datos obligatorios' }, { status: 400 });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO reportes_pagos (id_cajero, cliente_id, metodo_pago, monto, monto_bs, factura_id, estado, referencia_pago, moneda, telefono, banco, created_at) VALUES (?, ?, ?, ?, ?)',
      [clienteId, idFactura, descripcion, monto, 'pendiente de validación']
    );

    return json({ success: true, message: 'Pago validado exitosamente.' });
  } catch (error) {
    console.error('Error al registrar el pago en la base de datos:', error);
    return json({ success: false, message: 'Error al registrar el pago.' }, { status: 500 });
  }
};
