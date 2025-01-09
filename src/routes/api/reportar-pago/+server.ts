import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import { sendWhatsAppMessage } from '$lib/utils/whatsapp'; // Asegúrate de que esta ruta sea correcta
import type { RequestEvent } from '@sveltejs/kit';

export const POST = async ({ request }: RequestEvent) => {
    try {
        // Extraer los datos del cuerpo de la solicitud
        const { clienteId, nombreCliente, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono } = await request.json();

        // Validar los datos esenciales
        if (!clienteId || !montoEnUsd || !facturaId || !referenceNumber || !banco || !telefono) {
            return json({ message: 'Faltan datos obligatorios.' }, { status: 400 });
        }

        // Insertar el reporte de pago en la base de datos
        const estado = 'pendiente de validación';
        const [result] = await pool.execute(
            `
            INSERT INTO reportes_pagos (cliente_id, metodo_pago, monto, factura_id, estado, referencia_pago, moneda, telefono, banco)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `,
            [clienteId, selectedMethod, montoEnUsd, facturaId, estado, referenceNumber, 'USD', telefono, banco]
        );

        // Verificar si la inserción fue exitosa
        if (result.affectedRows === 0) {
            return json({ message: 'No se pudo registrar el pago en la base de datos.' }, { status: 500 });
        }

        // Enviar notificación de WhatsApp
        const adminPhoneNumber = process.env.ADMIN_PHONE;
        if (!adminPhoneNumber) {
            return json({ message: 'Número de teléfono del administrador no está configurado.' }, { status: 500 });
        }

        const reportUrl = `https://reporte.corpintelco.com/admin/reportes`;

        const whatsappMessage = `Nuevo pago reportado:
        - Cliente: ${nombreCliente}
        - Monto: ${montoEnUsd} USD
        - Banco: ${banco}
        - Referencia: ${referenceNumber}
        - Teléfono: ${telefono}
        
        Valida el reporte aquí: ${reportUrl}`;

        // Enviar el mensaje de WhatsApp
        const whatsappResponse = await sendWhatsAppMessage({
            recipient: adminPhoneNumber,
            message: whatsappMessage
        });

        if (!whatsappResponse.ok) {
            const errorDetails = await whatsappResponse.json();
            console.error('Error al enviar el mensaje de WhatsApp:', errorDetails);
            return json({ message: 'Error al enviar la notificación de WhatsApp, pero el pago fue registrado.' }, { status: 500 });
        }

        // Retornar éxito
        return json({ message: 'Pago registrado y notificación de WhatsApp enviada correctamente.' }, { status: 200 });

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        return json({ message: 'Error al procesar el pago.' }, { status: 500 });
    }
};
