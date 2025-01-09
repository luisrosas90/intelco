// src/lib/utils/whatsapp.ts
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();
export async function sendWhatsAppMessage(data: any) {
    try {
        const secret = process.env.WABASMS_API_SECRET;
        const accountId = process.env.WABASMS_ACCOUNT_ID;
        const adminPhone = process.env.ADMIN_PHONE;

        if (!secret || !accountId || !adminPhone) {
            throw new Error('Faltan variables de entorno necesarias.');
        }

        const whatsappPayload = {
            secret,
            account: accountId,
            recipient: data.recipient,
            type: 'text',
            message: data.message,
            priority: 2,
        };

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
