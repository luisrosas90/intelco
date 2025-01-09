import mysql from 'mysql2/promise';

// Configura la conexión con tus credenciales
export const pool = mysql.createPool({
  host: '144.126.147.164',
  user: 'corpinte_reporte',
  password: 'Lam1414*$',
  database: 'corpinte_reporte',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});