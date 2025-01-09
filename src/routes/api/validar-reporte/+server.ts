import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de que la conexión a la DB esté configurada correctamente.

export const POST = async ({ request }) => {
  const { cliente_id, referencia_pago, monto } = await request.json();

  // Validar que los campos no estén vacíos
  if (!cliente_id || !referencia_pago || !monto) {
    return json({ success: false, message: 'Todos los campos son obligatorios.' }, { status: 400 });
  }

  try {
    // Guardar el reporte en la base de datos con el estado "pendiente"
    const [result] = await pool.execute(
      `INSERT INTO reportes_pendientes (cliente_id, referencia_pago, monto, estado) VALUES (?, ?, ?, 'pendiente')`,
      [cliente_id, referencia_pago, monto]
    );

    // Verificar que la inserción fue exitosa y devolver el ID del reporte
    const insertId = (result as any).insertId;

    if (!insertId) {
      throw new Error('Error al obtener el ID del reporte insertado');
    }

    return json({ success: true, reporteId: insertId });
  } catch (error) {
    console.error('Error al crear el reporte pendiente:', error);
    return json({ success: false, message: 'Error al crear el reporte' });
  }
};
