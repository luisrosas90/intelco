import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';  // Asegúrate de que tienes este archivo lib/db.ts

// Handler para validar pagos (POST request)
export const POST = async ({ request }) => {
  try {
    const { idPago } = await request.json();
    
    if (!idPago) {
      return json({ success: false, mensaje: 'ID del pago no proporcionado.' }, { status: 400 });
    }

    // Actualizamos el estado del pago a 'validado'
    const [result]: any = await pool.query('UPDATE pagos SET estado = "validado" WHERE id = ?', [idPago]);

    // Verificamos si se afectaron filas con la actualización
    if (result.affectedRows > 0) {
      return json({ success: true, mensaje: 'Pago validado exitosamente.' });
    } else {
      return json({ success: false, mensaje: 'No se encontró el pago con el ID proporcionado.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error al validar el pago:', error);
    return json({ success: false, mensaje: 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.' }, { status: 500 });
  }
};

// Handler para obtener los pagos pendientes (GET request)
export const GET = async () => {
  try {
    // Consultamos los pagos pendientes de validación
    const [pagos]: any = await pool.query('SELECT * FROM pagos WHERE estado = "pendiente"');
    
    return json({ success: true, pagos });
  } catch (error) {
    console.error('Error al obtener los pagos pendientes:', error);
    return json({ success: false, mensaje: 'Error en el servidor. Por favor, inténtelo de nuevo más tarde.' }, { status: 500 });
  }
};
