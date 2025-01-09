// src/lib/types/index.ts
export interface ClientData {
    id: number;
    nombre: string;
    estado: string;
    correo: string;
    telefono: string;
    movil: string;
    cedula: string;
    direccion_principal: string;
    facturacion: {
      facturas_nopagadas: number;
      total_facturas: string;
    };
    servicios: Servicio[];
  }

    export interface Servicio {
      tiposervicio: string;
      direccion: string;
      perfil: string;
    }
  
  export interface DebtData {
    IDFactura: number;
    detalle: string;
    valor: number;
  }
  export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'admin' | 'user';
  }
  export interface HistorialEntry {
    fecha: string;
    descripcion: string;
    monto: number;
  }

  export interface Reporte {
    fecha: string;
    descripcion: string;
    monto: number;
  }

export interface Historial {
  fecha: string;
  descripcion: string;
  monto: number;
}
