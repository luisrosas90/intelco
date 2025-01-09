import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { ResultSetHeader } from 'mysql2';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { clienteId, monto, metodo_pago, referencia_pago, fecha } = await request.json();

    if (!clienteId || !monto || !metodo_pago || !referencia_pago || !fecha) {
      return json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO reportes (cliente_id, monto, metodo_pago, referencia_pago, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [clienteId, monto, metodo_pago, referencia_pago, fecha]
    );

    // Verifica que se haya insertado correctamente
    if (result.affectedRows === 1) {
      return json({ message: 'Reporte insertado correctamente', reportId: result.insertId }, { status: 201 });
    } else {
      return json({ message: 'Error al insertar el reporte' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error al insertar el reporte:', error);
    return json({ message: 'Error al insertar el reporte' }, { status: 500 });
  }
};
