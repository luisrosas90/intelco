// src/lib/apiExternal.ts

export interface ExternalPaymentPayload {
    token: string;
    idfactura: number;
    pasarela: string;
    cantidad: number;
    idtransaccion: string;
  }
  
  export interface ExternalPaymentResponse {
    estado: string;
    salida?: string;
    mensaje?: string;
    id?: number;
  }
  
  // Función que procesa el pago con la API externa
  export const procesarPagoConApiExterna = async (payload: ExternalPaymentPayload): Promise<ExternalPaymentResponse> => {
    const API_URL = 'https://billing.corpintelco.com/api/v1/PaidInvoice';
  
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API externa: ${response.statusText}`);
      }
  
      const data: ExternalPaymentResponse = await response.json();
      console.log('Respuesta de la API externa:', data);
  
      return data;
    } catch (error) {
      console.error('Error al procesar el pago con la API externa:', error);
      throw new Error('Error al procesar el pago en la API externa');
    }
  };
  