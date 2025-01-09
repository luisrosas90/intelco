 // src/routes/api/users/+server.ts
 import type { RequestHandler } from '@sveltejs/kit';
 import { json } from '@sveltejs/kit';
 import { pool } from '$lib/db';

// // Obtener lista de usuarios
 export const GET: RequestHandler = async () => {
   try {
     const [rows] = await pool.query('SELECT * FROM usuarios');
     return json(rows);
   } catch (err) {
     console.error('Error al obtener usuarios:', err);
     return json({ error: 'Error al obtener usuarios' }, { status: 500 });
   }
 };

// // Crear un nuevo usuario
 export const POST: RequestHandler = async ({ request }) => {
   const { nombre, email, rol } = await request.json();

   try {
     const [result] = await pool.query(
       'INSERT INTO usuarios (nombre, email, rol) VALUES (?, ?, ?)',
       [nombre, email, rol]
     );

     return json({ id: result.insertId, nombre, email, rol }, { status: 201 });
   } catch (err) {
     console.error('Error al crear usuario:', err);
     return json({ error: 'Error al crear usuario' }, { status: 500 });
   }
 };

// // Actualizar usuario existente
 export const PUT: RequestHandler = async ({ request }) => {
   const { id, nombre, email, rol } = await request.json();

   try {
     const [result] = await pool.query(
       'UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE id = ?',
       [nombre, email, rol, id]
     );

     if (result.affectedRows === 0) {
       return json({ error: 'Usuario no encontrado' }, { status: 404 });
     }

     return json({ id, nombre, email, rol });
   } catch (err) {
     console.error('Error al actualizar usuario:', err);
     return json({ error: 'Error al actualizar usuario' }, { status: 500 });
   }
 };

// // Eliminar un usuario
 export const DELETE: RequestHandler = async ({ request }) => {
   const { id } = await request.json();

   try {
     const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);

     if (result.affectedRows === 0) {
       return json({ error: 'Usuario no encontrado' }, { status: 404 });
     }

     return json({ message: 'Usuario eliminado' });
   } catch (err) {
     console.error('Error al eliminar usuario:', err);
     return json({ error: 'Error al eliminar usuario' }, { status: 500 });
   }
 };
