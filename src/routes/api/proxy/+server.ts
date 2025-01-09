import { json } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

// Función auxiliar interna que no se exporta
const _helperFunction = (data: any) => {
    return data;
};

// Manejador para solicitudes POST (envío del mensaje de WhatsApp)
export const POST = async ({ request }: RequestEvent) => {
    try {
        // Leer datos del cuerpo de la solicitud
        const { recipient, nombreCliente, montoEnUsd, banco, referenceNumber, telefono } = await request.json();

        // Validar que los datos esenciales están presentes
        if (!recipient || !nombreCliente || !montoEnUsd || !banco || !referenceNumber || !telefono) {
            return json({ error: 'Faltan datos obligatorios.' }, { status: 400 });
        }

        // Crear el mensaje que se enviará a través de WhatsApp
        const message = `Nuevo pago reportado:
        - Cliente: ${nombreCliente}
        - Monto: ${montoEnUsd} USD
        - Banco: ${banco}
        - Referencia: ${referenceNumber}
        - Teléfono: ${telefono}

        Valida el reporte aquí: https://reporte.corpintelco.com/admin/reportes`;

        // Procesar datos utilizando la función auxiliar
        const processedData = _helperFunction({ recipient, message });

        // Enviar el mensaje de WhatsApp utilizando la función interna
        const whatsappResponse = await sendWhatsAppMessage(processedData);

        if (!whatsappResponse.ok) {
            const errorMessage = await whatsappResponse.json();
            return json({ error: 'Error al enviar el mensaje de WhatsApp', details: errorMessage }, { status: 500 });
        }

        return json({ success: true, message: 'Mensaje de WhatsApp enviado con éxito' }, { status: 200 });
    } catch (error: any) {
        console.error('Error al manejar la solicitud POST:', error);
        return json({ error: 'Error al procesar la solicitud', details: error.message }, { status: 500 });
    }
};

// Función interna para enviar un mensaje de WhatsApp a través de la API de WabaSMS
async function sendWhatsAppMessage(data: any) {
    try {
        // Datos necesarios para la API de WabaSMS desde las variables de entorno
        const secret = process.env.WABASMS_API_SECRET;
        const accountId = process.env.WABASMS_ACCOUNT_ID;
        const adminPhone = process.env.ADMIN_PHONE;

        if (!secret || !accountId || !adminPhone) {
            throw new Error('Faltan variables de entorno necesarias.');
        }

        // Construir el payload para WabaSMS
        const whatsappPayload = {
            secret,
            account: accountId,
            recipient: data.recipient, // Número de teléfono del destinatario
            type: 'text',
            message: data.message, // Mensaje a enviar
            priority: 2 // Prioridad (1 = prioridad, 2 = normal)
        };

        // Realizar la petición POST a la API de WabaSMS
        const response = await fetch('https://wabasms.com/api/send/whatsapp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(whatsappPayload),
        });

        return response;
    } catch (error) {
        console.error('Error al enviar el mensaje de WhatsApp:', error);
        throw error;
    }
}
