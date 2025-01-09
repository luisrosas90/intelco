import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';

const API_URL = 'https://billing.corpintelco.com/api/v1/PaidInvoice';
const TOKEN = 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09'; // Token de acceso a la API

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { IDFactura, valor, fecha, secuencial, pasarela } = await request.json();
    console.log('Datos recibidos:', { IDFactura, valor, fecha, secuencial, pasarela });

    if (!IDFactura || !valor || !fecha || !secuencial || !pasarela) {
      return json({ mensaje: 'Todos los campos son obligatorios.' }, { status: 400 });
    }

    // Preparamos el payload para la API externa
    const payload = {
      token: TOKEN,
      idfactura: IDFactura,
      pasarela, // 'Paypal', 'Zelle', etc., dependiendo de la pasarela de pago seleccionada
      cantidad: valor,
      idtransaccion: secuencial,
    };

    console.log('Payload a enviar:', payload);

    // Enviamos la solicitud a la API externa
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('Respuesta de la API externa:', response.status);

    // Procesamos la respuesta de la API externa
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
