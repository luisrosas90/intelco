// src/hooks.server.ts
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionCookie = event.cookies.get('session');

  if (sessionCookie) {
    const session = JSON.parse(sessionCookie);
    event.locals.userId = session.userId;
    event.locals.user = session.user;
    event.locals.token = session.token;
    event.locals.role = session.role;
  }

  const response = await resolve(event);
  return response;
};