import mysql from 'mysql2/promise';

// Configura la conexión con tus credenciales
export const pool = mysql.createPool({
  host: '23.227.167.122',
  user: 'telehostca_intelco',
  password: 'Lam1414*$',
  database: 'telehostca_intelco',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});