import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { cajero_id, monto, motivo } = await request.json();

    // Insertar el ingreso en efectivo
    await pool.query(
      'INSERT INTO ingresos_efectivo (cajero_id, monto, motivo) VALUES (?, ?, ?)',
      [cajero_id, monto, motivo]
    );

    // Actualizar el saldo de efectivo del cajero
    await pool.query(
      'UPDATE cajeros SET saldo_efectivo = saldo_efectivo + ? WHERE id = ?',
      [monto, cajero_id]
    );

    // Registrar la operación en el historial
    await pool.query(
      'INSERT INTO historial_operaciones (cajero_id, tipo_operacion, monto, motivo) VALUES (?, "Ingreso", ?, ?)',
      [cajero_id, monto, motivo]
    );

    return json({ success: true, message: 'Ingreso de efectivo registrado.' });
  } catch (error) {
    console.error('Error registrando ingreso de efectivo:', error);
    return json({ success: false, message: 'Error registrando ingreso de efectivo.' }, { status: 500 });
  }
};
