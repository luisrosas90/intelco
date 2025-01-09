import { pool } from '$lib/db'; // Asegúrate de que la conexión a la base de datos esté configurada
import { json } from '@sveltejs/kit';
import { cajerosConfig } from '$lib/config/cajeros';

export const POST = async ({ request, cookies }) => {
  try {
    const { clienteId, nombreCliente, montoEnUsd, facturaId } = await request.json();

    // Verificar la cookie de sesión
    const sessionCookie = cookies.get('session');
    if (!sessionCookie) {
      return json({ message: 'Sesión no encontrada' }, { status: 401 });
    }

    // Obtener datos de la sesión y verificar el cajero
    const session = JSON.parse(sessionCookie);
    const cajero = cajerosConfig[session.user]; // Aquí usamos la config de cajeros

    if (!cajero || !cajero.token) {
      return json({ message: 'Token del API no encontrado para el cajero' }, { status: 400 });
    }

    const token = cajero.token;

    // Insertar el pago en la base de datos
    const [result] = await pool.execute(
      `INSERT INTO reportes_pagos (cliente_id, metodo_pago, monto, factura_id, estado, moneda)
       VALUES (?, 'Efectivo', ?, ?, 'procesado', 'USD')`,
      [clienteId, montoEnUsd, facturaId]
    );

    console.log('Pago en efectivo registrado en la base de datos:', result);

    // Aquí procesamos el pago en la API externa con el token del cajero
    const response = await fetch('https://billing.corpintelco.com/api/v1/PaidInvoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        idfactura: facturaId,
        pasarela: 'Efectivo',
        cantidad: montoEnUsd,
        idtransaccion: `T-${facturaId}-${Date.now()}`
      })
    });

    const apiResponse = await response.json();
    console.log('Respuesta de la API externa:', apiResponse);

    if (apiResponse.estado === 'exito') {
      return json({ message: 'Pago registrado correctamente' });
    } else {
      throw new Error(apiResponse.mensaje || 'Error en la API externa.');
    }
  } catch (error) {
    console.error('Error al procesar el pago en efectivo:', error);
    return json({ message: `Error al procesar el pago en efectivo: ${error.message}` }, { status: 500 });
  }
};
