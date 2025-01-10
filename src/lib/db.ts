import mysql from 'mysql2/promise';

// Configura la conexión con tus credenciales
export const pool = mysql.createPool({
  host: 'mysql-15c20a4b-luisrosas90-0df7.g.aivencloud.com',
  user: 'avnadmin',
  password: 'AVNS_2vQYyrDb6KoIUEFYxWX',
  database: 'laravel_migrated',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  port: 24335, 
});


