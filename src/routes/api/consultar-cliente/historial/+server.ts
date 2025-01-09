// src/routes/api/consultar-cliente/historial/+server.ts
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Conexión a la base de datos

export const POST = async ({ request }) => {
  try {
    const { clienteId, descripcion, monto, cajeroId } = await request.json();

    // Verificación de campos obligatorios
    if (!clienteId || !descripcion || !monto) {
      return json({ success: false, message: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // Si no se pasa cajeroId, usa NULL como predeterminado
    const [result]: any = await pool.execute(
      'INSERT INTO historial (cliente_id, cajero_id, descripcion, monto) VALUES (?, ?, ?, ?)',
      [clienteId, cajeroId || null, descripcion, monto]
    );

    return json({ success: true, message: 'Pago registrado en el historial', id: result.insertId });
  } catch (error) {
    console.error('Error al registrar el historial:', error);
    return json({ success: false, message: 'Error al registrar el historial.' }, { status: 500 });
  }
};
