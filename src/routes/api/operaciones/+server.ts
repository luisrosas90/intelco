// src/routes/api/operaciones/+server.ts
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { ResultSetHeader } from 'mysql2';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { clienteId, tipoOperacion, monto, motivo, fecha } = await request.json();

    if (!clienteId || !tipoOperacion || !monto || !motivo || !fecha) {
      return json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO operaciones (cliente_id, tipo_operacion, monto, motivo, fecha)
       VALUES (?, ?, ?, ?, ?)`,
      [clienteId, tipoOperacion, monto, motivo, fecha]
    );

    return json({ message: 'Operación insertada correctamente', operationId: result.insertId }, { status: 201 });
  } catch (error) {
    console.error('Error al insertar la operación:', error);
    return json({ message: 'Error al insertar la operación' }, { status: 500 });
  }
};
