import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions: Actions = {
  default: async ({ request }) => {
    const formData = await request.formData();
    const monto = formData.get('monto');

    if (!monto) {
      return fail(400, { error: 'El monto es requerido' });
    }

    // Procesar el pago

    return { success: true };
  }
};
