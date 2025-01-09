// $lib/api.ts
export async function procesarPagoConApiExterna(idFactura: number, monto: number, metodo: string) {
  const apiUrl = 'https://billing.corpintelco.com/api/v1/PaidInvoice';
  const token = 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09'; // El token de la API externa

  const body = {
    token,
    idfactura: idFactura,
    cantidad: monto,
    pasarela: metodo // Método de pago (Efectivo, Pago Móvil, Zelle)
  };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al llamar a la API externa:', error);
    throw new Error('Error al procesar el pago en la API externa.');
  }
}
