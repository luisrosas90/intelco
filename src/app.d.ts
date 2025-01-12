declare global {
	namespace App {
	  interface Locals {
		userId?: number; // Usar userId directamente
		user?: string; // Usar user para el nombre de usuario
		token?: string; // Usar token directamente
		role?: string; // Usar role directamente
	  }
	  // No necesitas modificar PageData para el caso de uso de cajero
	  // interface PageData {
	  //   user: {
	  //     id: number;
	  //     name: string;
	  //   };
	  // }
	}
  }
  
  export {};