import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import type { RowDataPacket } from 'mysql2'; // Importa RowDataPacket

interface CountResult extends RowDataPacket {
  totalClientes: number;
  totalReportesPendientes: number;
  totalCajeros: number;
}

export const GET: RequestHandler = async () => {
  try {
    // Consultar el número total de clientes
    const [[clientes]]: [CountResult[], any] = await pool.query('SELECT COUNT(*) AS totalClientes FROM clientes');

    // Consultar el número de reportes pendientes
    const [[reportesPendientesResult]]: [CountResult[], any] = await pool.query(
      "SELECT COUNT(*) AS totalReportesPendientes FROM pagos WHERE estado = 'pendiente'"
    );

    // Consultar el número total de cajeros
    const [[cajeros]]: [CountResult[], any] = await pool.query('SELECT COUNT(*) AS totalCajeros FROM cajeros');

    return json({
      success: true,
      totalClientes: clientes.totalClientes,
      totalReportesPendientes: reportesPendientesResult.totalReportesPendientes,
      totalCajeros: cajeros.totalCajeros,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return json({ success: false, message: 'Error fetching dashboard data.' }, { status: 500 });
  }
};