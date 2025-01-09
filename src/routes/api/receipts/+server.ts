// src/routes/api/receipts/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

export const POST: RequestHandler = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get('pdf') as File;

  if (!file) {
    return json({ message: 'Archivo no proporcionado' }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const filePath = path.join('receipts', file.name);

  try {
    fs.writeFileSync(filePath, Buffer.from(buffer));
    return json({ message: 'PDF guardado correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar el PDF:', error);
    return json({ message: 'Error al guardar el PDF' }, { status: 500 });
  }
};
