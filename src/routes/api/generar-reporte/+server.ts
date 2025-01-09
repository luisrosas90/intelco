// src/routes/api/generar-reporte/+server.ts
import { jsPDF } from 'jspdf';
import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const GET = async () => {
  try {
    // Consulta para obtener todas las transacciones del día
    const [rows] = await pool.execute(`
      SELECT cajero_id, cliente_id, metodo_pago, monto, referencia_pago, created_at
      FROM historial_transacciones
      WHERE DATE(created_at) = CURDATE()
    `);

    if (rows.length === 0) {
      return json({ success: false, message: 'No hay transacciones registradas hoy.' });
    }

    // Crear PDF usando jsPDF
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Reporte Diario de Transacciones', 10, 10);

    rows.forEach((transaccion, index) => {
      doc.setFontSize(12);
      doc.text(`Transacción ${index + 1}:`, 10, 20 + index * 10);
      doc.text(`Cajero ID: ${transaccion.cajero_id}`, 10, 30 + index * 10);
      doc.text(`Cliente ID: ${transaccion.cliente_id}`, 10, 40 + index * 10);
      doc.text(`Método de Pago: ${transaccion.metodo_pago}`, 10, 50 + index * 10);
      doc.text(`Monto: ${transaccion.monto} Bs`, 10, 60 + index * 10);
      doc.text(`Referencia Pago: ${transaccion.referencia_pago}`, 10, 70 + index * 10);
      doc.text(`Fecha: ${new Date(transaccion.created_at).toLocaleDateString()}`, 10, 80 + index * 10);
    });

    const pdfPath = path.resolve('static/reports', `reporte_diario_${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, doc.output('arraybuffer'));

    return json({ success: true, message: 'Reporte generado correctamente', pdfUrl: `/reports/${path.basename(pdfPath)}` });
  } catch (error) {
    console.error('Error al generar el reporte:', error);
    return json({ success: false, message: 'Error al generar el reporte.' });
  }
};
