import { json } from '@sveltejs/kit';
import { pool } from '$lib/db';
import type { RowDataPacket } from 'mysql2';

export const GET = async ({ params }) => {
    try {
        const facturaId = params.facturaId;

        const [facturaRows] = await pool.execute<RowDataPacket[]>(
            `SELECT * FROM reportes_pagos WHERE factura_id = ?`,
            [facturaId]
        );

        if (Array.isArray(facturaRows) && facturaRows.length > 0) {
            return json({ reportada: true });
        } else {
            return json({ reportada: false });
        }
    } catch (error) {
        console.error('Error al verificar el estado de la factura:', error);
        return json({ success: false, message: 'Error al verificar el estado de la factura.' }, { status: 500 });
    }
};
