import type { RequestHandler } from './$types';
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import { cajerosConfig } from '$lib/config/cajeros'; // Importar la configuración de cajeros

export const POST: RequestHandler = async ({ request, cookies }) => {
  try {
    const { clienteId, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono, cedula, valorEnBsConImpuesto, valorEnBs, selectedCurrency } = await request.json();

    // Obtener el ID del cajero desde la sesión
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

    // AGREGAR idCajero al log
    console.log('Datos recibidos en el servidor:', { clienteId, montoEnUsd, facturaId, selectedMethod, referenceNumber, banco, telefono, cedula, idCajero, selectedCurrency, valorEnBsConImpuesto, valorEnBs });

    // Verificar si la factura ya ha sido reportada en la tabla pagos
    const [facturaResult] = await pool.execute<RowDataPacket[]>(
      `SELECT id FROM pagos WHERE factura_id = ?`,
      [facturaId]
    );

    if (Array.isArray(facturaResult) && facturaResult.length > 0) {
      return json({ success: false, message: 'La factura ya ha sido pagada anteriormente.' }, { status: 400 });
    }

    // Insertar reporte de pago en la base de datos
    const estado = 'pendiente de validación';
    const montoBs = selectedCurrency === 'BS' ? valorEnBsConImpuesto : valorEnBs;

    const [result] = await pool.execute<ResultSetHeader>(
      `
        INSERT INTO reportes_pagos (id_cajero, cliente_id, metodo_pago, monto, monto_bs, factura_id, estado, referencia_pago, moneda, telefono, banco, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `,
      [idCajero, clienteId, selectedMethod, montoEnUsd, montoBs, facturaId, estado, referenceNumber, selectedCurrency, telefono, banco] // Incluir montoBs en los valores
    );


    console.log('Reporte de pago registrado en la base de datos:', result);

    return json({ success: true, message: 'Reporte de pago registrado correctamente.' });
  } catch (error) {
    console.error('Error al procesar el reporte de pago:', error);
    return json({ success: false, message: 'Error al procesar el reporte de pago.' }, { status: 500 });
  }
};