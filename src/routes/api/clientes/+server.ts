// src/routes/api/clientes/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import { cajerosConfig } from '$lib/config/cajeros';

const API_URL_CLIENT = 'https://billing.corpintelco.com/api/v1/GetClientsDetails';
const API_URL_DEBT = 'https://billing.corpintelco.com/facilito/consultadeuda';

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { cedula } = await request.json();
    console.log("Cedula recibida:", cedula);

    if (!cedula) {
      return json({ mensaje: 'Cédula es un campo obligatorio.' }, { status: 400 });
    }

    const sessionCookie = cookies.get('session');
    console.log("Cookie de sesión:", sessionCookie);
    if (!sessionCookie) {
      return json({ mensaje: 'Sesión no encontrada.' }, { status: 403 });
    }

    let session;
    try {
      session = JSON.parse(sessionCookie);
    } catch (error) {
      return json({ mensaje: 'Error al procesar la sesión.' }, { status: 500 });
    }
    console.log("Sesión parseada:", session);

    const cajero = cajerosConfig[session.user as keyof typeof cajerosConfig];
    console.log("Cajero encontrado:", cajero);
    if (!cajero) {
      return json({ mensaje: 'Usuario no autorizado.' }, { status: 403 });
    }

    const TOKEN = cajero.token;
    console.log("Token usado:", TOKEN);

    const [clientResponse, debtResponse] = await Promise.all([
      fetch(API_URL_CLIENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, cedula }),
      }),
      fetch(API_URL_DEBT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: TOKEN, cedula }),
      }),
    ]);

    if (!clientResponse.ok || !debtResponse.ok) {
      return json({ mensaje: 'Error al consultar las APIs externas.' }, { status: 500 });
    }

    const clientData = await clientResponse.json();
    const debtData = await debtResponse.json();

    console.log('Respuesta de API_URL_CLIENT:', clientData);
    console.log('Respuesta de API_URL_DEBT:', debtData);

    // Prueba manual (simulada aquí, pero deberías hacerla con Postman/Insomnia):
    console.log("--- Inicia prueba manual de API_URL_DEBT con Postman/Insomnia ---");
    console.log("URL:", API_URL_DEBT);
    console.log("Método: POST");
    console.log("Headers: {'Content-Type': 'application/json'}");
    console.log("Cuerpo:", JSON.stringify({ token: TOKEN, cedula }));
    console.log("--- Fin de la simulación de prueba manual ---");

    if (clientData.estado === 'exito' && clientData.datos.length > 0 && debtData.code === '000' && debtData.facturas.length > 0) {
      const client = clientData.datos[0];
      const debt = debtData.facturas;

      try {
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
            client.nombre,
            client.telefono,
            client.direccion_principal,
          ]
        );

        return json({ client, debt });
      } catch (dbError) {
        console.error("Error en la base de datos:", dbError);
        return json({ mensaje: 'Error al interactuar con la base de datos.' }, { status: 500 });
      }
    } else {
      return json({ mensaje: 'No se encontraron datos del cliente o deudas.' }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return json({ mensaje: 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.' }, { status: 500 });
  }
};