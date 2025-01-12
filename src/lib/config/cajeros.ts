// $lib/config/cajeros.ts
interface Cajero {
  id: number; // Agregar el ID del cajero
  usuario: string;
  clave: string;
  token: string;
}

export const cajerosConfig: { [key: string]: Cajero } = {
  cajero1: {
    id: 1, // ID de cajero1 en la base de datos
    usuario: 'cajero1',
    clave: 'caja@intelco24',
    token: 'Z0VYemthUURWVDRXTi9VL29pZG5yQT09' //caja: Principal pass: caja@intelco24
  },
  cajero2: {
    id: 2, // ID de cajero1 en la base de datos
    usuario: 'cajero2',  // Ahora 'mantecal' está correctamente definido aquí
    clave: 'cajaarismedi@intelco24',
    token: 'UWo2OGlnYS8wdE52UFlZZ2V1MXVJZz09' //cajaarismedi pass: cajaarismedi@intelco24
    
  },
  cajero3: {
    id: 3, // ID de cajero1 en la base de datos
    usuario: 'cajero3',
    clave: 'cajamantecal@intelco24',
    token: 'RXZLb3p4V1RyRW0xQ2lKd2dhSjYvZz09' //cajamantecal pass: cajamantecal@intelco24
  },
  cajero4: {
    id: 4, // ID de cajero1 en la base de datos
    usuario: 'cajero4',
    clave: 'cajatambor@intelco24',
    token: 'cEo2VzhRZkN0WjZXYXMvaTRrSnRJdz09' //cajatambor pass: cajatambor@intelco24
  },
  cajero5: {
    id: 5, // ID de cajero1 en la base de datos
    usuario: 'cajero5',
    clave: 'cajavegon@intelco24',
    token: 'ODREM1Jpc0FJaWRpUTAvN2libStiQT09' //cajavegon  pass: cajavegon@intelco24
  },
  cajero6: {
    id: 6, // ID de cajero1 en la base de datos
    usuario: 'cajero6',
    clave: 'cajasaman@intelco24',
    token: 'YWpPVXFQNDlMQytCY1JHdjJadWcvdz09' //cajasaman pass: cajasaman@intelco24
  },
  // Más cajeros...
};
