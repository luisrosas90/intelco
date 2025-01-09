import { pool } from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
  try {
    // Consultar el número total de clientes
    const [clientes]: any = await pool.query('SELECT COUNT(*) AS totalClientes FROM clientes');
    
    // Consultar el número de reportes pendientes de validación
    const [reportesPendientes]: any = await pool.query('SELECT COUNT(*) AS totalReportesPendientes FROM reportes_pagos WHERE estado = "pendiente de validación"');
    
    // Consultar el número total de cajeros
    const [cajeros]: any = await pool.query('SELECT COUNT(*) AS totalCajeros FROM cajeros');

    return json({
      success: true,
      totalClientes: clientes[0].totalClientes,
      totalReportesPendientes: reportesPendientes[0].totalReportesPendientes,
      totalCajeros: cajeros[0].totalCajeros,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return json({ success: false, message: 'Error fetching dashboard data.' }, { status: 500 });
  }
};
