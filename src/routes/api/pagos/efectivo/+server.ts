import type { RequestHandler } from './$types';
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import { cajerosConfig } from '$lib/config/cajeros'; // Importar la configuración de cajeros

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        // Obtener la cookie de sesión
        const sessionCookie = cookies.get('session');
        if (!sessionCookie) {
            return json({ message: 'Sesión no encontrada' }, { status: 401 });
        }

        let session;
        try {
            session = JSON.parse(sessionCookie);
        } catch (err) {
            console.error('Error al parsear la cookie de sesión:', err);
            return json({ message: 'Error al procesar la sesión' }, { status: 400 });
        }

        console.log('Sesión parseada:', session);

        // Obtener los datos del cajero desde la configuración
        const cajero = cajerosConfig[session.user];
        if (!cajero) {
            return json({ message: `El usuario ${session.user} no corresponde a un cajero válido.` }, { status: 400 });
        }

        console.log('Cajero identificado:', cajero);

        // Validar que el cajero tenga un ID y un token válido
        const { id: idCajero, token } = cajero;
        if (!idCajero || !token) {
            return json({ message: `El cajero ${session.user} no tiene un ID o token válido.` }, { status: 400 });
        }

        // Parsear el cuerpo de la solicitud
        const payload = await request.json();
        const {
            clienteId,
            nombreCliente,
            montoEnUsd,
            facturaId,
            selectedMethod,
            referenceNumber,
            banco,
            telefono,
            cedula,
            selectedCurrency,
            valorEnBsConImpuesto,
            valorEnBs
        } = payload;

        // Validar los parámetros obligatorios
        if (
            [clienteId, nombreCliente, facturaId, selectedMethod, cedula, selectedCurrency].some(param => param === undefined)
        ) {
            return json({ message: 'Faltan parámetros obligatorios en la solicitud' }, { status: 400 });
        }

        // Calcular monto en bolívares
        let montoBs: number | undefined;
        if (selectedCurrency === 'BS') {
            montoBs = valorEnBsConImpuesto;
        } else if (selectedCurrency === 'USD') {
            montoBs = valorEnBs;
        }

        if (montoBs === undefined) {
            return json({ message: 'El monto en BS no se ha calculado correctamente' }, { status: 400 });
        }

        console.log('Datos para registrar el pago:', {
            idCajero,
            clienteId,
            facturaId,
            montoEnUsd,
            montoBs,
            selectedMethod,
            referenceNumber,
            banco,
            telefono
        });

        // Insertar el pago en la base de datos
        const [result] = await pool.execute(
            `INSERT INTO pagos (id_cajero, cliente_id, factura_id, monto_usd, monto_bs, metodo_pago, referencia, banco, telefono, fecha)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
            [idCajero, clienteId, facturaId, montoEnUsd, montoBs, selectedMethod, referenceNumber, banco, telefono]
        );

        console.log('Pago registrado en la base de datos:', result);

        // Llamar a la API externa usando el token del cajero
        const paymentPayload = {
            token, // Usar el token del cajero
            idfactura: facturaId,
            pasarela: selectedMethod,
            cantidad: montoEnUsd || null,
            comision: 0,
            idtransaccion: `T-${facturaId}-${Date.now()}`,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        console.log('Enviando solicitud a la API externa:', paymentPayload);

// Comentar temporalmente el llamado a la API externa
 const response = await fetch('https://billing.corpintelco.com/api/v1/PaidInvoice', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(paymentPayload)
});

const apiResponse = await response.json();
if (apiResponse.estado === 'exito') {
  console.log('Factura marcada como pagada en la API externa.');
  return json({ message: 'Pago registrado correctamente y factura marcada como pagada.' });
} else {
  console.error('Error al registrar el pago en la API externa:', apiResponse.mensaje);
  throw new Error(apiResponse.mensaje || 'Error desconocido en la API externa.');
}
} catch (error) {
console.error('Error al procesar el pago:', error);
return json({ message: `Error al procesar el pago: ${error instanceof Error ? error.message : 'Error desconocido.'}` }, { status: 500 });
}
};