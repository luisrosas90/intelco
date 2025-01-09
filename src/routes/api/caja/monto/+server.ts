// src/routes/api/caja/monto/+server.ts
import { json } from '@sveltejs/kit';
import { obtenerMontoDeCaja } from '../../../../lib/utils/caja'; // Ajusta la ruta si es necesario

export const GET = async ({ url }) => {
  try {
    const cajero_id = url.searchParams.get('cajero_id');

    if (!cajero_id) {
      return json({ error: 'No se proporcionó un ID de cajero.' }, { status: 400 });
    }

    // Llamar a la función obtenerMontoDeCaja
    const monto = await obtenerMontoDeCaja(cajero_id);

    return json({ monto });
  } catch (error) {
    console.error('Error al obtener el monto de caja:', error);
    return json({ error: 'Hubo un problema al obtener el monto de caja.' }, { status: 500 });
  }
};
