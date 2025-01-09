// src/routes/api/caja/cierre/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { cajero_id, monto } = await request.json();

    const [result] = await pool.execute(
      `INSERT INTO caja (cajero_id, tipo, monto) VALUES (?, 'cierre', ?)`,
      [cajero_id, monto]
    );

    return json({ mensaje: 'Cierre de caja registrado exitosamente.', result });
  } catch (error) {
    console.error('Error al registrar el cierre de caja:', error);
    return json({ mensaje: 'Error al registrar el cierre de caja.' }, { status: 500 });
  }
};
