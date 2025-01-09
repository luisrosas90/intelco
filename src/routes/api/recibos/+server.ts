// src/routes/api/recibos/+server.ts
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';
import type { RequestHandler } from '@sveltejs/kit';
import type { ResultSetHeader } from 'mysql2';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const formData = await request.formData();
    const clienteId = formData.get('cliente_id');
    const monto = formData.get('monto');
    const metodoPago = formData.get('metodo_pago');
    const referenciaPago = formData.get('referencia_pago');
    const pdf = formData.get('pdf') as Blob;

    // Verifica que los datos esenciales estén presentes
    if (!clienteId || !monto || !metodoPago || !referenciaPago || !pdf) {
      return json({ message: 'Faltan datos obligatorios' }, { status: 400 });
    }

    // Insertar datos en la base de datos
    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO recibos (cliente_id, monto, metodo_pago, referencia_pago, created_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [clienteId, monto, metodoPago, referenciaPago]
    );

    const insertId = result.insertId;

    // Guardar el PDF en el servidor
    const filePath = path.resolve(`./static/recibos/recibo_${insertId}.pdf`);
    const buffer = Buffer.from(await pdf.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    return json({ message: 'Recibo registrado correctamente', reciboId: insertId }, { status: 201 });
  } catch (error) {
    console.error('Error al insertar el recibo:', error);
    return json({ message: 'Error al insertar el recibo' }, { status: 500 });
  }
};
