import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de que la conexión a la base de datos esté correctamente configurada
import { cajerosConfig } from '$lib/config/cajeros'; // Configuración de los cajeros

const API_URL_CLIENT = 'https://billing.corpintelco.com/api/v1/GetClientsDetails';
const API_URL_DEBT = 'https://billing.corpintelco.com/facilito/consultadeuda';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { cedula } = await request.json();

    // Validación de entrada
    if (!cedula) {
      return json({ mensaje: 'Cédula es un campo obligatorio.' }, { status: 400 });
    }

    // Obtener la cookie de sesión
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return json({ mensaje: 'Sesión no encontrada.' }, { status: 403 });
    }

    // Parsear la cookie de sesión
    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch (error) {
      return json({ mensaje: 'Error al procesar la sesión.' }, { status: 500 });
    }

    // Verificar si el usuario está en cajerosConfig
    const cajero = cajerosConfig[session.user as keyof typeof cajerosConfig]; // Se añade tipado para session.user
    if (!cajero) {
      return json({ mensaje: 'Usuario no autorizado.' }, { status: 403 });
    }

    const TOKEN = cajero.token; // Token dinámico basado en el cajero autenticado

    // Consulta a las APIs externas con el token dinámico del cajero
    const [clientResponse, debtResponse] = await Promise.all([
      fetch(API_URL_CLIENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, cedula }), // Usar el token del cajero
      }),
      fetch(API_URL_DEBT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, cedula }), // Usar el token del cajero
      }),
    ]);

    if (!clientResponse.ok || !debtResponse.ok) {
      return json({ mensaje: 'Error al consultar las APIs externas.' }, { status: 500 });
    }

    const clientData = await clientResponse.json();
    const debtData = await debtResponse.json();

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

        return json({ client, debt });
      } catch (dbError) {
        return json({ mensaje: 'Error al interactuar con la base de datos.' }, { status: 500 });
      }
    } else {
      return json({ mensaje: 'No se encontraron datos del cliente o deudas.' }, { status: 404 });
    }
  } catch (error) {
    return json({ mensaje: 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.' }, { status: 500 });
  }
};
