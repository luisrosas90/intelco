// src/routes/api/pagos/procesar-pago/+server.ts
import { json } from '@sveltejs/kit';
import { pool } from '$lib/db'; // Asegúrate de que la conexión a la base de datos esté correctamente configurada

// Función para procesar el pago con la API externa
const procesarPagoConApiExterna = async (idFactura: number, valor: number) => {
  const apiUrl = 'https://billing.corpintelco.com/api/v1/PaidInvoice';
  const token = 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09'; // Token de acceso a la API externa

  const body = {
    token,
    idfactura: idFactura,
    cantidad: valor,
    pasarela: 'Pago Móvil' // Aquí puedes personalizar el método de pago según sea necesario
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al llamar a la API externa:', error);
    throw new Error('Error al procesar el pago en la API externa.');
  }
};

export const POST = async ({ request }) => {
  try {
    const { idFactura, valor } = await request.json();

    console.log('Datos recibidos en el backend:', { idFactura, valor });

    // Validación de datos
    if (!idFactura || !valor) {
      console.error('Error: Todos los campos son obligatorios.');
      return json({ success: false, message: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // Llamar a la función para procesar el pago con la API externa
    const externalApiResponse = await procesarPagoConApiExterna(idFactura, valor);

    console.log('Respuesta de la API externa:', externalApiResponse);

    // Aquí manejarías la respuesta de la API y el resultado
    if (externalApiResponse.estado === 'exito') {
      // Actualizar en la base de datos el estado del pago, usando factura_id en lugar de id_factura
      const [result] = await pool.execute(
        `UPDATE reportes_pagos SET estado = 'procesado' WHERE factura_id = ?`, // Cambié id_factura a factura_id
        [idFactura]
      );

      return json({ success: true, message: 'Pago procesado correctamente.' });
    } else {
      return json({ success: false, message: 'Error al procesar el pago con la API externa.' });
    }

  } catch (error) {
    console.error('Error en el backend al procesar el pago:', error);
    return json({ success: false, message: 'Error al procesar el pago.' }, { status: 500 });
  }
};
