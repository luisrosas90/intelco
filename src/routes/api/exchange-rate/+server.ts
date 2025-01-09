// src/routes/api/exchange-rate/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import axios from 'axios';

export const GET: RequestHandler = async () => {
  try {
    const response = await axios.get('https://pydolarve.org/api/v1/dollar?page=bcv');
    const data = response.data;

    if (data && data.monitors && data.monitors.provincial) {
      const exchangeRate = data.monitors.provincial.price;
      return json({ exchangeRate });
    } else {
      console.error('Error: estructura de respuesta inesperada.', data);
      return json(
        { message: 'Error al obtener el tipo de cambio: estructura de respuesta inesperada.' },
        { status: 500 }
      );
    }
  } catch (error) {
    // Verificamos si el error es una instancia de Error
    if (error instanceof Error) {
      console.error('Error al obtener el tipo de cambio:', error.message);
      return json(
        { message: 'Error al obtener el tipo de cambio.', error: error.message },
        { status: 500 }
      );
    } else {
      // Si no es una instancia de Error, manejamos el caso genérico
      console.error('Error desconocido al obtener el tipo de cambio:', error);
      return json(
        { message: 'Error desconocido al obtener el tipo de cambio.' },
        { status: 500 }
      );
    }
  }
};
