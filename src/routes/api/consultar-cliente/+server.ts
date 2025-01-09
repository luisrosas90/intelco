import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de que la conexión a la base de datos esté correctamente configurada

const API_URL_CLIENT = 'https://billing.corpintelco.com/api/v1/GetClientsDetails';
const API_URL_DEBT = 'https://billing.corpintelco.com/facilito/consultadeuda';
const FIXED_TOKEN = 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09'; // Token fijo

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { cedula } = await request.json();

    // Validación de entrada
    if (!cedula) {
      return json({ mensaje: 'Cédula es un campo obligatorio.' }, { status: 400 });
    }

    // Consultar las APIs externas simultáneamente con Promise.all()
    const [clientResponse, debtResponse] = await Promise.all([
      fetch(API_URL_CLIENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: FIXED_TOKEN, cedula }),
      }),
      fetch(API_URL_DEBT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: FIXED_TOKEN, cedula }),
      }),
    ]);

    // Verificar si alguna de las respuestas falla
    if (!clientResponse.ok || !debtResponse.ok) {
      return json({ mensaje: 'Error al consultar las APIs externas.' }, { status: 500 });
    }

    // Convertir las respuestas en JSON
    const clientData = await clientResponse.json();
    const debtData = await debtResponse.json();

    // Validar que ambas respuestas tengan datos válidos
    if (clientData.estado === 'exito' && clientData.datos.length > 0 && debtData.code === '000' && debtData.facturas.length > 0) {
      const client = clientData.datos[0];
      const debt = debtData.facturas;

      try {
        // Guardar los datos del cliente en la base de datos
        const [result] = await pool.execute(
          `INSERT INTO clientes (id, nombre, cedula, telefono, direccion)
           VALUES (?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE nombre = ?, telefono = ?, direccion = ?`,
          [
            client.id,
            client.nombre,
            client.cedula,
            client.telefono,
            client.direccion_principal,
            // Valores para el UPDATE
            client.nombre,
            client.telefono,
            client.direccion_principal,
          ]
        );

        // Retornar la información del cliente y las deudas
        return json({ client, debt });
      } catch (dbError) {
        console.error('Error al interactuar con la base de datos:', dbError);
        return json({ mensaje: 'Error al interactuar con la base de datos.' }, { status: 500 });
      }
    } else {
      return json({ mensaje: 'No se encontraron datos del cliente o deudas.' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return json({ mensaje: 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.' }, { status: 500 });
  }
};
