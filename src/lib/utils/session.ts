// $lib/utils/session.ts
interface Session {
  role?: string;
}

export function getUserRoleFromSession(session: Session): string {
  if (!session || !session.role) {
    console.warn('Sesión no válida o sin rol definido. Estableciendo el rol a "guest".');
    return 'guest'; // Valor predeterminado si no se encuentra el rol
  }

  console.log('Rol de usuario encontrado en la sesión:', session.role);
  return session.role; // Devolver el rol si está presente en la sesión
}
