// src/routes/api/admin/login/+server.ts
import { json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import { pool } from '$lib/db';

export const POST = async ({ request }) => {
  const { email, password } = await request.json();

  if (!email || !password) {
    return json(
      { success: false, message: 'Todos los campos son obligatorios.' },
      { status: 400 }
    );
  }

  try {
    // Consulta a la base de datos para obtener el administrador por email
    const [rows] = await pool.execute('SELECT * FROM admin WHERE email = ?', [email]);

    if ((rows as any[]).length === 0) {
      return json(
        { success: false, message: 'Administrador no encontrado.' },
        { status: 404 }
      );
    }

    const admin = (rows as any[])[0];

    // Verificar la contraseña usando bcrypt
    const validPassword = await bcrypt.compare(password, admin.password);

    if (!validPassword) {
      return json(
        { success: false, message: 'Contraseña incorrecta.' },
        { status: 403 }
      );
    }

    // Si la autenticación es exitosa
    return json(
      { success: true, message: 'Login exitoso', admin: { id: admin.id, email: admin.email } },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error en el login:', error);
    return json(
      { success: false, message: 'Error en el servidor.' },
      { status: 500 }
    );
  }
};
