// src/routes/api/payments/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const API_URL = 'https://billing.corpintelco.com/api/v1/PaidInvoice';
const TOKEN = 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09'; // Token de acceso a la API

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { IDFactura, valor, fecha, secuencial } = await request.json();
    console.log('Datos recibidos:', { IDFactura, valor, fecha, secuencial });

    if (!IDFactura || !valor || !fecha || !secuencial) {
      return json({ mensaje: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    const payload = {
      token: TOKEN,
      idfactura: IDFactura,
      pasarela: 'Paypal', // o el valor correspondiente que estás usando
      cantidad: valor,
      idtransaccion: secuencial
    };

    console.log('Payload a enviar:', payload);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Respuesta de la API externa:', response.status);

    const data = await response.json();
    console.log('Datos de respuesta de la API externa:', data);

    if (data.estado === 'exito') {
      return json({ mensaje: 'Pago registrado exitosamente.' });
    } else {
      return json({ mensaje: data.mensaje || 'Error al registrar el pago.' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error en el servidor:', error);
    return json({ mensaje: 'Error en el servidor. Por favor, inténtalo de nuevo más tarde.' }, { status: 500 });
  }
};

